import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';

chai.use(chaiHttp);

const { expect } = chai;

describe('Leaderboard tests', () => {
  let chaiHttpResponse: Response;

  it('Devolve a classificação por jogos em casa', async () => {
    chaiHttpResponse = await chai.request(app).get('/leaderboard/home');

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body[0].name).to.be.eqls('Santos')
    expect(chaiHttpResponse.body[0].totalPoints).to.be.eqls(9)
  })

  it('Devolve a classificação por jogos fora de casa', async () => {
    chaiHttpResponse = await chai.request(app).get('/leaderboard/away');

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body[0].name).to.be.eqls('Palmeiras')
    expect(chaiHttpResponse.body[0].totalPoints).to.be.eqls(6)
  })

  it('Devolve a classificação geral', async () => {
    chaiHttpResponse = await chai.request(app).get('/leaderboard');

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body[0].name).to.be.eqls('Palmeiras')
    expect(chaiHttpResponse.body[0].totalPoints).to.be.eqls(13)
  })
})