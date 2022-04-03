import React, {useState} from 'react';
import { trackPromise } from 'react-promise-tracker';
import UserService from '../services/UserService';
import Navigation from './Navigation';
import alertManager from '../helpers/alertManager';

export default function Password() {

  const [currentPassword, setCurrentPassword] = useState([]);
  const [newPassword, setNewPassword] = useState([]);
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState([]);
  const [currentPasswordClass, setCurrentPasswordClass] = useState([]);  
  const [newPasswordClass, setNewPasswordClass] = useState([]);
  const [newPasswordConfirmationClass, setNewPasswordConfirmationClass] = useState([]);

  const handleCurrentPasswordChange = (prop) => {
    setCurrentPassword(prop.target.value);
  }

  const handleNewPasswordChange = (prop) => {
    setNewPassword(prop.target.value);
  }

  const handleNewPasswordConfirmationChange = (prop) => {
    setNewPasswordConfirmation(prop.target.value);
  }

  const validatePasswords = () => {
    if(newPassword.length < 8) {
      alertManager.showAlert('As senha deve posssuir pelo menos 8 caracteres');
      setNewPasswordClass('invalid');
      setNewPasswordConfirmationClass('invalid');
      return false;
    } else if(newPassword !== newPasswordConfirmation) {
      alertManager.showAlert('As novas senhas digitadas não estão iguais');
      setNewPasswordClass('invalid');
      setNewPasswordConfirmationClass('invalid');
      return false;
    }
    return true;
  }

  const handleChangeClick = async () => {
    setCurrentPasswordClass(currentPassword.length === 0 ? 'invalid' : 'valid');
    setNewPasswordClass(newPassword.length === 0 ? 'invalid' : 'valid');
    setNewPasswordConfirmationClass(newPasswordConfirmation.length === 0 ? 'invalid' : 'valid');

    if(currentPassword.length === 0 || newPassword.length === 0 || newPasswordConfirmation.length === 0) {
        alertManager.showAlert('Preencha os campos obrigatórios!');
        return;
    }
  
    if(!validatePasswords())
      return;

    let data = await trackPromise(UserService.changePassword({currentPassword, newPassword}));
    alertManager.handleData(data);
    if(data.error) {
      if(data.error === 'incorrect_password')
        setCurrentPasswordClass('invalid');
      return;
    }

    alertManager.showAlert('A senha foi alterada');

    setCurrentPassword('');
    setNewPassword('');
    setNewPasswordConfirmation('');
  }

  return (
      <Navigation title='Alterar Senha'>
      <div className='section'>
        <div>
          <div className='row'>
                <div className='col s10 m6 l4 offset-s1 offset-m3 offset-l4'>
                    <input className={currentPasswordClass} placeholder='Senha atual' id='currentPassword' type='password' value={currentPassword} onChange={handleCurrentPasswordChange} />
                </div>
          </div>
          <div className='row'>
                <div className='col s10 m6 l4 offset-s1 offset-m3 offset-l4'>
                    <input className={newPasswordClass} placeholder='Nova senha' id='newPassword' type='password' value={newPassword} onChange={handleNewPasswordChange} />
                </div>
          </div>
          <div className='row'>
                <div className='col s10 m6 l4 offset-s1 offset-m3 offset-l4'>
                    <input className={newPasswordConfirmationClass} placeholder='Confirmação da nova senha' id='newPasswordConfirmation' type='password' value={newPasswordConfirmation} onChange={handleNewPasswordConfirmationChange} />
                </div>
          </div>
          <div className='row'>
              <div className='col s10 m6 l4 offset-s1 offset-m3 offset-l4'>
                  <button onClick={handleChangeClick} className='right btn waves-effect waves-light'><i className="material-icons left">lock</i>Alterar Senha</button>
              </div>
          </div>
        </div>
      </div>
    </Navigation>
  );
}
