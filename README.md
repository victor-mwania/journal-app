# journal-app

## How To Run Using Node

## Web

### Install Dependencies  

`cd app`

`npm install`


### Starting Application
 
`npm run start`

The web application can be accessed form `http://localhost:3000`


## API

### Install Dependencies  

`cd server`

`npm install`

Run `npm run prisma:client` to generate prisma client 

## Setting Up The Database

Create a postgres database. This can be done from a GUI application or terminal using `psql`

Set up `DATABASE_URL` environment variable as `DATABASE_URL=postgresql://postgres:postgres@localhost:5432/journal_db` where the values database, name, host, port can be changed according to where the host database

Run `prisma migrate deploy` to run the database migration which adds the required tables 

## Startin the API

Run `npm run start-dev` to start the server with nodemon which can be accessed from `http://localhost:4000`

