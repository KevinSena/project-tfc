import { StatusCodes } from 'http-status-codes';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import ResError from '../utils/MyError';
import Users from '../database/models/UserModel';
import config from '../utils/jwtConfig';
import { ILoginService } from './ServiceInterfaces';

export default class LoginService implements ILoginService {
  private unauthorizedMessage: string;
  private blankSpaceMessage: string;
  constructor(private model = Users) {
    this.unauthorizedMessage = 'Incorrect email or password';
    this.blankSpaceMessage = 'All fields must be filled';
  }

  async validatePassword(comingPassword: string, password: string): Promise<void> {
    const isValid = await compare(comingPassword, password);
    if (!isValid) throw new ResError(this.unauthorizedMessage, StatusCodes.UNAUTHORIZED);
  }

  async getToken(email: string, comingPassword: string): Promise<object> {
    if (!email || !comingPassword) {
      throw new ResError(this.blankSpaceMessage, StatusCodes.BAD_REQUEST);
    }
    const user = await this.model.findOne({ where: { email } });
    if (!user) throw new ResError(this.unauthorizedMessage, StatusCodes.UNAUTHORIZED);
    const { id, username, role, password } = user;
    this.validatePassword(comingPassword, password);
    const token = sign({ id, email, role, password }, config.secret, config.configs);
    return {
      user: { id, username, role, email },
      token,
    };
  }
}
