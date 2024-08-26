FROM node:20-alpine AS base
ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry
# ENV NEXT_TELEMETRY_DISABLED 1

RUN apk add --no-cache yarn

WORKDIR /usr/src/app

FROM base AS install-build
RUN mkdir -p /temp/install-build

COPY package.json yarn.lock .yarnrc.yml /temp/install-build/
COPY .yarn/releases/yarn-*.cjs /temp/install-build/.yarn/releases/

RUN cd /temp/install-build && yarn install --immutable

FROM base AS install-run
RUN mkdir -p /temp/install-run

COPY package.json yarn.lock .yarnrc.yml /temp/install-run/
COPY .yarn/releases/yarn-*.cjs /temp/install-run/.yarn/releases/

RUN cd /temp/install-run && yarn workspaces focus --production

FROM base AS build
COPY --from=install-build /temp/install-build/node_modules node_modules
COPY . .

ARG NEXT_PUBLIC_FRONTEND_URL
ARG NEXT_PUBLIC_OPENAI_SYNTAX_DETECTION

ENV BUILD_TIME=True
RUN yarn run build

FROM base AS run

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=build --chown=nextjs:nodejs /usr/src/app/.next ./.next
COPY --from=install-run --chown=nextjs:nodejs /temp/install-run/node_modules node_modules
COPY --chown=nextjs:nodejs . .

USER nextjs

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