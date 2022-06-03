import { NextFunction, Request, Response } from 'express';
import ResError from '../utils/MyError';

function handleError(err: ResError, _req: Request, res: Response, _next:NextFunction): void {
  res.status(err.statusCode || 500).json({ message: err.message || 'Server Problem' });
}

export default handleError;
