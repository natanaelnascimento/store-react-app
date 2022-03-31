import React, { useEffect, useState } from 'react';
import Navigation from './Navigation';
import ProductService from '../services/ProductService';
import { trackPromise } from 'react-promise-tracker';
import alertManager from '../helpers/alertManager';
import CurrencyInput from 'react-currency-input-field';
import CartManager from '../helpers/cartManager';

const currencyFormat = new Intl.NumberFormat('pt-BR', { style: "currency", currency: "BRL" });

export default function Products() {

  const [items, setItems] = useState([]);
  const [viewType, setViewType] = useState([]);
  const [current, setCurrent] = useState([]);
  const [id, setId] = useState([]);
  const [name, setName] = useState([]);
  const [description, setDescription] = useState([]);
  const [price, setPrice] = useState([]);
  const [nameClass, setNameClass] = useState([]);
  const [descriptionClass, setDescriptionClass] = useState([]);
  const [priceClass, setPriceClass] = useState([]);

  useEffect(() => {
    setViewType('list');
    const fecth = async () => {
      let data = await trackPromise(ProductService.findAll());
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

  const handleDescriptionChange = (props) => {
    setDescription(props.target.value);
  }

  const handlePriceChange = (value) => {
    setPrice(value);
  }

  const handleSearchButtonClick = async () => {
    let nameSearch = name.length > 0 ? name : null;
    let data = id.length > 0
      ? await trackPromise(ProductService.findById(id))
      : await trackPromise(ProductService.findAll(nameSearch));
    alertManager.handleData(data);
    if(id.length > 0 && !data.error)
      data = {totalElements: 1, content: [data]}
    setItems(data);
  }

  const handleCreationButtonClick = () => {
    setName('');
    setId('');
    setDescription('');
    setPrice('');
    setCurrent(null);
    setViewType('creation');
  }

  const handleCancelButtonClick = () => {
    setName('');
    setId('');
    setDescription('');
    setPrice('');
    setNameClass('');
    setDescriptionClass('');
    setPriceClass('');
    setCurrent(null);
    setViewType('list');
  }

  const handleCreationConffirmButtonClick = async () => {
    setNameClass(name.length === 0 ? 'invalid' : 'valid');
    setPriceClass(price.length === 0 ? 'invalid' : 'valid');
    setDescriptionClass(description.length === 0 ? 'invalid' : 'valid');
    if(name.length === 0 || price.length === 0 || description.length === 0) {
      alertManager.showAlert('Preencha os campos obrigatórios!');
      return;
    }
    let priceValue = price.replace(',', '.');
    let product = {name, description, price : priceValue};
    let data = await trackPromise(ProductService.create(product));
    alertManager.handleData(data);
    if(!data.error)
      alertManager.showAlert('Produto cadastrado com sucesso!');
   
    data = await trackPromise(ProductService.findAll());
    alertManager.handleData(data);
    setItems(data);

    handleCancelButtonClick();
  }

  const handleUpdateButtonClick = async (props) => {
    let id = props.target.id.split('-')[1];
    let data = await trackPromise(ProductService.findById(id));
    alertManager.handleData(data);
    if(data.error)
      return;
    setName(data.name);
    setId(data.id);
    setDescription(data.description);
    setPrice(data.price + '');
    setCurrent(data);
    setViewType('update');
  }

  const handleUpdateConffirmButtonClick = async () => {
    setNameClass(name.length === 0 ? 'invalid' : 'valid');
    setPriceClass(price.length === 0 ? 'invalid' : 'valid');
    setDescriptionClass(description.length === 0 ? 'invalid' : 'valid');
    if(name.length === 0 || price.length === 0 || description.length === 0) {
      alertManager.showAlert('Preencha os campos obrigatórios!');
      return;
    }

    let priceValue = price.replace(',', '.');
    let product = {name, description, price : priceValue, id : current.id};
    let data = await trackPromise(ProductService.update(product));
    alertManager.handleData(data);
    if(!data.error)
      alertManager.showAlert('Produto alterado com sucesso!');

    data = await trackPromise(ProductService.findById(product.id));
    alertManager.handleData(data);
   
    data = await trackPromise(ProductService.findAll());
    alertManager.handleData(data);
    setItems(data);

    handleCancelButtonClick();
  }

  const handleDeleteButtonClick = async (props) => {
    let id = props.target.id.split('-')[1];
    let data = await trackPromise(ProductService.findById(id));
    alertManager.handleData(data);
    if(data.error)
      return;
    setName(data.name);
    setId(data.id);
    setDescription(data.description);
    setPrice(data.price + '');
    setCurrent(data);
    setViewType('delete');
  }

  const handleDeleteConffirmButtonClick = async () => {
    let data = await trackPromise(ProductService.remove(current.id));
    alertManager.handleData(data);
    if(!data.error)
      alertManager.showAlert('Produto excluído com sucesso!');
   
    data = await trackPromise(ProductService.findAll());
    alertManager.handleData(data);
    setItems(data);

    handleCancelButtonClick();
  }

  const handleDetailButtonClick = async (props) => {
    let id = props.target.id.split('-')[1];
    let data = await trackPromise(ProductService.findById(id));
    alertManager.handleData(data);
    if(data.error)
      return;
    setName(data.name);
    setId(data.id);
    setDescription(data.description);
    setPrice(data.price + '');
    setCurrent(data);
    setViewType('detail');
  }

  const handleCartButtonClick = async (props) => {
    let id = props.target.id.split('-')[1];
    let data = await trackPromise(ProductService.findById(id));
    alertManager.handleData(data);
    if(data.error)
      return;
    try {
      await trackPromise(CartManager.addProduct(data));
      alertManager.showAlert('Produto adicionado no carrinho');
    } catch(e) {
      alertManager.showAlert('Erro ao adicionar produto no carrinho');
    }
  }

  let title = viewType === 'update'
    ? `Alterar Produto #${current && current.id}`
    : viewType === 'delete'
    ? `Excluir Produto #${current && current.id}`
    : viewType === 'detail'
    ? `Detalhar Produto #${current && current.id}`
    : viewType === 'creation'
    ? 'Cadastrar Produto'
    : 'Produtos';

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
                  <th>Preço</th>
                </tr>
              </thead>
              <tbody>
              {items && items.totalElements > 0 &&
                items.content.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{currencyFormat.format(product.price)}</td>
                    <td/>
                    <td>
                      <a href='#!' id={'aproduct-' + product.id} onClick={handleCartButtonClick} className='secondary-content'><i id={'iproduct-' + product.id} style={STYLES.action} className='material-icons'>add_shopping_cart</i></a>
                      <a href='#!' id={'aproduct-' + product.id} onClick={handleDeleteButtonClick} className='secondary-content'><i id={'iproduct-' + product.id} style={STYLES.action} className='material-icons'>delete</i></a>
                      <a href='#!' id={'aproduct-' + product.id} onClick={handleUpdateButtonClick} className='secondary-content'><i id={'iproduct-' + product.id} style={STYLES.action} className='material-icons'>edit</i></a>
                      <a href='#!' id={'aproduct-' + product.id} onClick={handleDetailButtonClick} className='secondary-content'><i id={'iproduct-' + product.id} style={STYLES.action} className='material-icons'>description</i></a>
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
                  <CurrencyInput prefix='R$ ' style={STYLES.input} className={priceClass} placeholder='Preço' id='price' value={price} fixedDecimalLength={2} decimalsLimit={2} onValueChange={handlePriceChange} readOnly={['detail', 'delete'].includes(viewType)} />
                  <label className='active' htmlFor="price">Preço</label>
                </div>
                <div className='input-field col s12 m12 l11 xl11'>
                  <input style={STYLES.input} className={descriptionClass} placeholder='Descrição' id='description' type='text' value={description} onChange={handleDescriptionChange} readOnly={['detail', 'delete'].includes(viewType)} />
                  <label className='active' htmlFor="description">Descrição</label>
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
