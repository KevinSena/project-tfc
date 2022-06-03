import { NextFunction, Request, Response } from 'express';
import LoginService from '../services/LoginService';

export default class LoginController {
  static async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      console.log(req.body);
      const { email, password } = req.body;
      const token = await LoginService.getToken(email, password);
      res.status(200).json(token);
    } catch (error) {
      next(error);
    }
  }
}
