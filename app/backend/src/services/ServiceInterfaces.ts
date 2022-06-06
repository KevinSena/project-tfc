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

export interface IMatches {
  id?: number;
  homeTeam?: number;
  homeTeamGoals?: number;
  awayTeam?: number;
  awayTeamGoals?: number;
  inProgress?: boolean;
  teamHome?: string;
  teamAway?: string;
}

export interface IMatchCreate {
  homeTeam?: number;
  homeTeamGoals?: number;
  awayTeam?: number;
  awayTeamGoals?: number;
  inProgress?: boolean;
}

export interface IMatchService {
  getAll(): Promise<IMatches[]>
  getInProgress(): Promise<IMatches[]>
  getFinished(): Promise<IMatches[]>
  create(payload: IMatchCreate): Promise<IMatches>
  finish(id: string): Promise<string | undefined>
}
