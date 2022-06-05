import { StatusCodes } from 'http-status-codes';
import { compare } from 'bcryptjs';
import ResError from '../utils/MyError';
import Users from '../database/models/UserModel';
import JwtConfig from '../utils/jwtConfig';
import { ILoginService } from './ServiceInterfaces';

export default class LoginService implements ILoginService {
  private unauthorizedMessage: string;
  private blankSpaceMessage: string;
  private jwt: JwtConfig;
  constructor(private model = Users) {
    this.unauthorizedMessage = 'Incorrect email or password';
    this.blankSpaceMessage = 'All fields must be filled';
    this.jwt = new JwtConfig();
  }

  validateToken(token: string): string | undefined {
    const data = this.jwt.decrypt(token);
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
    const token = this.jwt.crypt({ id, email, role, password });
    return {
      user: { id, username, role, email },
      token,
    };
  }
}
