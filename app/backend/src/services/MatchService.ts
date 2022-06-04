import Teams from '../database/models/TeamModel';
import Matches from '../database/models/MatchModel';
import { IMatches, IMatchService } from './ServiceInterfaces';

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
}
