import TeamService from '../services/TeamService';
import LoginService from '../services/LoginService';
import LoginController from './LoginController';
import TeamController from './TeamController';

const login = new LoginController(new LoginService());
const teams = new TeamController(new TeamService());

export { login, teams };
