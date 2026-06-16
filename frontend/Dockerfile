FROM node:20-alpine AS base
WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN corepack enable

FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time args (passed from docker-compose build.args)
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
ENV NODE_ENV=production
# Next build is memory-hungry — cap heap so it doesn't OOM on small/shared servers
ENV NODE_OPTIONS=--max-old-space-size=2048

RUN pnpm build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app ./

EXPOSE 3000

CMD ["pnpm", "start"]
