FROM node:lts-slim AS base
WORKDIR /app

# Copy package.json
COPY package.json ./

FROM base AS build
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM base AS runtime
# Copy full node_modules from build (includes all deps needed by Astro at runtime)
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=8080
EXPOSE 8080

CMD ["node", "./dist/server/entry.mjs"]
