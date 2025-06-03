import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addEquipment, fetchEquipments } from '../Redux/userActions';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Typography, Box } from '@mui/material';

const AdminAddEquipment = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    status: 'available',
    imageUrl: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(addEquipment(formData, user.userId));
      alert('הציוד נוסף בהצלחה!');

      await dispatch(fetchEquipments(user.userId, true));
      navigate('/equipments');
    } catch (error) {
      console.error('שגיאה בטופס:', error);
      alert('משהו השתבש, נסי שוב');
    }
  };

  const handleCancel = () => {
    navigate('/equipments');
  };

  return (
    <Box sx={{
      padding: '2rem',
      backgroundColor: '#f5f5f5',
      borderRadius: '8px',
      maxWidth: '600px',
      margin: 'auto',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
    }}>
      <Typography variant="h4" gutterBottom sx={{ color: '#1976d2' }}>הוספת ציוד חדש</Typography>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
        <TextField
          label="שם הציוד"
          name="name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
          margin="normal"
        />
        <TextField
          label="תיאור"
          name="description"
          value={formData.description}
          onChange={handleChange}
          fullWidth
          required
          multiline
          rows={4}
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>קטגוריה</InputLabel>
          <Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <MenuItem value="smartphone">Smartphone</MenuItem>
            <MenuItem value="laptop">Laptop</MenuItem>
            <MenuItem value="iphone">iPhone</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel>סטטוס</InputLabel>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <MenuItem value="available">זמין</MenuItem>
            <MenuItem value="borrowed">בהשאלה</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="קישור לתמונה"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <Box sx={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <Button type="submit" variant="contained" color="primary" sx={{ width: '48%' }}>
            הוסף ציוד
          </Button>
          <Button
            type="button"
            variant="outlined"
            color="secondary"
            onClick={handleCancel}
            sx={{ width: '48%' }}
          >
            ביטול
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default AdminAddEquipment;