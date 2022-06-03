import { StatusCodes } from 'http-status-codes';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import ResError from '../utils/MyError';
import Users from '../database/models/UserModel';
import config from '../utils/jwtConfig';

export default class LoginService {
  static async getToken(email: string, comingPassword: string): Promise<object> {
    const user = await Users.findOne({ where: { email } });
    if (!user) throw new ResError('Incorrect email or password', StatusCodes.UNAUTHORIZED);
    const { id, username, role, password } = user;
    const isValid = await compare(comingPassword, user.password);
    if (!isValid) throw new ResError('Incorrect email or password', StatusCodes.UNAUTHORIZED);
    console.log();
    const token = sign({ id, email, role, password }, config.secret, config.configs);
    return {
      user: { id, username, role, email },
      token,
    };
  }
}
