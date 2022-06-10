import * as express from 'express';
import * as cors from 'cors';
import handleError from './middlewares/handleError';
import LoginRoute from './routes/LoginRoute';
import TeamsRoute from './routes/TeamsRoute';
import MatchesRoute from './routes/MatchesRoute';
import leaderboardRoute from './routes/LeaderboardRoute';

class App {
  public app: express.Express;
  // ...

  constructor() {
    this.app = express();
    this.config();
    // ...
  }

  private config():void {
    const accessControl: express.RequestHandler = (_req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,POST,DELETE,OPTIONS,PUT,PATCH');
      res.header('Access-Control-Allow-Headers', '*');
      next();
    };

    this.app.use(cors());
    this.app.use(accessControl);
    this.app.use(express.json());

    this.app.use('/login', LoginRoute);

    this.app.use('/teams', TeamsRoute);

    this.app.use('/matches', MatchesRoute);

    this.app.use('/leaderboard', leaderboardRoute);

    this.app.use(handleError);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
