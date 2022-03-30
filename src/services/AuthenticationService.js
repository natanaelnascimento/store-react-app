import http, {getConfig} from '../helpers/httpCommon';
import ErrorInfo from '../helpers/errorInfo';
import TokenManager from '../helpers/tokenManager';
import CartManager from '../helpers/cartManager';

const login = async (username, password) => {
  try {
    let response = await http.post(`/v1/authentication/login`, {username, password}, getConfig());
    return response ? TokenManager.getAuth(response.data) : ErrorInfo.GENERIC_ERROR;
  } catch (error) {
    return error.response ? ErrorInfo.getErrorInfo(error.response) : ErrorInfo.NETWORK_ERROR;
  }
}

const refresh = async () => {
  try {
    let response = await http.post(`/v1/authentication/refresh`, {refreshToken: TokenManager.getRefreshToken()}, getConfig());
    return response ? TokenManager.getAuth(response.data) : ErrorInfo.GENERIC_ERROR;
  } catch (error) {
    return error.response ? ErrorInfo.getErrorInfo(error.response) : ErrorInfo.NETWORK_ERROR;
  } finally {
    CartManager.removeAllProducts();
  }
}

const logout = async () => {
  try {
    let response = await http.get(`/v1/authentication/logout`, getConfig());
    TokenManager.cleanTokens();
    return response ? response.data : ErrorInfo.GENERIC_ERROR;
  } catch (error) {
    return error.response ? ErrorInfo.getErrorInfo(error.response) : ErrorInfo.NETWORK_ERROR;
  } finally {
    CartManager.removeAllProducts();
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
