import { Router } from 'express';
import { login, matches } from '../controllers';

const MatchesRoute = Router();

MatchesRoute.get('/', (req, res, next) => matches.getAll(req, res, next))
  .post(
    '/',
    (req, res, next) => login.isAdmin(req, res, next),
    (req, res, next) => matches.create(req, res, next),
  );

export default MatchesRoute;
