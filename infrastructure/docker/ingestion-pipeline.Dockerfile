FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY packages/ingestion-pipeline/package.json packages/ingestion-pipeline/
COPY packages/shared/package.json packages/shared/

RUN npm install

COPY packages/ingestion-pipeline packages/ingestion-pipeline/
COPY packages/shared packages/shared/

RUN npm run build --workspace=@cencera/ingestion-pipeline
RUN npm run build --workspace=@cencera/shared

FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/ingestion-pipeline/dist ./ingestion-pipeline

CMD ["node", "ingestion-pipeline/index.js"]
