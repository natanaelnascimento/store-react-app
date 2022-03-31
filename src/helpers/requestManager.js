import http from './httpCommon';
import {getConfig} from '../helpers/httpCommon';
import AuthenticationService from '../services/AuthenticationService';
import ErrorInfo from './errorInfo';
import TokenManager from './tokenManager';

const call = async (method, url, data, quantity = 1000000) => {
    if(method === 'get')
        url += url.indexOf('?') >= 0
            ? '&size=' + quantity : '?size=' + quantity;
    try {
        let response = data 
            ? await http[method](url, data, getConfig(AuthenticationService.getAuth()))
            : await http[method](url, getConfig(AuthenticationService.getAuth()));
        return response ? response.data : ErrorInfo.GENERIC_ERROR;
    } catch (error) {
        let errorInfo = error.response ? ErrorInfo.getErrorInfo(error.response) : ErrorInfo.NETWORK_ERROR;
        if(errorInfo.error === 'bad_credentials') {
            try {
                let auth = await AuthenticationService.refresh(AuthenticationService.getAuth());
                let response = data
                    ? await http[method](url, data, getConfig(auth))
                    : await http[method](url, getConfig(auth));
                return response.data;
            } catch (error) {
                TokenManager.cleanTokens();
                let errorInfo = ErrorInfo.getErrorInfo(error.response);
                if(errorInfo.error === 'bad_credentials' && window.location.pathname !== '/' && window.location.pathname !== '')
                    window.location.pathname = '/';
                return ErrorInfo.getErrorInfo(error.response);
            }
        }
        return errorInfo;
    }
}

const module = {call};

export default module;