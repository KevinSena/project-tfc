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

  validateToken(req: Request, res: Response, next: NextFunction): void {
    try {
      const { authorization } = req.headers;
      const role = this.service.validateToken(authorization as string);
      res.status(200).json(role);
    } catch (error) {
      next(error);
    }
  }
}
