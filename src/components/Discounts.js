import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import DiscountService from '../services/DiscountService';
import { trackPromise } from 'react-promise-tracker';
import alertManager from '../helpers/alertManager';
import CurrencyInput from 'react-currency-input-field';

export default function Discounts() {

  const [items, setItems] = useState([]);
  const [viewType, setViewType] = useState([]);
  const [current, setCurrent] = useState([]);
  const [id, setId] = useState([]);
  const [description, setDescription] = useState([]);
  const [percentage, setPercentage] = useState([]);
  const [installmentsLimit, setInstallmentsLimit] = useState([]);
  const [descriptionClass, setDescriptionClass] = useState([]);
  const [percentageClass, setPercentageClass] = useState([]);
  const [installmentsLimitClass, setInstallmentsLimitClass] = useState([]);

  useEffect(() => {
    setViewType('list');
    const fecth = async () => {
      let data = await trackPromise(DiscountService.findAll());
      alertManager.handleData(data);
      setItems(data);
    }
    fecth();
  }, []);

  const handleIdChange = (props) => {
    setId(props.target.value);
  }

  const handleDescriptionChange = (props) => {
    setDescription(props.target.value);
  }

  const handlePercentageChange = (value) => {
    setPercentage(value);
  }

  const validatePercentage = (percentage) => {
    percentage = parseFloat(percentage);
    if(percentage <= 0 || percentage > 100) {
      alertManager.showAlert('Informe um percentual válido');
      setPercentageClass('invalid');
      return false;
    }
    return true;
  }

  const handleInstallmentsLimitChange = (props) => {
    if((/^\d+$/.test(props.target.value) && parseInt(props.target.value) > 0) || props.target.value === '')
      setInstallmentsLimit(props.target.value);
  }

  const formatDiscount = (value) => {
    return Number(value).toLocaleString(undefined,{style: 'percent', minimumFractionDigits:2})
  }

  const handleSearchButtonClick = async () => {
    let descriptionSearch = description.length > 0 ? description : null;
    let data = id.length > 0
      ? await trackPromise(DiscountService.findById(id))
      : await trackPromise(DiscountService.findAll(descriptionSearch));
    alertManager.handleData(data);
    if(id.length > 0 && !data.error)
      data = {totalElements: 1, content: [data]}
    setItems(data);
  }

  const handleCreationButtonClick = () => {
    setId('');
    setDescription('');
    setPercentage('');
    setInstallmentsLimit('');
    setCurrent(null);
    setViewType('creation');
  }

  const handleCancelButtonClick = () => {
    setId('');
    setDescription('');
    setPercentage('');
    setInstallmentsLimit('');
    setDescriptionClass('');
    setPercentageClass('');
    setInstallmentsLimitClass('');
    setCurrent(null);
    setViewType('list');
  }

  const handleCreationConffirmButtonClick = async () => {
    setPercentageClass(percentage.length === 0 ? 'invalid' : 'valid');
    setInstallmentsLimitClass(installmentsLimit.length === 0 ? 'invalid' : 'valid');
    setDescriptionClass(description.length === 0 ? 'invalid' : 'valid');
    if(installmentsLimit.length === 0 || percentage.length === 0 || description.length === 0) {
      alertManager.showAlert('Preencha os campos obrigatórios!');
      return;
    }
    let percentageValue = parseFloat(percentage.replace('.', '').replace(',', '.'));
    if(!validatePercentage(percentageValue))
      return;
    let discount = {description, installmentsLimit, percentage : (percentageValue/100.0)};
    let data = await trackPromise(DiscountService.create(discount));
    alertManager.handleData(data);
    if(!data.error)
      alertManager.showAlert('Desconto cadastrado com sucesso!');
   
    data = await trackPromise(DiscountService.findAll());
    alertManager.handleData(data);
    setItems(data);

    handleCancelButtonClick();
  }

  const handleUpdateButtonClick = async (props) => {
    let id = props.target.id.split('-')[1];
    let data = await trackPromise(DiscountService.findById(id));
    alertManager.handleData(data);
    if(data.error)
      return;
    setId(data.id);
    setDescription(data.description);
    setPercentage((data.percentage*100.0).toFixed(2));
    setInstallmentsLimit(data.installmentsLimit);
    setCurrent(data);
    setViewType('update');
  }

  const handleUpdateConffirmButtonClick = async () => {
    setPercentageClass(percentage.length === 0 ? 'invalid' : 'valid');
    setInstallmentsLimitClass(installmentsLimit.length === 0 ? 'invalid' : 'valid');
    setDescriptionClass(description.length === 0 ? 'invalid' : 'valid');
    if(installmentsLimit.length === 0 || percentage.length === 0 || description.length === 0) {
      alertManager.showAlert('Preencha os campos obrigatórios!');
      return;
    }
    let percentageValue = parseFloat(percentage.replace('.', '').replace(',', '.'));
    if(!validatePercentage(percentageValue))
      return;
    let discount = {description, installmentsLimit, percentage : (percentageValue/100.0), id : current.id};
    let data = await trackPromise(DiscountService.update(discount));
    alertManager.handleData(data);
    if(!data.error)
      alertManager.showAlert('Desconto alterado com sucesso!');
   
    data = await trackPromise(DiscountService.findAll());
    alertManager.handleData(data);
    setItems(data);

    handleCancelButtonClick();
  }

  const handleDeleteButtonClick = async (props) => {
    let id = props.target.id.split('-')[1];
    let data = await trackPromise(DiscountService.findById(id));
    alertManager.handleData(data);
    if(data.error)
      return;
    setId(data.id);
    setDescription(data.description);
    setPercentage((data.percentage*100.0).toFixed(2));
    setInstallmentsLimit(data.installmentsLimit);
    setCurrent(data);
    setViewType('delete');
  }

  const handleDeleteConffirmButtonClick = async () => {
    let data = await trackPromise(DiscountService.remove(current.id));
    alertManager.handleData(data);
    if(!data.error)
      alertManager.showAlert('Desconto excluído com sucesso!');
   
    data = await trackPromise(DiscountService.findAll());
    alertManager.handleData(data);
    setItems(data);

    handleCancelButtonClick();
  }

  const handleDetailButtonClick = async (props) => {
    let id = props.target.id.split('-')[1];
    let data = await trackPromise(DiscountService.findById(id));
    alertManager.handleData(data);
    if(data.error)
      return;
    setId(data.id);
    setDescription(data.description);
    setPercentage((data.percentage*100.0).toFixed(2));
    setInstallmentsLimit(data.installmentsLimit);
    setCurrent(data);
    setViewType('detail');
  }

  let title = viewType === 'update'
    ? `Alterar Desconto #${current && current.id}`
    : viewType === 'delete'
    ? `Excluir Desconto #${current && current.id}`
    : viewType === 'detail'
    ? `Detalhar Desconto #${current && current.id}`
    : viewType === 'creation'
    ? 'Cadastrar Desconto'
    : 'Descontos';

  return (
    <Navigation title={title}>
        {viewType === 'list' &&
          <div className='section'>
            <input style={STYLES.input} className='col s12 m12 l1 xl2' placeholder='Buscar por ID' id='id' type='text' value={id} onChange={handleIdChange} />
            <input style={STYLES.input} className='col s12 m12 l5 xl6' placeholder='Buscar por Descrição' id='description' type='text' value={description} onChange={handleDescriptionChange} />
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
                  <th>Desconto</th>
                </tr>
              </thead>
              <tbody>
              {items && items.totalElements > 0 &&
                items.content.map((discount) => (
                  <tr key={discount.id}>
                    <td>{discount.id}</td>
                    <td>{discount.description}</td>
                    <td>{formatDiscount(discount.percentage)}</td>
                    <td>
                      <a href='#!' id={'adiscount-' + discount.id} onClick={handleDeleteButtonClick} className='secondary-content'><i id={'idiscount-' + discount.id} style={STYLES.action} className='material-icons'>delete</i></a>
                      <a href='#!' id={'adiscount-' + discount.id} onClick={handleUpdateButtonClick} className='secondary-content'><i id={'idiscount-' + discount.id} style={STYLES.action} className='material-icons'>edit</i></a>
                      <a href='#!' id={'adiscount-' + discount.id} onClick={handleDetailButtonClick} className='secondary-content'><i id={'idiscount-' + discount.id} style={STYLES.action} className='material-icons'>description</i></a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
          {viewType !== 'list' &&
            <>
              <div>
                <div className='input-field col s12 m12 l10 xl11'>
                  <input style={STYLES.input} className={descriptionClass} placeholder='Descrição' id='description' type='text' value={description} onChange={handleDescriptionChange} disabled={['detail', 'delete'].includes(viewType)} />
                  <label className='active' htmlFor="descriptions">Descrição</label>
                </div>
                <div className='input-field col s12 m12 l5 xl5'>
                  <input style={STYLES.input} className={installmentsLimitClass} placeholder='Limite de Parcelas' id='installmentsLimit' type='number' min='1' value={installmentsLimit} onChange={handleInstallmentsLimitChange} disabled={['detail', 'delete'].includes(viewType)} />
                  <label className='active' htmlFor="installmentsLimit">Limite de Parcelas</label>
                </div>
                <div className='input-field col s12 m12 l5 xl6'>
                  <CurrencyInput suffix='%' style={STYLES.input} className={percentageClass} placeholder='Desconto' id='percentage' value={percentage} decimalScale={2} fixedDecimalLength={2} onValueChange={handlePercentageChange} disabled={['detail', 'delete'].includes(viewType)} />
                  <label className='active' htmlFor="percentage">Desconto</label>
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
