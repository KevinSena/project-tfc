import { Request, Response, NextFunction } from 'express';
import { IMatchService } from '../services/ServiceInterfaces';
import { IMatchController } from './ControllInterfaces';

export default class MatchController implements IMatchController {
  constructor(private service: IMatchService) {}

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { inProgress } = req.query;
      let data;
      if (inProgress === 'false') {
        data = await this.service.getFinished();
      } else if (inProgress === 'true') {
        data = await this.service.getInProgress();
      } else {
        data = await this.service.getAll();
      }
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log(req.query.role);
      const { homeTeam, homeTeamGoals, awayTeam, awayTeamGoals, inProgress } = req.body;
      const data = await this.service
        .create({ homeTeam, homeTeamGoals, awayTeam, awayTeamGoals, inProgress });
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }
}
