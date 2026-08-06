# syntax=docker/dockerfile:1

FROM node:22-alpine AS base
RUN corepack enable && corepack prepare pnpm@11.18.0 --activate
WORKDIR /app

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
COPY packages/shared/package.json packages/shared/
RUN pnpm install --frozen-lockfile

FROM deps AS build
COPY . .
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_PUBLISHABLE_KEY
ARG VITE_APP_NAME=Lexicon
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL \
    VITE_SUPABASE_PUBLISHABLE_KEY=$VITE_SUPABASE_PUBLISHABLE_KEY \
    VITE_APP_NAME=$VITE_APP_NAME
RUN pnpm build
RUN pnpm --filter=@lexicon/api deploy --prod --legacy /deploy \
  && rm -rf \
    /deploy/src \
    /deploy/aliases.ts \
    /deploy/tsconfig.json \
    /deploy/tsdown.config.ts \
    /deploy/vitest.config.ts \
    /deploy/.env \
    /deploy/.env.*

FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000 \
    WEB_DIST=/app/public
COPY --from=build /deploy/ ./
COPY --from=build /app/apps/web/dist/ ./public/
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then((r)=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"
CMD ["node", "dist/index.js"]
