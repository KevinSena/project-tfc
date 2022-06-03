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

  it('Deve retornar erro se email incorreto',async () => {
    chaiHttpResponse = await chai.request(app)
    .post('/login').send({email: 'eu@myself.com', password: 'secret_admin'});
    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse.body.message).to.be.equal('Incorrect email or password');
  })

  it('Deve retornar erro se senha incorreta',async () => {
    chaiHttpResponse = await chai.request(app)
    .post('/login').send({email: 'admin@admin.com', password: 'secret_user'});
    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse.body.message).to.be.equal('Incorrect email or password');
  })

  it('Deve retornar erro se não tiver email',async () => {
    chaiHttpResponse = await chai.request(app)
    .post('/login').send({email: '', password: 'secret_admin'});
    expect(chaiHttpResponse).to.have.status(400);
    expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled');
  })

  it('Deve retornar erro se não tiver senha',async () => {
    chaiHttpResponse = await chai.request(app)
    .post('/login').send({email: 'admin@admin.com', password: ''});
    expect(chaiHttpResponse).to.have.status(400);
    expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled');
  })

  it('Deve retornar role correta',async () => {
    chaiHttpResponse = await chai.request(app)
    .post('/login').send({email: 'admin@admin.com', password: 'secret_admin'});
    const role = await chai.request(app).get('/login/validate').set({ "authorization": chaiHttpResponse.body.token });

    expect(role).to.have.status(200);
    expect(role.body).to.be.equal('admin');
  })

  // it('Deve retornar erro se não tiver senha',async () => {
  //   chaiHttpResponse = await chai.request(app)
  //   .post('/login').send({email: 'admin@admin.com', password: ''});
  //   expect(chaiHttpResponse).to.have.status(400);
  //   expect(chaiHttpResponse.body.message).to.be.equal('All fields must be filled');
  // })
});
