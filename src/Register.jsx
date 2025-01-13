import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography } from '@mui/material';

export default function Register({ onRegisterSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      const response = await axios.post('${import.meta.env.VITE_AUTH_AP}/register', {
        name,
        email,
        password,
      });

      onRegisterSuccess();
    } catch (err) {
      setError('Server error or user already exists');
    }
  };

  return (
    <Container maxWidth="xs" sx={{ paddingTop: '2rem' }}>
      <Typography variant="h5" gutterBottom>Register</Typography>
      <form onSubmit={handleRegister}>
        <TextField
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          sx={{ marginBottom: '1rem' }}
        />
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
          Register
        </Button>
        {error && <Typography color="error" sx={{ marginTop: '1rem' }}>{error}</Typography>}
      </form>
    </Container>
  );
}
