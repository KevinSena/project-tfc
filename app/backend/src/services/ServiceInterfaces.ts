export interface ILoginService {
  getToken(email: string, comingPassword: string): Promise<object>
}
