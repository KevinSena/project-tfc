import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import { IMatches } from '../services/ServiceInterfaces';

chai.use(chaiHttp);

const { expect } = chai;

describe('Matches tests', async () => {
  let chaiHttpResponse: Response;
  const token = await chai.request(app)
    .post('/login').send({email: 'admin@admin.com', password: 'secret_admin'});

  it('Devolve todas as partidas, sem filtros', async () => {
    chaiHttpResponse = await chai.request(app).get('/matches');

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.be.an('array');
    expect(chaiHttpResponse.body[0]).to.have.all.keys(['id', 'homeTeam', 'homeTeamGoals', 'awayTeam', 'awayTeamGoals', 'inProgress', 'teamHome', 'teamAway']);
  })

  it('Devolve todas as partidas que estão em andamento', async () => {
    chaiHttpResponse = await chai.request(app).get('/matches').query({inProgress: true});

    const isEvery: boolean = chaiHttpResponse.body.every((e: IMatches) => e.inProgress === true)

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.be.an('array');
    expect(chaiHttpResponse.body[0]).to.have.all.keys(['id', 'homeTeam', 'homeTeamGoals', 'awayTeam', 'awayTeamGoals', 'inProgress', 'teamHome', 'teamAway']);
    expect(isEvery).to.be.equal(true)
  })

  it('Devolve todas as partidas encerradas', async () => {
    chaiHttpResponse = await chai.request(app).get('/matches').query({inProgress: false});

    const isEvery: boolean = chaiHttpResponse.body.every((e: IMatches) => e.inProgress === false)

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body).to.be.an('array');
    expect(chaiHttpResponse.body[0]).to.have.all.keys(['id', 'homeTeam', 'homeTeamGoals', 'awayTeam', 'awayTeamGoals', 'inProgress', 'teamHome', 'teamAway']);
    expect(isEvery).to.be.equal(true)
  })

  it('Cria partida em andamento', async () => {
    chaiHttpResponse = await chai.request(app).post('/matches').send({
      "homeTeam": 16,
      "awayTeam": 8,
      "homeTeamGoals": 2,
      "awayTeamGoals": 2,
      "inProgress": true
    });

    expect(chaiHttpResponse).to.have.status(201);
    expect(chaiHttpResponse.body).to.be.an('object');
    expect(chaiHttpResponse.body).to.have.all.keys(['id', 'homeTeam', 'homeTeamGoals', 'awayTeam', 'awayTeamGoals', 'inProgress']);
  })

  it('Finaliza partida em andamento', async () => {
    const inProgress = await chai.request(app).post('/matches').send({
      "homeTeam": 16,
      "awayTeam": 8,
      "homeTeamGoals": 2,
      "awayTeamGoals": 2,
      "inProgress": true
    }).set({ "authorization": token.body.token });

    chaiHttpResponse = await chai.request(app).patch(`/matches/${inProgress.body.id}/finish`).set({ "authorization": token.body.token });

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body.message).to.be.eqls('Finished')
  })
})