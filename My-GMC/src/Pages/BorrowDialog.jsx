import React, { useState } from 'react';
import axios from 'axios';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Typography } from '@mui/material';

const BorrowDialog = ({ equipment, userId, onClose, onSuccess }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // המרת תאריכים לאובייקטים של Date
    const start = new Date(startDate);
    const end = new Date(endDate);

    // היום הנוכחי + חודש קדימה
    const maxReturnDate = new Date();
    maxReturnDate.setMonth(maxReturnDate.getMonth() + 1);

    // בדיקה אם תאריך ההחזרה חורג מהחודש הבא
    if (end > maxReturnDate) {
      alert('תאריך ההחזרה לא יכול להיות מעבר לחודש מהיום!');
      return;
    }

    // בדיקה אם תאריך ההחזרה קטן מתאריך ההשאלה 
    if (end < start) {
      alert('תאריך ההחזרה לא יכול להיות לפני תאריך ההשאלה!');
      return;
    }

    try {
      const borrowData = {
        equipmentId: equipment.id,
        startDate,
        endDate,
      };
      await axios.post('http://localhost:3000/borrow', borrowData, {
        headers: {
          'Content-Type': 'application/json',
          user: userId,
        },
      });
      alert(`בקשת השאלה נשלחה בהצלחה עבור: ${equipment.name}`);
      onSuccess();
    } catch (error) {
      console.error('שגיאה בבקשת ההשאלה:', error);
      alert('שגיאה בביצוע בקשת ההשאלה');
    }
  };

  return (
    <Dialog open onClose={onClose} >
      <DialogTitle sx={{ backgroundColor: '#1976d2', color: 'white' }}>בקשת השאלה: {equipment.name}</DialogTitle>
      <DialogContent sx={{ backgroundColor: '#fff' }}>
        <Typography variant="body1"  color="textPrimary">
          אנא מלא את התאריכים לבקשת השאלה:
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="תאריך השאלה"
            type="date"
            fullWidth
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: 2, backgroundColor: '#fafafa', borderRadius: 1 }}
          />
          <TextField
            label="תאריך החזרה"
            type="date"
            fullWidth
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
            InputLabelProps={{ shrink: true }}
            sx={{ marginBottom: 2, backgroundColor: '#fafafa', borderRadius: 1 }}
          />
          <DialogActions>
            <Button onClick={onClose} color="secondary" sx={{ color: '#d32f2f' }}>
              סגור
            </Button>
            <Button type="submit" color="primary" sx={{ backgroundColor: '#1976d2', color: 'white', '&:hover': { backgroundColor: '#1565c0' } }}>
              שלח בקשה
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BorrowDialog;
