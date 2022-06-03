import { StatusCodes } from 'http-status-codes';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import ResError from '../utils/MyError';
import Users from '../database/models/UserModel';
import config from '../utils/jwtConfig';
import { ILoginService } from './ServiceInterfaces';

export default class LoginService implements ILoginService {
  private unauthorizedMessage: string;
  constructor(private model = Users) {
    this.unauthorizedMessage = 'Incorrect email or password';
  }

  async getToken(email: string, comingPassword: string): Promise<object> {
    if (!email || !comingPassword) {
      throw new ResError(this.unauthorizedMessage, StatusCodes.UNAUTHORIZED);
    }
    const user = await this.model.findOne({ where: { email } });
    if (!user) throw new ResError(this.unauthorizedMessage, StatusCodes.UNAUTHORIZED);
    const { id, username, role, password } = user;
    const isValid = await compare(comingPassword, user.password);
    if (!isValid) throw new ResError(this.unauthorizedMessage, StatusCodes.UNAUTHORIZED);
    const token = sign({ id, email, role, password }, config.secret, config.configs);
    return {
      user: { id, username, role, email },
      token,
    };
  }
}
