FROM oven/bun:1 AS base
ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry
# ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /usr/src/app

FROM base AS install
RUN mkdir -p /temp/dev
COPY package.json bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

RUN mkdir -p /temp/prod
COPY package.json bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

FROM base AS build
COPY --from=install /temp/dev/node_modules node_modules
COPY . .
RUN ls -la

ARG NEXT_PUBLIC_FRONTEND_URL
ARG NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION

ENV BUILD_TIME TRUE
RUN bun run build

FROM base AS runnder
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=build /usr/src/app/ .

USER bun

ENV HOST 0.0.0.0

ARG DATABASE_URL
ENV DATABASE_URL ${DATABASE_URL}

ARG OPENAI_API_KEY
ENV OPENAI_API_KEY ${OPENAI_API_KEY}

ARG PORT
ENV PORT ${PORT:-3000}
EXPOSE ${PORT}/tcp

ENV BUILD_TIME FALSE
ENTRYPOINT ["sh", "-c", "bun run migrate && bun run start"]