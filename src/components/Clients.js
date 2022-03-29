import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import ClientService from '../services/ClientService';
import { trackPromise } from 'react-promise-tracker';
import alertManager from '../helpers/alertManager';
import CurrencyInput from 'react-currency-input-field';

const currencyFormat = new Intl.NumberFormat('pt-BR', { style: "currency", currency: "BRL" });

export default function Clients() {

  const [items, setItems] = useState([]);
  const [viewType, setViewType] = useState([]);
  const [current, setCurrent] = useState([]);
  const [id, setId] = useState([]);
  const [name, setName] = useState([]);
  const [address, setAddress] = useState([]);
  const [creditLimit, setCreditLimit] = useState([]);
  const [installmentsLimit, setInstallmentsLimit] = useState([]);
  const [nameClass, setNameClass] = useState([]);
  const [addressClass, setAddressClass] = useState([]);
  const [creditLimitClass, setCreditLimitClass] = useState([]);
  const [installmentsLimitClass, setInstallmentsLimitClass] = useState([]);

  useEffect(() => {
    setViewType('list');
    const fecth = async () => {
      let data = await trackPromise(ClientService.findAll());
      alertManager.handleData(data);
      setItems(data);
    }
    fecth();
  }, []);

  const handleIdChange = (props) => {
    setId(props.target.value);
  }

  const handleNameChange = (props) => {
    setName(props.target.value);
  }

  const handleAddressChange = (props) => {
    setAddress(props.target.value);
  }

  const handleCreditLimitChange = (value) => {
    setCreditLimit(value);
  }

  const handleInstallmentsLimitChange = (props) => {
    setInstallmentsLimit(props.target.value);
  }

  const handleSearchButtonClick = async () => {
    let nameSearch = name.length > 0 ? name : null;
    let data = id.length > 0
      ? await trackPromise(ClientService.findById(id))
      : await trackPromise(ClientService.findAll(nameSearch));
    alertManager.handleData(data);
    if(id.length > 0 && !data.error)
      data = {totalElements: 1, content: [data]}
    setItems(data);
  }

  const handleCreationButtonClick = () => {
    setName('');
    setId('');
    setAddress('');
    setCreditLimit('');
    setInstallmentsLimit('');
    setCurrent(null);
    setViewType('creation');
  }

  const handleCancelButtonClick = () => {
    setName('');
    setId('');
    setAddress('');
    setCreditLimit('');
    setInstallmentsLimit('');
    setNameClass('');
    setAddressClass('');
    setCreditLimitClass('');
    setInstallmentsLimitClass('');
    setCurrent(null);
    setViewType('list');
  }

  const handleCreationConffirmButtonClick = async () => {
    setNameClass(name.length === 0 ? 'invalid' : 'valid');
    setCreditLimitClass(creditLimit.length === 0 ? 'invalid' : 'valid');
    setInstallmentsLimitClass(installmentsLimit.length === 0 ? 'invalid' : 'valid');
    setAddressClass(address.length === 0 ? 'invalid' : 'valid');
    if(name.length === 0 || creditLimit.length === 0 || address.length === 0) {
      alertManager.showAlert('Preencha os campos obrigatórios!');
      return;
    }
    let creditLimitValue = creditLimit.replace(',', '.');
    let client = {name, address, installmentsLimit, creditLimit : creditLimitValue};
    let data = await trackPromise(ClientService.create(client));
    alertManager.handleData(data);
    if(!data.error)
      alertManager.showAlert('Cliente cadastrado com sucesso!');
   
    data = await trackPromise(ClientService.findAll());
    alertManager.handleData(data);
    setItems(data);

    handleCancelButtonClick();
  }

  const handleUpdateButtonClick = async (props) => {
    let id = props.target.id.split('-')[1];
    let data = await trackPromise(ClientService.findById(id));
    alertManager.handleData(data);
    if(data.error)
      return;
    setName(data.name);
    setId(data.id);
    setAddress(data.address);
    setCreditLimit(data.creditLimit  + '');
    setInstallmentsLimit(data.installmentsLimit);
    setCurrent(data);
    setViewType('update');
  }

  const handleUpdateConffirmButtonClick = async () => {
    setNameClass(name.length === 0 ? 'invalid' : 'valid');
    setCreditLimitClass(creditLimit.length === 0 ? 'invalid' : 'valid');
    setInstallmentsLimitClass(installmentsLimit.length === 0 ? 'invalid' : 'valid');
    setAddressClass(address.length === 0 ? 'invalid' : 'valid');
    if(name.length === 0 || creditLimit.length === 0 || address.length === 0) {
      alertManager.showAlert('Preencha os campos obrigatórios!');
      return;
    }

    let creditLimitValue = creditLimit.replace(',', '.');
    let client = {name, address, installmentsLimit, creditLimit : creditLimitValue, id : current.id};
    let data = await trackPromise(ClientService.update(client));
    alertManager.handleData(data);
    if(!data.error)
      alertManager.showAlert('Cliente alterado com sucesso!');
   
    data = await trackPromise(ClientService.findAll());
    alertManager.handleData(data);
    setItems(data);

    handleCancelButtonClick();
  }

  const handleDeleteButtonClick = async (props) => {
    let id = props.target.id.split('-')[1];
    let data = await trackPromise(ClientService.findById(id));
    alertManager.handleData(data);
    if(data.error)
      return;
    setName(data.name);
    setId(data.id);
    setAddress(data.address);
    setCreditLimit(data.creditLimit + '');
    setInstallmentsLimit(data.installmentsLimit);
    setCurrent(data);
    setViewType('delete');
  }

  const handleDeleteConffirmButtonClick = async () => {
    let data = await trackPromise(ClientService.remove(current.id));
    alertManager.handleData(data);
    if(!data.error)
      alertManager.showAlert('Cliente excluído com sucesso!');
   
    data = await trackPromise(ClientService.findAll());
    alertManager.handleData(data);
    setItems(data);

    handleCancelButtonClick();
  }

  const handleDetailButtonClick = async (props) => {
    let id = props.target.id.split('-')[1];
    let data = await trackPromise(ClientService.findById(id));
    alertManager.handleData(data);
    if(data.error)
      return;
    setName(data.name);
    setId(data.id);
    setAddress(data.address);
    setCreditLimit(data.creditLimit + '');
    setInstallmentsLimit(data.installmentsLimit);
    setCurrent(data);
    setViewType('detail');
  }

  let title = viewType === 'update'
    ? `Alterar Cliente #${current && current.id}`
    : viewType === 'delete'
    ? `Excluir Cliente #${current && current.id}`
    : viewType === 'detail'
    ? `Detalhar Cliente #${current && current.id}`
    : viewType === 'create'
    ? 'Cadastrar Cliente'
    : 'Clientes';

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
                  <th>Limite de Crédito</th>
                </tr>
              </thead>
              <tbody>
              {items && items.totalElements > 0 &&
                items.content.map((client) => (
                  <tr key={client.id}>
                    <td>{client.id}</td>
                    <td>{client.name}</td>
                    <td>{currencyFormat.format(client.creditLimit)}</td>
                    <td/>
                    <td>
                      <a href='#!' id={'aclient-' + client.id} className='secondary-content'><i id={'iclient-' + client.id} style={STYLES.action} className='material-icons'>add_shopping_cart</i></a>
                      <a href='#!' id={'aclient-' + client.id} onClick={handleDeleteButtonClick} className='secondary-content'><i id={'iclient-' + client.id} style={STYLES.action} className='material-icons'>delete</i></a>
                      <a href='#!' id={'aclient-' + client.id} onClick={handleUpdateButtonClick} className='secondary-content'><i id={'iclient-' + client.id} style={STYLES.action} className='material-icons'>edit</i></a>
                      <a href='#!' id={'aclient-' + client.id} onClick={handleDetailButtonClick} className='secondary-content'><i id={'iclient-' + client.id} style={STYLES.action} className='material-icons'>description</i></a>
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
                  <CurrencyInput prefix='R$ ' style={STYLES.input} className={creditLimitClass} placeholder='Limite de Crédito' id='creditLimit' value={creditLimit} fixedDecimalLength='2' onValueChange={handleCreditLimitChange} readOnly={['detail', 'delete'].includes(viewType)} />
                  <label className='active' htmlFor="creditLimit">Limite de Crédito</label>
                </div>
                <div className='input-field col s12 m12 l8 xl8'>
                  <input style={STYLES.input} className={addressClass} placeholder='Endereço' id='address' type='text' value={address} onChange={handleAddressChange} readOnly={['detail', 'delete'].includes(viewType)} />
                  <label className='active' htmlFor="addresss">Endereço</label>
                </div>
                <div className='input-field col s12 m12 l3 xl3'>
                  <input style={STYLES.input} className={installmentsLimitClass} placeholder='Limite de Parcelas' id='installmentsLimit' type='number' min='1' value={installmentsLimit} onChange={handleInstallmentsLimitChange} readOnly={['detail', 'delete'].includes(viewType)} />
                  <label className='active' htmlFor="installmentsLimit">Limite de Parcelamento</label>
                </div>
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
