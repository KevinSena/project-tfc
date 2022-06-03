export interface ILoginService {
  getToken(email: string, comingPassword: string): Promise<object>;
  validatePassword(comingPassword: string, password: string): Promise<void>;
  validateToken(token: string): string | undefined;
}

export interface Iuser {
  id?: number;
  username?: string;
  role?: string;
  email?: string;
  password?: string;
}

export interface ITeams {
  id?: number;
  teamName?: string;
}

export interface ITeamService {
  getAll(): Promise<ITeams[]>
  getById(id: string): Promise<ITeams>
}
