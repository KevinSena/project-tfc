import { StatusCodes } from 'http-status-codes';
import { compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import ResError from '../utils/MyError';
import Users from '../database/models/UserModel';
import config from '../utils/jwtConfig';
import { ILoginService, Iuser } from './ServiceInterfaces';

export default class LoginService implements ILoginService {
  private unauthorizedMessage: string;
  private blankSpaceMessage: string;
  private secret: string;
  constructor(private model = Users) {
    this.unauthorizedMessage = 'Incorrect email or password';
    this.blankSpaceMessage = 'All fields must be filled';
    this.secret = config.secret;
  }

  validateToken(token: string): string | undefined {
    const data = verify(token, this.secret, (err, decoded) => {
      if (err) throw new ResError(err.message, 400);
      return decoded;
    }) as Iuser | undefined;
    return data?.role;
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
    await this.validatePassword(comingPassword, password);
    const token = sign({ id, email, role, password }, this.secret, config.configs);
    return {
      user: { id, username, role, email },
      token,
    };
  }
}
