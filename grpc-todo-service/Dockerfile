FROM node:14

WORKDIR /usr/src/grpc_todo_service

COPY package.json ./

RUN yarn

COPY . .

RUN yarn build && \
    yarn cache clean

RUN npx prisma generate

CMD ["node", "dist/main"]