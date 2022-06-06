import { Router } from 'express';
import { login } from '../controllers';

const LoginRoute = Router();

LoginRoute.get('/validate', (req, res, next) => login.validateToken(req, res, next))
  .post('/', (req, res, next) => login.getToken(req, res, next));

export default LoginRoute;
