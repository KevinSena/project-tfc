import { Router } from 'express';
import { teams } from '../controllers';

const TeamsRoute = Router();

TeamsRoute.get('/', (req, res, next) => teams.getAll(req, res, next))
  .get('/:id', (req, res, next) => teams.getById(req, res, next));

export default TeamsRoute;
