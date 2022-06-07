import { NextFunction, Request, Response } from 'express';

export interface ILoginController{
  getToken(req: Request, res: Response, next: NextFunction): void
  isAdmin(req: Request, res: Response, next: NextFunction): void
  validateToken(req: Request, res: Response, next: NextFunction): void
}

export interface ITeamController{
  getAll(req: Request, res: Response, next: NextFunction): Promise<void>
  getById(req: Request, res: Response, next: NextFunction): Promise<void>
}

export interface IMatchController{
  getAll(req: Request, res: Response, next: NextFunction): Promise<void>
  create(req: Request, res: Response, next: NextFunction): Promise<void>
  finish(req: Request, res: Response, next: NextFunction): Promise<void>
  update(req: Request, res: Response, next: NextFunction): Promise<void>
}
