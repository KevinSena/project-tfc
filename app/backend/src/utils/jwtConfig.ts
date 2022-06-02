import { Secret, SignOptions } from 'jsonwebtoken';
import { readFile } from 'fs/promises';

let secret: Secret = '';
readFile('../../jwt.evaluation.key', 'utf8').then((e:string) => {
  secret = e;
});
const configs: SignOptions = { algorithm: 'HS256', expiresIn: '3h' };

console.log(secret);

const jwtConfig = { secret, configs };

export default jwtConfig;
