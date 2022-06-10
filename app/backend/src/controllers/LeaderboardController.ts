import { NextFunction, Request, Response } from 'express';
import { ILeaderboardService } from '../services/ServiceInterfaces';
import { ILeaderboardController } from './ControllInterfaces';

export default class LeaderboardController implements ILeaderboardController {
  constructor(private service: ILeaderboardService) {}
  async leaderHome(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.service.leaderHome();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }

  async leaderAway(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await this.service.leaderAway();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  }
}
