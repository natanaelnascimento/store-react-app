import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import UserService from '../services/UserService';
import { trackPromise } from 'react-promise-tracker';
import alertManager from '../helpers/alertManager';

export default function Users() {

  const [items, setItems] = useState([]);
  const [viewType, setViewType] = useState([]);
  const [current, setCurrent] = useState([]);
  const [id, setId] = useState([]);
  const [name, setName] = useState([]);
  const [username, setUsername] = useState([]);
  const [password, setPassword] = useState([]);
  const [passwordConfirmation, setPasswordConfirmation] = useState([]);
  const [nameClass, setNameClass] = useState([]);
  const [usernameClass, setUsernameClass] = useState([]);
  const [passwordClass, setPasswordClass] = useState([]);
  const [passwordConfirmationClass, setPasswordConfirmationClass] = useState([]);

  useEffect(() => {
    setViewType('list');
    const fecth = async () => {
      let data = await trackPromise(UserService.findAll());
      alertManager.handleData(data);
      setItems(data);
    }
    fecth();
  }, []);

  const validateUsername = () => {
    if(!/^[a-zA-z\d_]+$/.test(username)) {
      alertManager.showAlert('Utilize apenas letras, números e _ no login');
      setUsernameClass('invalid');
      return false;
    }
    return true;
  }

  const validatePasswords = () => {
    if(password.length < 8) {
      alertManager.showAlert('As senha deve posssuir pelo menos 8 caracteres');
      setPasswordClass('invalid');
      setPasswordConfirmationClass('invalid');
      return false;
    } else if(password !== passwordConfirmation) {
      alertManager.showAlert('As senhas digitadas não estão iguais');
      setPasswordClass('invalid');
      setPasswordConfirmationClass('invalid');
      return false;
    }
    return true;
  }

  const handleIdChange = (props) => {
    setId(props.target.value);
  }

  const handleNameChange = (props) => {
    setName(props.target.value);
  }

  const handleUsernameChange = (props) => {
    setUsername(props.target.value);
  }

  const handlePasswordChange = (props) => {
    setPassword(props.target.value);
  }

  const handlePasswordConfirmationChange = (props) => {
    setPasswordConfirmation(props.target.value);
  }

  const handleSearchButtonClick = async () => {
    let nameSearch = name.length > 0 ? name : null;
    let data = id.length > 0
      ? await trackPromise(UserService.findById(id))
      : await trackPromise(UserService.findAll(nameSearch));
    alertManager.handleData(data);
    if(id.length > 0 && !data.error)
      data = {totalElements: 1, content: [data]}
    setItems(data);
  }

  const handleCreationButtonClick = () => {
    setName('');
    setId('');
    setUsername('');
    setPassword('');
    setPasswordConfirmation('');
    setCurrent(null);
    setViewType('creation');
  }

  const handleCancelButtonClick = () => {
    setName('');
    setId('');
    setUsername('');
    setPassword('');
    setPasswordConfirmation('');
    setNameClass('');
    setUsernameClass('');
    setPasswordClass('');
    setPasswordConfirmationClass('');
    setCurrent(null);
    setViewType('list');
  }

  const handleCreationConffirmButtonClick = async () => {
    setNameClass(name.length === 0 ? 'invalid' : 'valid');
    setPasswordClass(password.length === 0 ? 'invalid' : 'valid');
    setPasswordConfirmationClass(passwordConfirmation.length === 0 ? 'invalid' : 'valid');
    setUsernameClass(username.length === 0 ? 'invalid' : 'valid');
    if(name.length === 0 || password.length === 0 || passwordConfirmation.length === 0 || username.length === 0) {
      alertManager.showAlert('Preencha os campos obrigatórios!');
      return;
    }
    if(!validateUsername())
      return;
    if(!validatePasswords())
      return;
    let user = {name, username, password};
    let data = await trackPromise(UserService.create(user));
    if(data.error && data.error === 'integrity_violation') {
      alertManager.showAlert('O login digitado já está sendo utilizado');
      setUsernameClass('invalid');
      return;
    } if(!data.error) {
      alertManager.showAlert('Usuário cadastrado com sucesso!');
    } else {
      alertManager.handleData(data);
    }

    data = await trackPromise(UserService.findAll());
    alertManager.handleData(data);
    setItems(data);

    handleCancelButtonClick();
  }

  const handleUpdateButtonClick = async (props) => {
    let id = props.target.id.split('-')[1];
    let data = await trackPromise(UserService.findById(id));
    alertManager.handleData(data);
    if(data.error)
      return;
    setName(data.name);
    setId(data.id);
    setUsername(data.username);
    setCurrent(data);
    setViewType('update');
  }

  const handleUpdateConffirmButtonClick = async () => {
    setNameClass(name.length === 0 ? 'invalid' : 'valid');
    setUsernameClass(username.length === 0 ? 'invalid' : 'valid');
    if(!validateUsername())
      return;
    if(name.length === 0 || username.length === 0) {
      alertManager.showAlert('Preencha os campos obrigatórios!');
      return;
    }

    let user = {name, username, id : current.id};
    let data = await trackPromise(UserService.update(user));
    alertManager.handleData(data);
    if(data.error && data.error === 'integrity_violation') {
      alertManager.showAlert('O login digitado já está sendo utilizado');
      setUsernameClass('invalid');
      return;
    } if(!data.error) {
      alertManager.showAlert('Usuário alterado com sucesso!');
    } else {
      alertManager.handleData(data);
    }
   
    data = await trackPromise(UserService.findAll());
    alertManager.handleData(data);
    setItems(data);

    handleCancelButtonClick();
  }

  const handleDeleteButtonClick = async (props) => {
    let id = props.target.id.split('-')[1];
    let data = await trackPromise(UserService.findById(id));
    alertManager.handleData(data);
    if(data.error)
      return;
    setName(data.name);
    setId(data.id);
    setUsername(data.username);
    setCurrent(data);
    setViewType('delete');
  }

  const handleDeleteConffirmButtonClick = async () => {
    let data = await trackPromise(UserService.remove(current.id));
    alertManager.handleData(data);
    if(!data.error)
      alertManager.showAlert('Usuário excluído com sucesso!');
   
    data = await trackPromise(UserService.findAll());
    alertManager.handleData(data);
    setItems(data);

    handleCancelButtonClick();
  }

  const handleDetailButtonClick = async (props) => {
    let id = props.target.id.split('-')[1];
    let data = await trackPromise(UserService.findById(id));
    alertManager.handleData(data);
    if(data.error)
      return;
    setName(data.name);
    setId(data.id);
    setUsername(data.username);
    setCurrent(data);
    setViewType('detail');
  }

  let title = viewType === 'update'
    ? `Alterar Usuário #${current && current.id}`
    : viewType === 'delete'
    ? `Excluir Usuário #${current && current.id}`
    : viewType === 'detail'
    ? `Detalhar Usuário #${current && current.id}`
    : viewType === 'creation'
    ? 'Cadastrar Usuário'
    : 'Usuários';

  return (
    <Navigation title={title}>
        {viewType === 'list' &&
          <div className='section'>
            <input style={STYLES.input} className='col s12 m12 l1 xl2' placeholder='Buscar por ID' id='id' type='text' value={id} onChange={handleIdChange} />
            <input style={STYLES.input} className='col s12 m12 l5 xl6' placeholder='Buscar por Nome' id='name' type='text' value={name} onChange={handleNameChange} />
            <button style={STYLES.input} onClick={handleSearchButtonClick} className='center btn waves-effect waves-light'><i className="material-icons left">search</i>Buscar</button>
            <button style={STYLES.input} onClick={handleCreationButtonClick} className='center btn waves-effect waves-light'><i className="material-icons left">add</i>Cadastrar</button>
          </div>
        }
        <div className='section'>
         {items && items.totalElements > 0 && viewType === 'list' &&
            <table className='striped highlight'>
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Nome</th>
                  <th>Login</th>
                </tr>
              </thead>
              <tbody>
              {items && items.totalElements > 0 &&
                items.content.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.username}</td>
                    <td/>
                    <td>
                      <a href='#!' id={'auser-' + user.id} onClick={handleDeleteButtonClick} className='secondary-content'><i id={'iuser-' + user.id} style={STYLES.action} className='material-icons'>delete</i></a>
                      <a href='#!' id={'auser-' + user.id} onClick={handleUpdateButtonClick} className='secondary-content'><i id={'iuser-' + user.id} style={STYLES.action} className='material-icons'>edit</i></a>
                      <a href='#!' id={'auser-' + user.id} onClick={handleDetailButtonClick} className='secondary-content'><i id={'iuser-' + user.id} style={STYLES.action} className='material-icons'>description</i></a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
          {viewType !== 'list' &&
            <>
              <div>
                <div className='input-field col s12 m12 l8 xl8'>
                  <input style={STYLES.input} className={nameClass} placeholder='Nome' id='name' type='text' value={name} onChange={handleNameChange} readOnly={['detail', 'delete'].includes(viewType)} />
                  <label className='active' htmlFor="name">Nome</label>
                </div>
                <div className='input-field col s12 m12 l3 xl3'>
                <input style={STYLES.input} className={usernameClass} placeholder='Login' id='username' type='text' value={username} onChange={handleUsernameChange} readOnly={['detail', 'delete'].includes(viewType)} />
                  <label className='active' htmlFor="unsername">Login</label>
                </div>
                {viewType === 'creation' &&
                <>
                  <div className='input-field col s12 m12 l6 xl6'>
                    <input style={STYLES.input} className={passwordClass} placeholder='Senha' id='password' type='password' value={password} onChange={handlePasswordChange} readOnly={['detail', 'delete'].includes(viewType)} />
                    <label className='active' htmlFor="password">Senha</label>
                  </div>
                  <div className='input-field col s12 m12 l5 xl5'>
                    <input style={STYLES.input} className={passwordConfirmationClass} placeholder='Confirmação da Senha' id='passwordConfirmation' type='password' value={passwordConfirmation} onChange={handlePasswordConfirmationChange} readOnly={['detail', 'delete'].includes(viewType)} />
                    <label className='active' htmlFor="passwordConfirmation">Confirmação da Senha</label>
                  </div>
                </>
                }
              </div>
              <div>
                <button style={STYLES.input} onClick={handleCancelButtonClick} className='center btn waves-effect waves-light'><i className="material-icons left">arrow_back</i>{viewType === 'detail' ? 'Voltar' : 'Cancelar'}</button>
                {viewType === 'creation' &&
                  <button style={STYLES.input} onClick={handleCreationConffirmButtonClick} className='center btn waves-effect waves-light'><i className="material-icons left">add</i>Cadastrar</button>
                }
                {viewType === 'update' &&
                  <button style={STYLES.input} onClick={handleUpdateConffirmButtonClick} className='center btn waves-effect waves-light'><i className="material-icons left">check</i>Alterar</button>
                }
                {viewType === 'delete' &&
                  <button style={STYLES.input} onClick={handleDeleteConffirmButtonClick} className='center btn waves-effect waves-light'><i className="material-icons left">delete</i>Excluir</button>
                }
              </div>
            </>
          }
        </div>
    </Navigation>
  );
}

const STYLES = {
  action: {
    marginLeft: '0.5rem'
  },
  icon: {
    fontSize: '15rem',
    color: '#aebfbe'
  },
  input: {
    maginLeft: '0.5rem',
    marginRight: '0.5rem'
  }
}
