FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY packages/scoring-engine/package.json packages/scoring-engine/
COPY packages/shared/package.json packages/shared/

RUN npm install

COPY packages/scoring-engine packages/scoring-engine/
COPY packages/shared packages/shared/

RUN npm run build --workspace=@cencera/scoring-engine
RUN npm run build --workspace=@cencera/shared

FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/scoring-engine/dist ./scoring-engine

CMD ["node", "scoring-engine/index.js"]
