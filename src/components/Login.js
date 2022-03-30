import React, {useContext, useState} from 'react';
import { trackPromise } from 'react-promise-tracker';
import AuthenticationService from '../services/AuthenticationService';
import { PageContext } from '../helpers/pageContext';
import Navigation from './Navigation';
import alertManager from '../helpers/alertManager';

export default function Login() {

  const [username, setUsername] = useState([]);
  const [password, setPassword] = useState([]);
  const [usernameClass, setUsernameClass] = useState(['valid']);
  const [passwordClass, setPasswordClass] = useState(['valid']);
  const [userName, setUserName] = useContext(PageContext);

  const handleUsernameChange = (prop) => {
    setUsername(prop.target.value);
  }

  const handlePasswordChange = (prop) => {
      setPassword(prop.target.value);
  }

  const handleLoginClick = async () => {
    setUsernameClass(username.length === 0 ? 'invalid' : 'valid');
    setPasswordClass(password.length === 0 ? 'invalid' : 'valid');

    if(username.length === 0 || password.length === 0) {
        alertManager.showAlert('Preencha os campos obrigatórios!');
        return;
    }

    let data = await trackPromise(AuthenticationService.login(username, password));
    alertManager.handleData(data);
    if(data.error) {
      if(data.error === 'bad_credentials') {
        setUsernameClass('invalid');
        setPasswordClass('invalid');
      }
      return;
    }
    setUserName(data.userName);
    window.location.pathname = '/panel';
  }

  return (
      <Navigation title='Login' sidebar={false}>
      <div className='section'>
        <div>
          <div className='row'>
              <div className='col s10 m6 l4 offset-s1 offset-m3 offset-l4'>
                  <input className={usernameClass} placeholder='Login' id='username' type='text' value={username} onChange={handleUsernameChange} />
              </div>
          </div>
          <div className='row'>
                <div className='col s10 m6 l4 offset-s1 offset-m3 offset-l4'>
                    <input className={passwordClass} placeholder='Senha' id='password' type='password' value={password} onChange={handlePasswordChange} />
                </div>
          </div>
          <div className='row'>
              <div className='col s10 m6 l4 offset-s1 offset-m3 offset-l4'>
                  <button onClick={handleLoginClick} className='right btn waves-effect waves-light'><i className="material-icons right">input</i>Login</button>
              </div>
          </div>
        </div>
      </div>
    </Navigation>
  );
}
