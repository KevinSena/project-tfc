import LoginService from '../services/LoginService';
import LoginController from './LoginController';

const login = new LoginController(new LoginService());

export default login;
