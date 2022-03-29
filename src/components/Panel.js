import React, { useContext, useEffect, useState } from 'react';
import Navigation from './Navigation';
import { PageContext } from '../helpers/pageContext';
import OrderService from '../services/OrderService';
import { trackPromise } from 'react-promise-tracker';
import alertManager from '../helpers/alertManager';

const currencyFormat = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const dateTimeFormat = new Intl.DateTimeFormat('pt-BR');

export default function Panel() {

  const [userName] = useContext(PageContext);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const fecth = async () => {
      let data = await trackPromise(OrderService.findAll());
      alertManager.handleData(data);
      setItems(data);
    }
    fecth();
  }, []);

  return (
    <Navigation title={`Bem-vindo, ${userName}`}>
          {(!items || !items.totalElements || items.totalElements === 0) &&
          <div className='container center'>
            <div className='sectiion'>
              <i style={STYLES.icon} className="large center material-icons">equalizer</i>
            </div>
            <div className='sectiion'>
              <span>Nenhum pedido realzizado</span>
            </div>
          </div>
        }
          {items && items.totalElements > 0 &&
            <>
              <div className='section'><h5>Pedidos realizados</h5></div>
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
                    {items.content.map((pedido) => (
                        <tr key={pedido.id}>
                          <td>{pedido.id}</td>
                          <td>{pedido.client.name}</td>
                          <td>{pedido.items.reduce((t, i) => (t + i.quantity), 0)}</td>
                          <td>{currencyFormat.format(pedido.items.map(i => i.quantity * i.price).reduce((t, i) => (t + i), 0) - pedido.discount)}</td>
                          <td>{dateTimeFormat.format(new Date(pedido.dateTime))}</td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                }
              </div>
            </>
          }
    </Navigation>
  );
}

const STYLES = {
  icon: {
    fontSize: '10rem',
    color: '#aebfbe'
  }
}
