import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import OrderService from '../services/OrderService';
import { trackPromise } from 'react-promise-tracker';
import alertManager from '../helpers/alertManager';
import CurrencyInput from 'react-currency-input-field';

const currencyFormat = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const dateTimeFormat = new Intl.DateTimeFormat('pt-BR');

export default function Orders() {

  const [id, setId] = useState([]);
  const [items, setItems] = useState([]);
  const [viewType, setViewType] = useState([]);
  const [current, setCurrent] = useState([]);

  useEffect(() => {
    setViewType('list');
    const fecth = async () => {
      let data = await trackPromise(OrderService.findAll());
      alertManager.handleData(data);
      setItems(data);
    }
    fecth();
  }, []);

  const handleIdChange = (props) => {
    setId(props.target.value);
  }

  const handleSearchButtonClick = async () => {
    let data = id.length > 0
      ? await trackPromise(OrderService.findById(id))
      : await trackPromise(OrderService.findAll());
    alertManager.handleData(data);
    if(id.length > 0 && !data.error)
      data = {totalElements: 1, content: [data]}
    setItems(data);
  }

  const handleCancelButtonClick = () => {
    setId('');
    setCurrent(null);
    setViewType('list');
  }

  const handleDetailButtonClick = async (props) => {
    let id = props.target.id.split('-')[1];
    let data = await trackPromise(OrderService.findById(id));
    alertManager.handleData(data);
    if(data.error)
      return;
    setCurrent(data);
    setViewType('detail');
  }

  let title = viewType === 'detail'
    ? `Detalhar Pedido #${current && current.id}`
    : 'Pedidos';

  return (
    <Navigation title={title}>
        {viewType === 'list' &&
          <div className='section'>
            <input style={STYLES.input} className='col s12 m12 l9 xl10' placeholder='Buscar por ID' id='id' type='text' value={id} onChange={handleIdChange} />
            <button style={STYLES.input} onClick={handleSearchButtonClick} className='center btn waves-effect waves-light'><i className="material-icons left">search</i>Buscar</button>
          </div>
        }
        {viewType === 'list' && items && items.totalElements > 0 &&
          <>
            <div className='section'>
              {items && items.totalElements > 0 &&
                <table className='striped highlight'>
                  <thead>
                    <tr>
                      <th>#ID</th>
                      <th>Cliente</th>
                      <th>Total de Itens</th>
                      <th>Valor Total</th>
                      <th>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                  {items.content.map((order) => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{`${order.client.id} - ${order.client.name}`}</td>
                        <td>{order.items.reduce((t, i) => (t + i.quantity), 0)}</td>
                        <td>{currencyFormat.format(order.items.map(i => i.quantity * i.price).reduce((t, i) => (t + i), 0) - order.discount)}</td>
                        <td>{dateTimeFormat.format(new Date(order.dateTime))}</td>
                        <td>
                          <a href='#!' id={'aorder-' + order.id} onClick={handleDetailButtonClick} className='secondary-content'><i id={'iclient-' + order.id} style={STYLES.action} className='material-icons'>description</i></a>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              }
            </div>
          </>
        }
        {viewType !== 'list' && current.id &&
          <>
            <div>
              <div className='input-field col s12 m12 l11 xl11'>
                <input style={STYLES.input} placeholder='Cliente' id='client' type='text' value={`${current.client.id} - ${current.client.name}`} disabled={true} />
                <label className='active' htmlFor="name">Cliente</label>
              </div>
              <div className='input-field col s12 m12 l11 xl11'>
                <input style={STYLES.input} placeholder='Usuário' id='user' type='text' value={`${current.user.id} - ${current.user.name}`} disabled={true} />
                <label className='active' htmlFor="name">Usuário</label>
              </div>
              <div className='input-field col s12 m12 l5 xl5'>
                <input style={STYLES.input} placeholder='Total de Itens' id='quantity' type='number' min='1' value={current.items.reduce((t, i) => (t + i.quantity), 0)} disabled={true} />
                <label className='active' htmlFor="quantity">Total de Itens</label>
              </div>
              <div className='input-field col s12 m12 l6 xl6'>
                <input style={STYLES.input} placeholder='Parcelas' id='installments' type='number' min='1' value={current.installments} disabled={true} />
                <label className='active' htmlFor="installments">Parcelas</label>
              </div>
              <div className='input-field col s12 m12 l5 xl5'>
                <CurrencyInput prefix='R$ ' style={STYLES.input} placeholder='Subtotal' id='subtotal' value={current.items.map(i => i.quantity * i.price).reduce((t, i) => (t + i), 0)} decimalScale={2} fixedDecimalLength={2} disabled={true} />
                <label className='active' htmlFor="creditLimit">Subtotal</label>
              </div>
              <div className='input-field col s12 m12 l6 xl6'>
                <CurrencyInput prefix='R$ ' style={STYLES.input} placeholder='Desconto' id='discount' value={current.discount} decimalScale={2} fixedDecimalLength={2} disabled={true} />
                <label className='active' htmlFor="creditLimit">Desconto</label>
              </div>
              <div className='input-field col s12 m12 l5 xl5'>
                <CurrencyInput prefix='R$ ' style={STYLES.input} placeholder='Valor Total' id='amount' value={current.items.map(i => i.quantity * i.price).reduce((t, i) => (t + i), 0) - current.discount} decimalScale={2} fixedDecimalLength={2} disabled={true} />
                <label className='active' htmlFor="amount">Valor Total</label>
              </div>
              <div className='input-field col s12 m12 l6 xl6'>
                <input style={STYLES.input} placeholder='Data e Hora' id='dateTime' type='text' value={dateTimeFormat.format(new Date(current.dateTime)) + ' ' + current.dateTime.substring(current.dateTime.indexOf('T') + 1, current.dateTime.indexOf('.'))} disabled={true} />
                <label className='active' htmlFor="dateTime">Data e Hora</label>
              </div>
            </div>
            <div className='section'>
              {current.items && current.items.length > 0 &&
                <table className='striped highlight'>
                  <thead>
                    <tr>
                      <th>Produto</th>
                      <th>Quantidade</th>
                      <th>Valor</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                  {current.items.map((item) => (
                      <tr key={item.id}>
                        <td>{`${item.product.id} - ${item.product.name}`}</td>
                        <td>{item.quantity}</td>
                        <td>{currencyFormat.format(item.price)}</td>
                        <td>{currencyFormat.format(item.quantity * item.price)}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              }
            </div>
            <div>
              <button style={STYLES.input} onClick={handleCancelButtonClick} className='center btn waves-effect waves-light'><i className="material-icons left">arrow_back</i>{viewType === 'detail' ? 'Voltar' : 'Cancelar'}</button>
            </div>
          </>
        }
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
