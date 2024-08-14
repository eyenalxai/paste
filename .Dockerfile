FROM node:22-slim AS base
ENV YARN_VERSION 4.4.0
ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry
# ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y yarnpkg

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json yarn.lock .yarnrc.yml /temp/dev/
COPY .yarn/releases/yarn-${YARN_VERSION}.cjs /temp/dev/.yarn/releases/yarn-${YARN_VERSION}.cjs
RUN cd /temp/dev && yarn install --immutable

RUN mkdir -p /temp/prod
COPY package.json yarn.lock .yarnrc.yml /temp/prod/
COPY .yarn/releases/yarn-${YARN_VERSION}.cjs /temp/prod/.yarn/releases/yarn-${YARN_VERSION}.cjs
RUN cd /temp/prod && yarn install --immutable

FROM base AS build
COPY --from=install /temp/dev/node_modules node_modules
COPY --from=install /temp/dev/package.json /temp/dev/yarn.lock /temp/dev/.yarnrc.yml ./
COPY --from=install /temp/dev/.yarn .yarn
COPY . .
RUN ls -la

ARG NEXT_PUBLIC_FRONTEND_URL
ARG NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION

ENV BUILD_TIME TRUE
RUN yarn run build

FROM base AS runnder
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=build /usr/src/app/ .

USER node

ENV HOST 0.0.0.0

ARG DATABASE_URL
ENV DATABASE_URL ${DATABASE_URL}

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY ${OPENAI_API_KEY}

ARG PORT
ENV PORT ${PORT:-3000}
EXPOSE ${PORT}/tcp

ENV BUILD_TIME FALSE
ENTRYPOINT ["sh", "-c", "yarn run migrate && yarn run start"]