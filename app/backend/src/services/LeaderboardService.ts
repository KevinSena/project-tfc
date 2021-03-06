import { Op } from 'sequelize';
import Teams from '../database/models/TeamModel';
import Matches from '../database/models/MatchModel';
import { ILeaderboard, ILeaderboardService } from './ServiceInterfaces';

export default class LeaderboardService implements ILeaderboardService {
  readonly initialBoard: ILeaderboard;
  constructor(private matches = Matches, private teams = Teams) {
    this.initialBoard = {
      name: '',
      totalPoints: 0,
      totalGames: 0,
      totalVictories: 0,
      totalDraws: 0,
      totalLosses: 0,
      goalsFavor: 0,
      goalsOwn: 0,
      goalsBalance: 0,
      efficiency: 0,
    };
  }

  private static sumPoints(obj: ILeaderboard, curr: Matches): ILeaderboard {
    const result = obj;
    if (curr.homeTeamGoals > curr.awayTeamGoals) {
      result.totalPoints += 3;
      result.totalVictories += 1;
    }
    if (curr.homeTeamGoals === curr.awayTeamGoals) {
      result.totalDraws += 1;
      result.totalPoints += 1;
    }
    if (curr.homeTeamGoals < curr.awayTeamGoals) result.totalLosses += 1;
    return result;
  }

  private static sumPointsAway(obj: ILeaderboard, curr: Matches): ILeaderboard {
    const result = obj;
    if (curr.homeTeamGoals < curr.awayTeamGoals) {
      result.totalPoints += 3;
      result.totalVictories += 1;
    }
    if (curr.homeTeamGoals === curr.awayTeamGoals) {
      result.totalDraws += 1;
      result.totalPoints += 1;
    }
    if (curr.homeTeamGoals > curr.awayTeamGoals) result.totalLosses += 1;
    return result;
  }

  private static compareBalance(a:ILeaderboard, b: ILeaderboard): number | void {
    if (a.goalsBalance > b.goalsBalance) return 1;
    if (a.goalsBalance === b.goalsBalance) {
      if (a.goalsFavor > b.goalsFavor) return 1;
      if (a.goalsFavor === b.goalsFavor && a.goalsOwn < b.goalsOwn) return 1;
    }
  }

  private static comparePoints(b:ILeaderboard, a: ILeaderboard): number {
    if (a.totalPoints > b.totalPoints) return 1;
    if (a.totalPoints === b.totalPoints) {
      if (a.totalVictories > b.totalVictories) return 1;
      if (a.totalVictories === b.totalVictories && LeaderboardService.compareBalance(a, b)) {
        return 1;
      }
    }
    return -1;
  }

  private async boardHome(teamId: number): Promise<ILeaderboard> {
    const team = await this.teams.findByPk(teamId);
    const homeMatches = await this.matches.findAll({ where: {
      homeTeam: teamId, inProgress: false,
    } });
    const teamPoints = homeMatches.reduce((prev, curr) => {
      const initial = prev;
      const result = LeaderboardService.sumPoints(initial, curr);

      result.name = team?.teamName || '';
      result.totalGames += 1;
      result.goalsFavor += curr.homeTeamGoals;
      result.goalsOwn += curr.awayTeamGoals;
      result.goalsBalance += curr.homeTeamGoals - curr.awayTeamGoals;
      result.efficiency = +((result.totalPoints / (result.totalGames * 3)) * 100).toFixed(2);

      return result;
    }, { ...this.initialBoard });

    return teamPoints;
  }

  private async boardAway(teamId: number): Promise<ILeaderboard> {
    const team = await this.teams.findByPk(teamId);
    const awayMatches = await this.matches.findAll({ where: {
      awayTeam: teamId, inProgress: false,
    } });
    const teamPoints = awayMatches.reduce((prev, curr) => {
      const initial = prev;
      const result = LeaderboardService.sumPointsAway(initial, curr);

      result.name = team?.teamName || '';
      result.totalGames += 1;
      result.goalsFavor += curr.awayTeamGoals;
      result.goalsOwn += curr.homeTeamGoals;
      result.goalsBalance += curr.awayTeamGoals - curr.homeTeamGoals;
      result.efficiency = +((result.totalPoints / (result.totalGames * 3)) * 100).toFixed(2);

      return result;
    }, { ...this.initialBoard });

    return teamPoints;
  }

  private async boardGeneral(teamId: number): Promise<ILeaderboard> {
    const team = await this.teams.findByPk(teamId);
    const awayMatches = await this.matches.findAll({ where: {
      [Op.or]: [{ awayTeam: teamId }, { homeTeam: teamId }], inProgress: false,
    } });
    const teamPoints = awayMatches.reduce((prev, curr) => {
      const isHome = curr.homeTeam === teamId;
      const result = isHome ? LeaderboardService.sumPoints(prev, curr)
        : LeaderboardService.sumPointsAway(prev, curr);

      result.name = team?.teamName || '';
      result.totalGames += 1;
      result.goalsFavor += isHome ? curr.homeTeamGoals : curr.awayTeamGoals;
      result.goalsOwn += isHome ? curr.awayTeamGoals : curr.homeTeamGoals;
      result.goalsBalance += isHome ? curr.homeTeamGoals - curr.awayTeamGoals
        : curr.awayTeamGoals - curr.homeTeamGoals;
      result.efficiency = +((result.totalPoints / (result.totalGames * 3)) * 100).toFixed(2);

      return result;
    }, { ...this.initialBoard });

    return teamPoints;
  }

  async leaderHome(): Promise<ILeaderboard[]> {
    const teams = await this.teams.findAll();

    const result = await Promise.all(teams.map(async (e) => {
      const rt = await this.boardHome(e.id);
      return rt;
    }));

    return result.sort(LeaderboardService.comparePoints);
  }

  async leaderAway(): Promise<ILeaderboard[]> {
    const teams = await this.teams.findAll();

    const result = await Promise.all(teams.map(async (e) => {
      const rt = await this.boardAway(e.id);
      return rt;
    }));

    return result.sort(LeaderboardService.comparePoints);
  }

  async leaderGeneral(): Promise<ILeaderboard[]> {
    const teams = await this.teams.findAll();

    const result = await Promise.all(teams.map(async (e) => {
      const rt = await this.boardGeneral(e.id);
      return rt;
    }));

    return result.sort(LeaderboardService.comparePoints);
  }
}
