import * as chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');

import { app } from '../app';

import { Response } from 'superagent';
import { IMatches } from '../services/ServiceInterfaces';

chai.use(chaiHttp);

const { expect } = chai;

describe('Matches tests', () => {
  let chaiHttpResponse: Response;

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
    const token = await chai.request(app)
    .post('/login').send({email: 'admin@admin.com', password: 'secret_admin'});
    chaiHttpResponse = await chai.request(app).post('/matches').send({
      "homeTeam": 16,
      "awayTeam": 8,
      "homeTeamGoals": 2,
      "awayTeamGoals": 2,
      "inProgress": true
    }).set({ "authorization": token.body.token });

    expect(chaiHttpResponse).to.have.status(201);
    expect(chaiHttpResponse.body).to.be.an('object');
    expect(chaiHttpResponse.body).to.have.all.keys(['id', 'homeTeam', 'homeTeamGoals', 'awayTeam', 'awayTeamGoals', 'inProgress']);
  })

  it('Finaliza partida em andamento', async () => {
    const token = await chai.request(app)
    .post('/login').send({email: 'admin@admin.com', password: 'secret_admin'});
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

  it('Não é possível dois times iguais na mesma partida', async () => {
    const token = await chai.request(app)
      .post('/login').send({email: 'admin@admin.com', password: 'secret_admin'});
    chaiHttpResponse = await chai.request(app).post('/matches').send({
      "homeTeam": 16,
      "awayTeam": 16,
      "homeTeamGoals": 2,
      "awayTeamGoals": 2,
      "inProgress": true
    }).set({ "authorization": token.body.token });

    expect(chaiHttpResponse).to.have.status(401);
    expect(chaiHttpResponse.body.message).to.be.eqls('It is not possible to create a match with two equal teams')
  })

  it('Não é possível cadastrar time não existente', async () => {
    const token = await chai.request(app)
      .post('/login').send({email: 'admin@admin.com', password: 'secret_admin'});
    chaiHttpResponse = await chai.request(app).post('/matches').send({
      "homeTeam": 100,
      "awayTeam": 16,
      "homeTeamGoals": 2,
      "awayTeamGoals": 2,
      "inProgress": true
    }).set({ "authorization": token.body.token });

    expect(chaiHttpResponse).to.have.status(404);
    expect(chaiHttpResponse.body.message).to.be.eqls('There is no team with such id!')
  })

  it('Finaliza partida em andamento', async () => {
    const token = await chai.request(app)
    .post('/login').send({email: 'admin@admin.com', password: 'secret_admin'});
    const inProgress = await chai.request(app).post('/matches').send({
      "homeTeam": 3,
      "awayTeam": 2,
      "homeTeamGoals": 1,
      "awayTeamGoals": 1,
      "inProgress": true
    }).set({ "authorization": token.body.token });

    chaiHttpResponse = await chai.request(app).patch(`/matches/${inProgress.body.id}`)
      .send({ "homeTeamGoals": 2, "awayTeamGoals": 3, })
      .set({ "authorization": token.body.token });

    expect(chaiHttpResponse).to.have.status(200);
    expect(chaiHttpResponse.body.homeTeamGoals).to.be.eqls(2)
    expect(chaiHttpResponse.body.awayTeamGoals).to.be.eqls(3)
  })
})