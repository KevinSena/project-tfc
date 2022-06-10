import { Router } from 'express';
import { leaderboard } from '../controllers';

const leaderboardRoute = Router();

leaderboardRoute.get('/home', (req, res, next) => leaderboard.leaderHome(req, res, next));

export default leaderboardRoute;
