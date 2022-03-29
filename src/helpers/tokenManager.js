import { decodeToken , isExpired} from "react-jwt";

const setAccessToken = (accessToken) => {
    window.sessionStorage.setItem('access-token', accessToken);
}

const getAccessToken = (accessToken) => {
    return window.sessionStorage.getItem('access-token');
}

const setRefreshToken = (refreshToken) => {
    window.sessionStorage.setItem('refresh-token', refreshToken);
}

const getRefreshToken = (refreshToken) => {
    return window.sessionStorage.getItem('refresh-token');
}

const isAccessTokenExpired = () => {
    let accessToken = getAccessToken();
    return isExpired(accessToken);
}

const isRefreshTokenExpired = () => {
    let refreshToken = getRefreshToken();
    return isExpired(refreshToken);
}

const cleanTokens = () => {
    window.sessionStorage.removeItem('access-token');
    window.sessionStorage.removeItem('refresh-token');
}

const getAuth = (data) => {
    let accessToken = data ? data.accessToken : getAccessToken();
    let refreshToken = data ? data.refreshToken : getRefreshToken();
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    return {...decodeToken(accessToken), accessToken, refreshToken};
}

const module = { setAccessToken, getAccessToken, setRefreshToken, getRefreshToken,
    isAccessTokenExpired, isRefreshTokenExpired, cleanTokens, getAuth }

export default module;