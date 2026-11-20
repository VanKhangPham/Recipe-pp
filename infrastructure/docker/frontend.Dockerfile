# ==============================================================================
# RecipeHub Frontend Multi-Stage Dockerfile (Next.js 16 + React 19 + Turbopack)
# ==============================================================================

# Stage 1: Dependencies installation
FROM node:20-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

# Stage 2: Source builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ ./
ARG NEXT_PUBLIC_API_URL=""
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
ARG NEXT_PUBLIC_RESTORE_SESSION=false
ENV NEXT_PUBLIC_RESTORE_SESSION=${NEXT_PUBLIC_RESTORE_SESSION}
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=1536"
RUN npm run build

# Stage 3: Minimal production runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
# Copy build artifacts
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER nextjs
EXPOSE 3000

CMD ["npm", "run", "start"]
