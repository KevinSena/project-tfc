import * as sinon from 'sinon';
import * as chai from 'chai';
import * as jwt from 'jsonwebtoken';
import * as test from 'jest/';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';
import Users from '../database/models/UserModel'

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Login tests', () => {
  let chaiHttpResponse: Response;

  beforeEach(async () => {
    sinon
      .stub(Users, "findOne")
      .resolves({
        id: 1,
        username: "Admin",
        role: "admin",
        email: "admin@admin.com"
      } as Users);

    sinon.stub(jwt, 'sign').resolves("123.456.789");
  });

  afterEach(()=>{
    (Users.findOne as sinon.SinonStub).restore();
    (jwt.sign as sinon.SinonStub).restore();
  })

  it('Testa se o endpoint retorna os dados esperados', async (done) => {
    chaiHttpResponse = await chai.request(app)
      .post(JSON.stringify({email: 'test@test.com', password: '123456'}));

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.be.equal({
      "user": {
        "id": 1,
        "username": "Admin",
        "role": "admin",
        "email": "admin@admin.com"
      },
      "token": "123.456.789"
    });
    console.log(chaiHttpResponse);
  });
});
