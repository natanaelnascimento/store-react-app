import axios from 'axios';
import TokenManager from './tokenManager';
import properties from '../properties.json';

//Define a URL base da origem para consumo do servico
export default axios.create({
  baseURL: properties.apiBaseUrl,
  headers: {
    'Content-type': 'application/json'
  },
});

const getConfig = (auth) => {
  auth = !auth ? TokenManager.getAuth() : auth;
  return {
    headers: {
      'Content-type': 'application/json',
      'Authorization': 'Bearer ' + auth.accessToken
    }
  }
}

export { getConfig };