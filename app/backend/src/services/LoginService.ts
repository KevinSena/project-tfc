import { StatusCodes } from 'http-status-codes';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import ResError from '../utils/MyError';
import Users from '../database/models/UserModel';
import config from '../utils/jwtConfig';

export default class LoginService {
  static async get(email: string, password: string): Promise<string> {
    const user = await Users.findOne({ where: { email } });
    if (!user) throw new ResError('Incorrect email or password', StatusCodes.UNAUTHORIZED);
    const isValid = await compare(password, user.password);
    if (!isValid) throw new ResError('Incorrect email or password', StatusCodes.UNAUTHORIZED);
    const token = sign({
      id: user.id,
      email: user.email,
      role: user.role,
      password: user.password,
    }, config.secret, config.configs);

    return token;
  }
}
