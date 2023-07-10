FROM node:16 as builder
WORKDIR /home/node/app


RUN apt-get install -y \
    bash \
    curl \
    git \
    openssl

COPY package*.json ./

COPY tsconfig*.json ./

COPY /prisma /prisma

RUN npm ci

RUN npx prisma generate --schema /prisma/schema.prisma

COPY  . .

RUN npm run build

FROM node:16-buster-slim as production

WORKDIR /home/node/app

RUN apt-get update && apt-get install -y \
    openssl

COPY --from=builder /home/node/app ./

EXPOSE 4000

ENTRYPOINT ["node", "dist/src/index.js"]
