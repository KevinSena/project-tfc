import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Teams tests', () => {
  let chaiHttpResponse: Response;

  it('Devolve todos os times', async () => {
    chaiHttpResponse = await chai.request(app).get('/teams');

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.be.an('array');
    expect(chaiHttpResponse.body[0]).to.have.all.keys(['id', 'teamName']);
  })

  it('Devolve o time expecificado pelo id', async () => {
    chaiHttpResponse = await chai.request(app).get('/teams/7');

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.be.an('object');
    expect(chaiHttpResponse.body).to.have.all.keys(['id', 'teamName']);
    expect(chaiHttpResponse.body.teamName).to.be.equal('Flamengo');
  })
})