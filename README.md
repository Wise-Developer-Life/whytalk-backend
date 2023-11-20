# WhyTalk Back End System 
## Description
An online chatting app with matching service.

## Tech Stack
- NestJS
- PostgresQL
- Redis
- Socket.io
- RabbitMQ
- OAuth 2.0

## Installation

```bash
$ npm install
```

## Running the app in docker
```bash
$ docker-compose up -d
```

## Running the app on local
1. Adjust .env.<enviroment> file on local, ex. .env.development
```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
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

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## License

Nest is [MIT licensed](LICENSE).
