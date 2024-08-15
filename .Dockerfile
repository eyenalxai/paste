FROM node:22-slim AS base
ENV YARN_VERSION 4.4.0
ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry
# ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /usr/src/app

RUN apt-get update && apt-get install -y yarnpkg

FROM base AS install

RUN mkdir -p /temp/install

COPY package.json yarn.lock .yarnrc.yml /temp/install/
COPY .yarn/releases/yarn-${YARN_VERSION}.cjs /temp/install/.yarn/releases/yarn-${YARN_VERSION}.cjs

RUN cd /temp/install && yarn install --immutable

FROM base AS build

COPY --from=install /temp/install/node_modules node_modules
COPY --from=install /temp/install/package.json /temp/install/yarn.lock /temp/install/.yarnrc.yml ./
COPY --from=install /temp/install/.yarn .yarn
COPY . .

ARG NEXT_PUBLIC_FRONTEND_URL
ARG NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION

ENV BUILD_TIME TRUE
RUN yarn run build

FROM base AS runnder
COPY --from=install /temp/install/node_modules node_modules
COPY --from=build /usr/src/app/ .

USER node

ENV HOST 0.0.0.0

ARG DATABASE_URL
ENV DATABASE_URL ${DATABASE_URL}

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY ${OPENAI_API_KEY}

ARG PORT
ENV PORT ${PORT:-3000}
EXPOSE ${PORT}

ENV BUILD_TIME FALSE
ENTRYPOINT ["sh", "-c", "yarn run migrate && yarn run start"]