import React, { useEffect, useState } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Cart from './components/Cart';
import Clients from './components/Clients';
import Login from './components/Login';
import NotFound from './components/NotFound';
import Panel from './components/Panel';
import Products from './components/Products';
import Users from './components/Users';
import { PageContext } from './helpers/pageContext';
import AuthenticationService from './services/AuthenticationService';

export default function App() {

  const [userName, setUserName] = useState([]);

  useEffect(() => {
    let auth = AuthenticationService.getAuth();
    setUserName(auth.userName ? auth.userName : null);
    if(userName && userName.length > 0 && (window.location.pathname === '/' || window.location.pathname === ''))
      window.location.pathname = '/panel';
  },[userName]);

  return (
    <PageContext.Provider value={[userName, setUserName]}>
        
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/panel" element={<Panel />} />
          <Route path="/products" element={<Products />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/users" element={<Users />} />
          <Route path="/*" element={<NotFound />} />
        </Routes>
    </PageContext.Provider>
  );
}
