import Teams from '../database/models/TeamModel';
import Matches from '../database/models/MatchModel';
import { IMatchCreate, IMatches, IMatchService } from './ServiceInterfaces';
import ResError from '../utils/MyError';

export default class MatchService implements IMatchService {
  constructor(private model = Matches) { }

  async getAll(): Promise<IMatches[]> {
    const data = await this.model.findAll({ include: [
      { model: Teams, foreignKey: 'homeTeam', as: 'teamHome', attributes: { exclude: ['id'] } },
      { model: Teams, foreignKey: 'awayTeam', as: 'teamAway', attributes: { exclude: ['id'] } },
    ] });
    return data;
  }

  async getInProgress(): Promise<IMatches[]> {
    const data = await this.model.findAll({ include: [
      { model: Teams, foreignKey: 'homeTeam', as: 'teamHome', attributes: { exclude: ['id'] } },
      { model: Teams, foreignKey: 'awayTeam', as: 'teamAway', attributes: { exclude: ['id'] } },
    ],
    where: { inProgress: true } });
    return data;
  }

  async getFinished(): Promise<IMatches[]> {
    const data = await this.model.findAll({ include: [
      { model: Teams, foreignKey: 'homeTeam', as: 'teamHome', attributes: { exclude: ['id'] } },
      { model: Teams, foreignKey: 'awayTeam', as: 'teamAway', attributes: { exclude: ['id'] } },
    ],
    where: { inProgress: false } });
    return data;
  }

  async create(payload: IMatchCreate)
    : Promise<IMatches> {
    await this.isSameTeam(payload.homeTeam as number, payload.awayTeam as number);
    await this.teamsExist(payload.homeTeam as number, payload.awayTeam as number);
    const data = await this.model.create(payload);
    return data;
  }

  async finish(id: string): Promise<string> {
    const match = await this.model.findByPk(id) as Matches;
    match.inProgress = false;
    await match.save();
    return 'Finished';
  }

  async isSameTeam(team1: number, team2: number): Promise<void | undefined> {
    const first = await this.model.findByPk(team1);
    const second = await this.model.findByPk(team2);

    if (first?.id === second?.id) {
      throw new ResError('It is not possible to create a match with two equal teams', 401);
    }
  }

  async teamsExist(team1: number, team2: number): Promise<void | undefined> {
    const first = await this.model.findByPk(team1);
    const second = await this.model.findByPk(team2);

    if (!first || !second) throw new ResError('There is no team with such id!', 404);
  }

  async update(id: string, home: number, away: number): Promise<IMatches> {
    const match = await this.model.findByPk(id) as Matches;
    match.homeTeamGoals = home;
    match.awayTeamGoals = away;
    await match.save();
    return match;
  }
}
