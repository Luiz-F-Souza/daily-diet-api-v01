# Project Name:
  Daily Diet API

## Routes
- AUTH
  - To create a new user
    - /create-user
  - To login or logout
  - /login
  - /logout
- MEALS
  - To *CREATE NEW* meal
  - /meals/new-meal
  - To *LIST ALL* meals
    - /meals/all
  - To *LIST SPECIFIC* meal
    - /meals/:id
  - To *DELETE* a meal
    - /meals/delete/:id
  - To *EDIT* a meal
    - /meals/edit/:id
- METRICS
  - /metrics

## Technologies
- NodeJS
- TypeScript
- Fastify
- Knex
- Zod

## Instalation Process from 0:
- npm init -y
- npm i typescript --save-dev
  - npx tsc --init
- npm i dotenv
- npm i fastify
  - npm i @fastify/cookie
- npm install knex --save
  - npm install sqlite3 --save
- npm i zod
- npm i tsx -D
- npm i eslint -D
- npm i vitest -D
- npm i supertest -D
- npm i tsup -D

- ## Types packages
  - npm install @types/node --save-dev
  - npm install  @types/supertest --save-dev