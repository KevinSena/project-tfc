import { Secret, SignOptions } from 'jsonwebtoken';
import { readFileSync } from 'fs';

const secret: Secret = readFileSync('jwt.evaluation.key', 'utf-8');
const configs: SignOptions = { algorithm: 'HS256', expiresIn: '3h' };

export default { secret, configs };
