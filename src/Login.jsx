import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography } from '@mui/material';

export default function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please provide both email and password');
      return;
    }

    try {
      const response = await axios.post('${import.meta.env.VITE_AUTH_AP}/login', {
        email,
        password,
      });

      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userId', response.data.user_id)
      onLoginSuccess();
    } catch (err) {
      setError('Invalid credentials or server error');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ paddingTop: '2rem' }}>
      <Typography variant="h5" gutterBottom>Login</Typography>
      <form onSubmit={handleLogin}>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          sx={{ marginBottom: '1rem' }}
        />
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          fullWidth
          sx={{ marginBottom: '1rem' }}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
        {error && <Typography color="error" sx={{ marginTop: '1rem' }}>{error}</Typography>}
      </form>
    </Container>
  );
}
