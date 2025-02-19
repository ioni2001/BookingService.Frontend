import React, { useState } from 'react';
import './Login.css';
import { UserLoginRequest } from '../../models/UserLoginRequest';
import { UserLoginResponse } from '../../models/UserLoginResponse';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const loginRequest: UserLoginRequest = {
      email,
      password,
    };

    try {
      const response = await fetch('http://acme.com/api/Users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginRequest),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data: UserLoginResponse = await response.json();

      // Store the JWT token and user ID in local storage
      localStorage.setItem('jwtToken', data.jwtToken);
      localStorage.setItem('userId', data.id);

      // Redirect to the dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="login-form-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default Login;