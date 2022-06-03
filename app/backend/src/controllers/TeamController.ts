import { Request, Response, NextFunction } from 'express';
import { ITeamService } from '../services/ServiceInterfaces';
import { ITeamController } from './ControllInterfaces';

export default class TeamController implements ITeamController {
  constructor(private service: ITeamService) { }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.service.getAll();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const data = await this.service.getById(id);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
