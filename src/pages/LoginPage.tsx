import React from 'react';
import './LoginPage.css';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import Login from '../components/Login/Login';

const LoginPage: React.FC = () => {
  return (
    <div className="login-page">
      <Header />
      <div className="login-container">
        <Login />
      </div>
      <Footer />
    </div>
  );
};

export default LoginPage;