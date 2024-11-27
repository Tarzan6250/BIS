import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/api';

function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const { data } = await loginUser({ username, password });
      onLogin(data.user);
    } catch (error) {
      alert('Invalid credentials.');
    }
  };

  const handleRegister = async () => {
    try {
      await registerUser({ username, password });
      alert('Registration successful.');
    } catch (error) {
      alert('Error during registration.');
    }
  };

  return (
    <div>
      <h2>Login / Register</h2>
      <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Login;
