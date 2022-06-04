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
})