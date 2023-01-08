FROM node:16.14.0-alpine as base
WORKDIR /usr/app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY . ./

FROM base as test
CMD [ "npm", "run", "test" ]

FROM base as dev
CMD [ "npm", "run", "start:dev" ]

FROM base as prod
CMD [ "npm", "run", "start:prod" ]
