import * as express from 'express';
import * as cors from 'cors';
import { login, teams } from './controllers';
import handleError from './middlewares/handleError';

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

    this.app.get('/login/validate', (req, res, next) => login.validateToken(req, res, next));
    this.app.post('/login', (req, res, next) => login.getToken(req, res, next));

    this.app.get('/teams', (req, res, next) => teams.getAll(req, res, next));
    this.app.get('/teams/:id', (req, res, next) => teams.getById(req, res, next));

    this.app.use(handleError);
  }

  public start(PORT: string | number):void {
    this.app.listen(PORT, () => console.log(`Running on port ${PORT}`));
  }
}

export { App };

// A execução dos testes de cobertura depende dessa exportação
export const { app } = new App();
