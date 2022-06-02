# NestJS API using gRPC

This is NestJS gRPC API using `NestJS` and `Prisma`.

## Install Dependencies

Using `yarn`.

```bash
yarn install
```

Or using `npm`.

```bash
npm install
```

if you using `npm`, make sure to change `Dockerfile` and `docker-compose.yml` too.

## Setup

Configure the `docker-compose.yml` file in your project root. Fill the `DATABASE_URL`, `MYSQL_ROOT_PASSWORD`, and `MYSQL_DATABASE`.

```yml
#...
environment:
      DATABASE_URL: mysql://YOUR_USER:YOUR_PASSWD@mysql:3306/YOUR_DB?schema=public

  mysql:
  #...
    environment:
      MYSQL_ROOT_HOST: '%'
      MYSQL_ROOT_PASSWORD: YOUR_PASSWD
      MYSQL_DATABASE: YOUR_DB
```

## Create local connection on Docker

To creating local connection between docker container, we can use `docker network`.

To create connection:

```bash
docker network create <network-name> --subnet=<subnet>

#Example

docker network grpc --subnet=172.18.0.0/16
```

After that, you can put the network settings on `docker-compose.yml`

```yml
    services:
        api:
            ...
        mysql:
            ...
    
    networks:
        default:
            external:
                name: grpc #example
```

To know container ip address after connecting with the network that we create, we can use `docker network inspect <network-name>`.

```bash
docker network inspect grpc

[
    name: "grpc",
    ...

    "Containers": {
            "1": {
                "Name": "grpc-mysql-1",
                ...
                "IPv4Address": "172.18.0.2/16",
                "IPv6Address": ""
            },
            "2": {
                "Name": "grpc-todo-service",
                ...
                "IPv4Address": "172.18.0.3/16",
                "IPv6Address": ""
            },
            "3": {
                "Name": "grpc-api-gateway",
                ...
                "IPv4Address": "172.18.0.4/16",
                "IPv6Address": ""
            }
    }
    ...
]
```

After knowing the IP address of each container, you can fill the `GRPC_CONNECTION_URL` with IP address and port of gRPC services.

## Environment variables

For environment variables, we can create `.env` files on each service or gateway. Or, you can use `environment` on `docker-compose.yml` files.
As example:

```yml

## Gateway
services:
        gateway:
            ...
        environment:
            NODE_ENV: dev
            COMPOSE_PROJECT_NAME: grpc
            GRPC_CONNECTION_URL: 172.18.0.3:3001
            

## Service
services:
        api:
            ...
        environment:
            NODE_ENV: dev
            COMPOSE_PROJECT_NAME: grpc
            GRPC_CONNECTION_URL: 0.0.0.0:3001
            DATABASE_URL: mysql://YOUR_USER:YOUR_PASSWD@mysql:3306/YOUR_DB?schema=public

```

## Run on development

For running on development environment, we can use `docker-compose`.

```bash
docker-compose up -d --build
```

For debugging the app, on `docker-compose.yml` and `package.json` already configured for listening at port `9229`.

```json
"start:debug": "nest start --debug 0.0.0.0:9229 --watch",
```

```yml
ports:
      - '3001:3001'
      - '9229:9229' # default debugging port on nodejs
    command: yarn run start:debug
```
