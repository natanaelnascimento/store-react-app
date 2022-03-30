import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import { trackPromise } from 'react-promise-tracker';
import alertManager from '../helpers/alertManager';
import CartManager from '../helpers/cartManager';
import ProductService from '../services/ProductService';
import ClientService from '../services/ClientService';
import OrderService from '../services/OrderService';
import CurrencyInput from 'react-currency-input-field';

const currencyFormat = new Intl.NumberFormat('pt-BR', { style: "currency", currency: "BRL" });

export default function Cart() {

  const [items, setItems] = useState([]);
  const [viewType, setViewType] = useState([]);
  const [installments, setInstallments] = useState([]);
  const [clientName, setClientName] = useState([]);
  const [clientId, setClientId] = useState([]);
  const [clientItems, setClientItems] = useState([]);
  const [resume, setResume] = useState([]);
  const [client, setClient] = useState([]);

  useEffect(() => {
    setInstallments(1);
    setViewType('list');
    const fecth = async () => {
      let data = await trackPromise(CartManager.getProducts());
      alertManager.handleData(data);
      setItems(data);
    }
    fecth();
  }, []);

  useEffect(() => {
    const fecth = async () => {
      let data = await trackPromise(ClientService.findAll(null, 5));
      alertManager.handleData(data);
      setClientItems(data);
    }
    fecth();
  }, []);

  useEffect(() => {
    const fecth = async () => {
      if(!installments || installments.length === 0)
        return;
      let data = await trackPromise(CartManager.getResume(installments));
      alertManager.handleData(data);
      setResume(data);
    }
    fecth();
  }, [installments]);

  const handleInstallmentsChange = (props) => {
    setInstallments(props.target.value);
  }

  const handleClientNameChange = (props) => {
    setClientName(props.target.value);
  }

  const handleClientIdChange = (props) => {
    setClientId(props.target.value);
  }

  const handlePlusButtonClick = async (props) => {
    let id = props.target.id.split('-')[1];
    let data = await trackPromise(ProductService.findById(id));
    alertManager.handleData(data);
    if(data.error)
      return;
    try {
      await trackPromise(CartManager.addProduct(data));
    } catch(e) {
      alertManager.showAlert('Erro ao aumentar quantidade do produto no carrinho');
    }

    data = await trackPromise(CartManager.getProducts());
    alertManager.handleData(data);
    setItems(data);
  }

  const handleMinusButtonClick = async (props) => {
    let id = props.target.id.split('-')[1];
    let data = await trackPromise(ProductService.findById(id));
    alertManager.handleData(data);
    if(data.error)
      return;
    try {
      await trackPromise(CartManager.removeProduct(data, 1));
    } catch(e) {
      alertManager.showAlert('Erro ao reduzir quantidade do produto do carrinho');
    }

    data = await trackPromise(CartManager.getProducts());
    alertManager.handleData(data);
    setItems(data);
  }

  const handleRemoveButtonClick = async (props) => {
    let id = props.target.id.split('-')[1];
    let data = await trackPromise(ProductService.findById(id));
    alertManager.handleData(data);
    if(data.error)
      return;
    try {
      await trackPromise(CartManager.removeProduct(data));
      alertManager.showAlert('Produto removido do carrinho');
    } catch(e) {
      alertManager.showAlert('Erro remover produto do carrinho');
    }

    data = await trackPromise(CartManager.getProducts());
    alertManager.handleData(data);
    setItems(data);
  }

  const handleOrderButtonClick = async () => {
    let data = await trackPromise(CartManager.getResume(installments));
    alertManager.handleData(data);
    setResume(data);
    setViewType('order');
  }

  const handleCancelButtonClick = () => {
    setInstallments(1);
    setClient({});
    setViewType('list');
  }

  const handleSearchButtonClick = async () => {
    let nameSearch = clientName.length > 0 ? clientName : null;
    let data = clientId.length > 0
      ? await trackPromise(ClientService.findById(clientId))
      : await trackPromise(ClientService.findAll(nameSearch, 5));
    alertManager.handleData(data);
    if(clientId.length > 0 && !data.error)
      data = {totalElements: 1, content: [data]}
    setClientItems(data);
  }

  const handleAddInstallmentButtonClick = async () => {
    let installmentsValue = installments;
    if(!installmentsValue)
      installmentsValue = 0;
    installmentsValue++;
    setInstallments(installmentsValue);
  }

  const handleRemoveInstallmentButtonClick = async () => {
    let installmentsValue = installments;
    if(!installmentsValue)
      installmentsValue = 1;
    installmentsValue--;
    if(installmentsValue < 1)
      installmentsValue = 1;
    setInstallments(installmentsValue);
  }

  const handlSelectClientRadioClick = async (props) => {
    let id = props.target.id.split('-')[1];
    let data = await trackPromise(ClientService.findById(id));
    alertManager.handleData(data);
    if(data.error)
      return;
    setClient(data);
  }

  const handleOrderConffirmButtonClick = async () => {
    if(!client.id) {
      alertManager.showAlert('Selecione o cliente!');
      return;
    }
    let mappedItems = items.map(p => ({
      productId: p.id,
      quantity: p.quantity
    }));
    let order = {clientId: client.id, items : mappedItems, installments : installments};
    let data = await trackPromise(OrderService.create(order));
    alertManager.handleData(data);
    if(!data.error) {
      CartManager.removeAllProducts();
      setItems([]);
      alertManager.showAlert('Pedido realizado com sucesso!');
    }

    handleCancelButtonClick();
  }

  let title = viewType === 'order'
    ? 'Fechar Pedido'
    : 'Carrinho';

  return (
    <Navigation title={title}>
        {(!items || !items.length || items.length === 0) &&
          <div className='container center'>
            <div className='sectiion'>
              <i style={STYLES.icon} className="large center material-icons">shopping_cart</i>
            </div>
            <div className='sectiion'>
              <span>O carrinho está vazio</span>
            </div>
          </div>
        }
        {items && items.length > 0 && viewType === 'list' &&
          <div className='section'>
            <button style={STYLES.input} onClick={handleOrderButtonClick} className='center btn waves-effect waves-light'><i className="material-icons left">attach_money</i>Fechar Pedido</button>
          </div>
        }
        <div className='section'>
          {items && items.length > 0 && viewType === 'list' &&
            <table className='striped highlight'>
              <thead>
                <tr>
                  <th>#ID</th>
                  <th>Nome</th>
                  <th>Preço</th>
                  <th>Quantidade</th>
                </tr>
              </thead>
              <tbody>
              {items &&
                items.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{currencyFormat.format(product.price)}</td>
                    <td>{product.quantity}</td>
                    <td/>
                    <td>
                      <a href='#!' id={'aproduct-' + product.id} onClick={handleRemoveButtonClick} className='secondary-content'><i id={'iproduct-' + product.id} style={STYLES.action} className='material-icons'>delete</i></a>
                      <a href='#!' id={'aproduct-' + product.id} onClick={handlePlusButtonClick} className='secondary-content'><i id={'iproduct-' + product.id} style={STYLES.action} className='material-icons'>add</i></a>
                      <a href='#!' id={'aproduct-' + product.id} onClick={handleMinusButtonClick} className='secondary-content'><i id={'iproduct-' + product.id} style={STYLES.action} className='material-icons'>remove</i></a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          }
          {viewType !== 'list' &&
            <>
              <div className='section'><h5>Selecione o Cliente</h5></div>
              <div className='section'>
                <input style={STYLES.input} className='col s12 m12 l1 xl2' placeholder='Buscar por ID' id='clientId' type='text' value={clientId} onChange={handleClientIdChange} />
                <input style={STYLES.input} className='col s12 m12 l7 xl8' placeholder='Buscar por Nome' id='clientName' type='text' value={clientName} onChange={handleClientNameChange} />
                <button style={STYLES.input} onClick={handleSearchButtonClick} className='center btn waves-effect waves-light'><i className="material-icons left">search</i>Buscar</button>
              </div>
              <div className='section'>
                {clientItems && clientItems.totalElements > 0 &&
                  <table className='striped highlight'>
                    <thead>
                      <tr>
                        <th/>
                        <th>#ID</th>
                        <th>Nome</th>
                        <th>Limite de Crédito</th>
                      </tr>
                    </thead>
                    <tbody>
                    {clientItems && clientItems.totalElements > 0 &&
                      clientItems.content.map((c) => (
                        <tr key={c.id}>
                          <td>
                            <label>
                              <input checked={client && client.id === c.id} onChange={handlSelectClientRadioClick} id={'ruser-' + c.id}  name="client" type="radio" />
                              <span></span>
                            </label>
                          </td>
                          <td>{c.id}</td>
                          <td>{c.name}</td>
                          <td>{currencyFormat.format(c.creditLimit)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                }
              </div>
              <div className='section'><h5>Dados do Pedido</h5></div>
              <div className='section'>
                <div className='row'>
                  <div className='input-field col s9 m8 l4 xl4'>
                    <input style={STYLES.input} placeholder='Parcelamento' id='installments' type='text' value={installments} onChange={handleInstallmentsChange} />
                    <label className='active' htmlFor="installments">Parcelamento</label>
                  </div>
                  <div className='input-field col s3 m4 l4 xl4'>
                    <button style={STYLES.input} onClick={handleRemoveInstallmentButtonClick} className='center btn waves-effect waves-light'>-</button>
                    <button style={STYLES.input} onClick={handleAddInstallmentButtonClick} className='center btn waves-effect waves-light'>+</button>
                  </div>
                </div>
                <div className='row'>
                  <div className='input-field col s12 m12 l4 xl4'>
                    <CurrencyInput prefix='R$ ' style={STYLES.input} placeholder='Subtotal' id='subtotal' value={resume.subtotal} fixedDecimalLength='2' readOnly={true} />
                    <label className='active' htmlFor="subtotal">Subtotal</label>
                  </div>
                  <div className='input-field col s12 m12 l4 xl4'>
                    <CurrencyInput prefix='R$ ' style={STYLES.input} placeholder='Desconto' id='discount' value={resume.discount} fixedDecimalLength='2' readOnly={true} />
                    <label className='active' htmlFor="discount">Desconto</label>
                  </div>
                  <div className='input-field col s12 m12 l4 xl4'>
                    <CurrencyInput prefix='R$ ' style={STYLES.input} placeholder='Valor Total' id='amount' value={resume.amount} fixedDecimalLength='2' readOnly={true} />
                    <label className='active' htmlFor="amount">Valor Total</label>
                  </div>
                </div>
              </div>
              <div>
                <button style={STYLES.input} onClick={handleCancelButtonClick} className='center btn waves-effect waves-light'><i className="material-icons left">arrow_back</i>{viewType === 'detail' ? 'Voltar' : 'Cancelar'}</button>
                <button style={STYLES.input} onClick={handleOrderConffirmButtonClick} className='center btn waves-effect waves-light'><i className="material-icons left">attach_money</i>Fechar Pedido</button>
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
    fontSize: '10rem',
    color: '#aebfbe'
  },
  input: {
    maginLeft: '0.5rem',
    marginRight: '0.5rem'
  }
}
