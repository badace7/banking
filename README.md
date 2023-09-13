## Installation

```bash
$ npm install
```

## Running the app

```bash
# watch mode
$ npm run start:dev

# and run docker container to execute postgreSQL database
$ docker run --name db -e POSTGRES_USER=bankuser -e POSTGRES_PASSWORD=bankpassword -e POSTGRES_DB=banking_db -p 5432:5432 -d postgres:14-alpine

# watch mode in container with docker-compose
$ docker-compose up --build
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
