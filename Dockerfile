FROM node:lts-slim AS base
WORKDIR /app

# Copy package.json only to avoid potential Windows/Linux lockfile conflicts
COPY package.json ./

FROM base AS prod-deps
RUN npm install --omit=dev --legacy-peer-deps

FROM base AS build-deps
RUN npm install --legacy-peer-deps

FROM build-deps AS build
COPY . .
RUN npm run build

FROM base AS runtime
# Copy package.json for "type": "module" resolution
COPY package.json ./
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

ENV HOST=0.0.0.0
ENV PORT=8080
EXPOSE 8080

CMD ["node", "./dist/server/entry.mjs"]
