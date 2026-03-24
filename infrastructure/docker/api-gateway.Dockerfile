FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
COPY packages/api-gateway/packages.json packages/api-gateway/
COPY packages/shared/package.json packages/shared/

RUN npm install

COPY packages/api-gateway packages/api-gateway/
COPY packages/shared packages/shared/

RUN npm run build --workspace=@cencera/api-gateway
RUN npm run build --workspace=@cencera/shared

FROM node:18-alpine

WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/packages/api-gateway/dist ./api-gateway

EXPOSE 3000
CMD ["node", "api-gateway/index.js"]
