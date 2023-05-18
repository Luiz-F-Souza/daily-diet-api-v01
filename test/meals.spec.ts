import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../src/app";
import { execSync } from "node:child_process";
import supertest from "supertest";

describe('Meals Routes', () => {

  beforeAll(async () => {
    await app.ready()
  })
  afterAll(async () => {
    await app.close()
  })

  beforeEach(async () => {
    execSync("npm run knex -- migrate:rollback --all")
    execSync('npm run knex -- migrate:latest')
  })

  it('should NOT be able to create a new meal', async () => {
    const responseUnlogged = await supertest(app.server).post('/meals/new-meal').send({
      description:'Hambúrguer',
      isInsideDiet: false,
      eatenDate: '17/05/2023',
      eatenTime: '20:38'
    })

    // @ts-ignore
    expect(responseUnlogged.error.text).toEqual('Faça login antes de prosseguir')
  })
  it('should be able to create a new meal', async () => {

    const newUser = await supertest(app.server).post('/create-user').send({
      email: 'teste@teste.com',
      password: 'teste1234',
      name: "teste"
    })

    expect(newUser.statusCode).toEqual(201)

    const login = await supertest(app.server).post('/login').send({
      email:'teste@teste.com',
      password: 'teste1234'
    })

    expect(login.statusCode).toEqual(200)

    const emailCookie = login.get('Set-Cookie')

    const responseLogged = await supertest(app.server).post('/meals/new-meal').send({
      description:'Hambúrguer',
      isInsideDiet: false,
      eatenDate: '17/05/2023',
      eatenTime: '20:38'
    }).set('Cookie',emailCookie)

    expect(responseLogged.statusCode).toEqual(201)
    
  })

  it('should be able to list all of his meals', async () => {
    const newUser = await supertest(app.server).post('/create-user').send({
      email: 'teste@teste.com',
      password: 'teste1234',
      name: "teste"
    })

    expect(newUser.statusCode).toEqual(201)

    const login = await supertest(app.server).post('/login').send({
      email:'teste@teste.com',
      password: 'teste1234'
    })

    expect(login.statusCode).toEqual(200)

    const emailCookie = login.get('Set-Cookie')

    const createdMeal = await supertest(app.server).post('/meals/new-meal').send({
      description:'Hambúrguer',
      isInsideDiet: false,
      eatenDate: '17/05/2023',
      eatenTime: '20:38'
    }).set('Cookie',emailCookie)

    expect(createdMeal.statusCode).toEqual(201)

    const response = await supertest(app.server).get('/meals/all').set('Cookie',emailCookie)

    expect(response.body).toEqual(
      expect.objectContaining({
        allMeals: expect.arrayContaining([
          expect.objectContaining({
            user_email: 'teste@teste.com',
            description: 'Hambúrguer',
            updated_at: null,
            is_inside_diet: 0,
          })
        ]),
        registeredMealsQuantity: 1
      }
    ))

  })
})