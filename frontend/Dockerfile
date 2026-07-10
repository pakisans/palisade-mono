FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG PAYLOAD_URL
ARG NEXT_PUBLIC_SERVER_URL
ARG REVALIDATE_SECRET
ARG NEXT_PUBLIC_PAYLOAD_URL
ARG PAYLOAD_HOST

ENV PAYLOAD_URL=$PAYLOAD_URL
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV REVALIDATE_SECRET=$REVALIDATE_SECRET
ENV NEXT_PUBLIC_PAYLOAD_URL=$NEXT_PUBLIC_PAYLOAD_URL
ENV PAYLOAD_HOST=$PAYLOAD_HOST

RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json /app/next.config.js /app/jsconfig.json ./
# next.config.js radi require('./lib/redirects') na runtime-u (next start),
# pa taj fajl mora postojati u runner image-u — inače crash u restart petlji.
COPY --from=builder /app/lib/redirects.js ./lib/redirects.js

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node_modules/.bin/next", "start"]
