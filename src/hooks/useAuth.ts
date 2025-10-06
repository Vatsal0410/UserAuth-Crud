import { authCookies } from "../utils/cookies";

export const useAuth = () => {
  const login = (token: string) => {
    authCookies.setToken(token);
  };

  const logout = () => {
    authCookies.removeToken();
  };

  const getToken = () => {
    return authCookies.getToken();
  };

  return {
    login,
    logout,
    getToken,
  };
};
