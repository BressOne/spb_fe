FROM node:18.17.1-alpine3.18

RUN mkdir -p /usr/src
WORKDIR /usr/src

COPY . /usr/src

COPY package*.json ./

RUN yarn

RUN yarn build

COPY . .

EXPOSE 3000
CMD yarn start