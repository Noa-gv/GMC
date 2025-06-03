import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { registerUser } from '../Redux/userActions';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Paper
} from '@mui/material';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // כפתור הרשמה 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(registerUser({ email, username, password, phone }));
      console.log(email, username, password, phone);
      navigate('/equipments');
    } catch (error) {
      alert('שגיאה בהרשמה');
      console.error(error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#f5f5f5',
          borderRadius: 2,
          boxShadow: 3,
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: 2, color: '#1976d2', fontWeight: 'bold' }}>
          הרשמה
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="מייל"
            variant="outlined"
            fullWidth
            margin="normal"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{ backgroundColor: 'white', borderRadius: 1 }}
          />
          <TextField
            label="שם משתמש"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            sx={{ backgroundColor: 'white', borderRadius: 1 }}
          />
          <TextField
            label="סיסמה"
            variant="outlined"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            sx={{ backgroundColor: 'white', borderRadius: 1 }}
          />
          <TextField
            label="טלפון"
            variant="outlined"
            fullWidth
            margin="normal"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            sx={{ backgroundColor: 'white', borderRadius: 1 }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              marginTop: 2,
              backgroundColor: '#1976d2',
              '&:hover': { backgroundColor: '#1565c0' },
            }}
          >
            הירשם
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default RegisterPage;