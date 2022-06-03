import * as sinon from 'sinon';
import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Login tests', () => {
  let chaiHttpResponse: Response;

  it('Testa se o endpoint retorna os dados esperados', async () => {
    chaiHttpResponse = await chai.request(app)
      .post('/login').send({"email": "admin@admin.com", "password": "secret_admin"});
    
    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.be.an('object');
    expect(chaiHttpResponse.body.token).to.be.a('string');
    expect(chaiHttpResponse.body.user).to.have.all.keys(['id', 'username', 'role', 'email']);
  });

  // it('Deve retornar erro se email incorreto',async () => {
  //   chaiHttpResponse = await chai.request(app)
  //   .post('/login').send({email: 'admin@admin.com', password: 'secret_admin'});

  //   expect(chaiHttpResponse).to.have.status(200);
  //   expect(chaiHttpResponse.body).to.be.an('object');
  // })
});
