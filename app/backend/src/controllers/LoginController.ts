import { NextFunction, Request, Response } from 'express';
import { ILoginService } from '../services/ServiceInterfaces';
import { ILoginController } from './ControllInterfaces';

export default class LoginController implements ILoginController {
  constructor(private service: ILoginService) {}

  async getToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const token = await this.service.getToken(email, password);
      res.status(200).json(token);
    } catch (error) {
      next(error);
    }
  }
}
