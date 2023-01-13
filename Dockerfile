FROM node:16.14.0-alpine as base
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json", "tsconfig.json", ".env", "./"]
RUN npm ci
COPY . ./

FROM base as test
CMD [ "npm", "run", "test" ]

FROM base as dev
CMD [ "npm", "run", "start:dev" ]

FROM base as prod
CMD [ "npm", "run", "start:prod" ]
