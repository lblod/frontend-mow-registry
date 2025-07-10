FROM node:22-slim  as builder

LABEL maintainer="info@redpencil.io"

RUN npm i -g corepack@0.33
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm i --frozen-lockfile
COPY . .
RUN pnpm build


FROM semtech/static-file-service:0.2.0
COPY --from=builder /app/dist /data



