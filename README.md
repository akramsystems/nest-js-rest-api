<p align="center">
<h1 align="center">
NestJS + Prisma + Postgres
</h1>
</p>

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="100" alt="Nest Logo" /></a>
</p>

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">

  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

---

## Description

This repository contains a backend API implemented using NestJS, a powerful framework for building efficient and scalable server-side applications. The API is connected to a Postgres database using Prisma, a modern ORM that provides a simple and intuitive way to interact with the database. The API exposes a set of endpoints for performing CRUD operations on the data stored in the database, such as creating, reading, updating, and deleting records. Additionally, the API uses NestJS' built-in support for GraphQL to provide a flexible and powerful way for clients to query the data. With this stack, you can quickly and easily build a robust, high-performance API for your application.

## Prerequisites

- [Node.js](https://nodejs.org/en/)
- [Postgres](https://www.postgresql.org/)
- [Prisma](https://www.prisma.io/)

## Installation

```bash
$ npm install
```

## Running the app

To start the application, run the following command:

```bash
# development
$ npm run start
```

## Building for production

```bash
# build
$ npm run build
```

## Testing

```bash
# unit tests
$ npm run test
```

## Prisma

This app uses Prisma for interaction with the database. To deploy the Prisma schema, use the following command:

```bash
$ npm run prisma:dev:deploy
```

## Docker

To run the app in a Docker container, use the following command:

```bash
$ docker-compose up
```

## License

Nest is [MIT licensed](LICENSE).
