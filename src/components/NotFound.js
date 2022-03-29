import React from 'react';
import Navigation from './Navigation';

export default function NotFound() {

  return (
    <Navigation title={`Conteúdo não encontrado!`}>
      <div className='section'>
        <div className='center'>
          <i style={STYLES.icon} className='material-icons'>flag</i>
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