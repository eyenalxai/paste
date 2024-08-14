FROM node:22-slim AS base
ENV YARN_VERSION 4.4.0
ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry
# ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

RUN apt-get update && apt-get install -y yarnpkg

COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases/yarn-${YARN_VERSION}.cjs .yarn/releases/yarn-${YARN_VERSION}.cjs

FROM base AS builder
WORKDIR /app

COPY --from=base /app .
COPY ./app ./app
COPY ./components ./components
COPY ./drizzle ./drizzle
COPY ./lib ./lib
COPY ./public ./public
COPY ./drizzle.config.ts ./drizzle.config.ts
COPY ./next.config.js ./next.config.js
COPY ./postcss.config.js ./postcss.config.js
COPY ./tailwind.config.js ./tailwind.config.js
COPY ./tsconfig.json ./tsconfig.json

ARG NEXT_PUBLIC_FRONTEND_URL

ENV BUILD_TIME TRUE
RUN yarn install --check-cache --immutable && yarn build

FROM base AS runner
WORKDIR /app

COPY --chown=node --from=builder /app/drizzle.config.ts ./
COPY --chown=node --from=builder /app/drizzle ./drizzle
COPY --chown=node --from=builder /app/next.config.js ./
COPY --chown=node --from=builder /app/.yarn ./.yarn
COPY --chown=node --from=builder /app/public ./public
COPY --chown=node --from=builder /app/.next ./.next
COPY --chown=node --from=builder /app/yarn.lock /app/package.json ./
COPY --chown=node --from=builder /app/node_modules ./node_modules

USER node

ENV BUILD_TIME FALSE
ENV HOST 0.0.0.0

ARG DATABASE_URL
ENV DATABASE_URL ${DATABASE_URL}

ARG PORT
ENV PORT ${PORT:-3000}

EXPOSE ${PORT}
CMD [ "yarn", "start" ]