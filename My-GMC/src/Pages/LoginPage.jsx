import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginUser } from '../Redux/userActions';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Link, Paper } from '@mui/material';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // כפתור התחברות
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(loginUser({ username, password }));
      console.log('Logged in user:', response);
      navigate('/equipments');
    } catch (error) {
      alert('שם משתמש או סיסמה שגויים');
      console.error(error);
    }
  };

  // כפתור נרשמה
  const handleRegisterRedirect = () => {
    navigate('/register');
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
          התחברות
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
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
            התחבר
          </Button>
        </form>
        <Typography variant="body2" sx={{ marginTop: 2, color: '#424242' }}>
          אין לך חשבון?{' '}
          <Link
            href="#"
            onClick={handleRegisterRedirect}
            variant="body2"
            sx={{ color: '#1976d2', fontWeight: 'bold', cursor: 'pointer' }}
          >
            הירשמי כאן
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
};

export default LoginPage;
