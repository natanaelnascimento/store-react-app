import http, {getConfig} from '../helpers/httpCommon';
import errorInfo from '../helpers/errorInfo';
import TokenManager from '../helpers/tokenManager';

const login = async (username, password) => {
  try {
    let response = await http.post(`/v1/authentication/login`, {username, password}, getConfig());
    return TokenManager.getAuth(response.data);
  } catch (error) {
    return errorInfo.getErrorInfo(error.response);
  }
}

const refresh = async () => {
  try {
    let response = await http.post(`/v1/authentication/refresh`, {refreshToken: TokenManager.getRefreshToken()}, getConfig());
    return TokenManager.getAuth(response.data);
  } catch (error) {
    return errorInfo.getErrorInfo(error.response);
  }
}

const logout = async () => {
  try {
    let response = await http.get(`/v1/authentication/logout`, getConfig());
    TokenManager.cleanTokens();
    return response.data;
  } catch (error) {
    return errorInfo.getErrorInfo(error.response);
  } finally {
    TokenManager.cleanTokens();
  }
}

const getAuth = () => {
  let auth = TokenManager.getAuth();
  if(TokenManager.isAccessTokenExpired() && TokenManager.isRefreshTokenExpired()) {
    TokenManager.cleanTokens();
    if(window.location.pathname !== '/' && window.location.pathname !== '')
      window.location.pathname = '/';
  }
  return auth;
}

const module = { login, refresh, logout, getAuth }

export default module;
