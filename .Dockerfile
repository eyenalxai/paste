FROM node:22-alpine AS base
ENV YARN_VERSION=4.4.0
ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry
# ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /usr/src/app

FROM base AS install-dev
RUN apk add --no-cache yarn && mkdir -p /temp/install-dev

COPY package.json yarn.lock .yarnrc.yml /temp/install-dev/
COPY .yarn/releases/yarn-${YARN_VERSION}.cjs /temp/install-dev/.yarn/releases/yarn-${YARN_VERSION}.cjs

RUN cd /temp/install-dev && yarn install --immutable

FROM base AS install-prod
RUN mkdir -p /temp/install-prod

COPY package.json yarn.lock .yarnrc.yml /temp/install-prod/
COPY .yarn/releases/yarn-${YARN_VERSION}.cjs /temp/install-prod/.yarn/releases/yarn-${YARN_VERSION}.cjs

RUN cd /temp/install-prod && yarn workspaces focus --production

FROM base AS build
COPY --from=install-dev /temp/install-dev/node_modules node_modules
COPY --from=install-dev /temp/install-dev/package.json /temp/install-dev/yarn.lock /temp/install-dev/.yarnrc.yml ./
COPY --from=install-dev /temp/install-dev/.yarn .yarn
COPY . .

ARG NEXT_PUBLIC_FRONTEND_URL
ARG NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION

ENV BUILD_TIME=True
RUN yarn run build

FROM base AS runnder
COPY --from=build /usr/src/app/.next ./.next
COPY --from=install-prod /temp/install-prod/node_modules node_modules
COPY . .

USER node

ENV HOST=0.0.0.0

ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY=${OPENAI_API_KEY}

ARG PORT
ENV PORT=${PORT:-3000}
EXPOSE ${PORT}

ENV BUILD_TIME=False
ENTRYPOINT ["sh", "-c", "node drizzle/migrate.mjs && yarn run start"]