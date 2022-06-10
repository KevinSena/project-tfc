import TeamService from '../services/TeamService';
import LoginService from '../services/LoginService';
import LoginController from './LoginController';
import TeamController from './TeamController';
import MatchController from './MatchController';
import MatchService from '../services/MatchService';
import LeaderboardController from './LeaderboardController';
import LeaderboardService from '../services/LeaderboardService';

const login = new LoginController(new LoginService());
const teams = new TeamController(new TeamService());
const matches = new MatchController(new MatchService());
const leaderboard = new LeaderboardController(new LeaderboardService());

export { login, teams, matches, leaderboard };
