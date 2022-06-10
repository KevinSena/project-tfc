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
  finish(id: string): Promise<string>
  update(id: string, home: number, away:number): Promise<IMatches>
  isSameTeam(team1: number, team2: number): Promise<void | undefined>
  teamsExist(team1: number, team2: number): Promise<void | undefined>
}

export interface ILeaderboard {
  name: string,
  totalPoints: number,
  totalGames: number,
  totalVictories: number,
  totalDraws: number,
  totalLosses: number,
  goalsFavor: number,
  goalsOwn: number,
  goalsBalance: number,
  efficiency: number
}

export interface ILeaderboardService {
  leaderHome(): Promise<ILeaderboard[]>
  leaderAway(): Promise<ILeaderboard[]>
  leaderGeneral(): Promise<ILeaderboard[]>
}
