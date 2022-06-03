import Teams from '../database/models/TeamModel';
import { ITeams, ITeamService } from './ServiceInterfaces';

export default class TeamService implements ITeamService {
  constructor(private model = Teams) {}

  async getAll(): Promise<ITeams[]> {
    const data = await this.model.findAll() as ITeams[];
    return data;
  }

  async getById(id: string): Promise<ITeams> {
    const data = await this.model.findByPk(id) as ITeams;
    return data;
  }
}
