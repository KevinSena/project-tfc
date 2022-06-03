import { NextFunction, Request, Response } from 'express';

export interface ILoginController{
  getToken(req: Request, res: Response, next: NextFunction): void
  validateToken(req: Request, res: Response, next: NextFunction): void
}
