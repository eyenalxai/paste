FROM node:22-alpine AS base
ENV YARN_VERSION=4.4.0
ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry
# ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /usr/src/app

USER node

FROM base AS install-build
RUN apk add --no-cache yarn && mkdir -p /temp/install-build

COPY package.json yarn.lock .yarnrc.yml /temp/install-build/
COPY .yarn/releases/yarn-${YARN_VERSION}.cjs /temp/install-build/.yarn/releases/yarn-${YARN_VERSION}.cjs

RUN cd /temp/install-build && yarn install --immutable

FROM base AS install-run
RUN mkdir -p /temp/install-run

COPY package.json yarn.lock .yarnrc.yml /temp/install-run/
COPY .yarn/releases/yarn-${YARN_VERSION}.cjs /temp/install-run/.yarn/releases/yarn-${YARN_VERSION}.cjs

RUN cd /temp/install-run && yarn workspaces focus --production

FROM base AS build
COPY --from=install-build /temp/install-build/node_modules node_modules
COPY . .

ARG NEXT_PUBLIC_FRONTEND_URL
ARG NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION

ENV BUILD_TIME=True
RUN yarn run build

FROM base AS run
COPY --from=build /usr/src/app/.next ./.next
COPY --from=install-run /temp/install-run/node_modules node_modules
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