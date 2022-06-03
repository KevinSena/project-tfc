import { NextFunction, Request, Response } from 'express';
import ResError from '../utils/MyError';

function handleError(err: ResError, _req: Request, res: Response, _next:NextFunction): Response {
  const status = err.statusCode || 500;
  return res.status(status).send({ message: err.message || 'Server Problem' });
}

export default handleError;
