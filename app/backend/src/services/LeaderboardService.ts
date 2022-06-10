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
    console.log(obj);
    const result = obj;
    if (curr.homeTeamGoals > curr.awayTeamGoals) {
      result.totalPoints += 3;
      result.totalVictories += 1;
    }
    if (curr.homeTeamGoals === curr.awayTeamGoals) result.totalDraws += 1;
    if (curr.homeTeamGoals < curr.awayTeamGoals) result.totalLosses += 1;
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
    const homeMatches = await this.matches.findAll({ where: { homeTeam: teamId } });

    const teamPoints = homeMatches.reduce((prev, curr) => {
      const initial = prev;
      const result = LeaderboardService.sumPoints(initial, curr);

      result.name = team?.teamName || '';
      result.totalGames += 1;
      result.goalsFavor += curr.homeTeamGoals;
      result.goalsOwn += curr.awayTeamGoals;
      result.goalsBalance += curr.homeTeamGoals - curr.awayTeamGoals;
      result.efficiency = (result.totalPoints / (result.totalGames * 3)) * 100;

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
}
