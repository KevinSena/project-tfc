import { Router } from 'express';
import { leaderboard } from '../controllers';

const leaderboardRoute = Router();

leaderboardRoute.get('/home', (req, res, next) => leaderboard.leaderHome(req, res, next))
  .get('/away', (req, res, next) => leaderboard.leaderAway(req, res, next))
  .get('/', (req, res, next) => leaderboard.leaderGeneral(req, res, next));

export default leaderboardRoute;
