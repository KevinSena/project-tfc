import { Secret, SignOptions, verify, sign } from 'jsonwebtoken';
import { readFileSync } from 'fs';
import { Iuser } from '../services/ServiceInterfaces';
import ResError from './MyError';

export default class JwtConfig {
  private secret: Secret;
  private configs: SignOptions;
  constructor() {
    this.secret = readFileSync('jwt.evaluation.key', 'utf-8');
    this.configs = { algorithm: 'HS256', expiresIn: '3h' };
  }

  crypt(payload: Iuser): string {
    return sign(payload, this.secret, this.configs);
  }

  decrypt(token: string): Iuser | undefined {
    const data = verify(token, this.secret, (err, decoded) => {
      if (err) throw new ResError(err.message, 400);
      return decoded;
    }) as Iuser | undefined;
    return data;
  }
}
