FROM node:14-alpine

RUN mkdir /home/node/app/ && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY ./package.json ./
COPY ./package-lock.json ./

USER node

RUN npm ci

COPY --chown=node:node . ./
RUN tsc

CMD ["node", "dist/index"]
