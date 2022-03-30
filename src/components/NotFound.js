import React from 'react';
import Navigation from './Navigation';

export default function NotFound() {

  return (
    <Navigation title={`Conteúdo não encontrado!`}>
      <div className='container center'>
        <div className='sectiion'>
          <i style={STYLES.icon} className="large center material-icons">equalizer</i>
        </div>
        <div className='sectiion'>
          <span>Nenhuma página disponível para esse endereço</span>
        </div>
      </div>
    </Navigation>
  );
}

const STYLES = {
  icon: {
    fontSize: '15rem',
    color: '#aebfbe'
  }
}