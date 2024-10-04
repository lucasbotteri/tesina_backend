# lel-manager

> Backend para el sistema para gestion de LEL para la tesina la UNLP

## Dependencies

- Node js - v8.11.1
- Postgres - v9.5.13

## Standard Installation & Configuration

- Create the development config file using in config directory

- Install dependecies with `npm install`

- Create database with `node_modules/.bin/sequelize db:create`

- Run the server

- Optional - Run seeds with `node_modules/.bin/sequelize db:seed:all` (You HAVE TO RUN first)

## Docker Installation & Configuration

To run the application using Docker:

1. Ensure you have Docker and Docker Compose installed on your system.

2. Clone the repository and navigate to the project directory.

3. Build and start the containers:

   ```
   docker compose up --build
   ```

4. Optional - To run the database seeds, execute the following command:

   ```
   docker compose exec app npm run sequelize db:seed:all
   ```

   Note: Make sure the application is fully up and running before executing this command.

5. You can now access the application at `http://localhost:3030`.

6. To stop the containers, use:
   ```
   docker-compose downp
   ```

## Running

`npm start`

## (Feathers)[https://docs.feathersjs.com/]

Feathers is a batteries included but entirely optional minimal web application framework.

To generate a Service whit the model, routes and service generation
`feathers g service`
