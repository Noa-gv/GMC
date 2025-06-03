import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserBorrows, returnBorrow } from '../Redux/userActions';
import { Button, Card, CardContent, Typography, Grid2, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';  

const BorrowList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();  

  const userId = useSelector(state => state.user.user?.id);
  const userBorrows = useSelector(state => state.user.userBorrows || []);

  // קבלה ושמירה של קוד לקוח כדי שנציג לפי זה את ההשאלות המתאימות
  useEffect(() => {
    if (userId) {
      dispatch(fetchUserBorrows(userId));
    }
  }, [dispatch, userId]);

  // כפתור להחזרת ציוד
  const handleReturn = async (borrowId) => {
    if (!borrowId) return;
    const confirmReturn = window.confirm('האם את בטוחה שאת רוצה להחזיר את הציוד?');
    if (!confirmReturn) return;
    try {
      await dispatch(returnBorrow(borrowId, userId));  
      alert('הציוד הוחזר בהצלחה!');
    } catch (error) {
      alert('אירעה שגיאה בהחזרת הציוד');
    }
  };

  // כפתור לחזרה לעמוד רשימת ציוד
  const handleCancel = () => {
    navigate('/equipments');
  };

  return (
    <Box sx={{ padding: 3, minHeight: '200vh' }}>
      <Typography variant="h4" gutterBottom align="center" color="primary">ההשאלות שלי</Typography>

      {/* כפתור חזרה לרשימת ציוד */}
      <Button
        type="button"
        variant="outlined"
        color="primary"
        onClick={handleCancel}
        sx={{
          marginBottom: 2,
          alignSelf: 'flex-start',
          padding: '8px 16px',
          borderColor: '#1976d2',
          color: '#1976d2',
          '&:hover': { borderColor: '#1565c0', color: '#1565c0' },
        }}
      >
        חזרה לרשימת הציוד
      </Button>

      {userBorrows.length === 0 ? (
        <Typography variant="body1" align="center" color="textSecondary">לא נמצאו השאלות עבורך.</Typography>
      ) : (
        <Paper sx={{ padding: 3, backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 3 }}>
          <Grid2 container spacing={2} justifyContent="center">
            {userBorrows.map(borrow => (
              <Grid2 item xs={12} sm={6} md={4} key={borrow.id}>
                <Card sx={{ borderRadius: 2, boxShadow: 3, padding: 2, backgroundColor: '#fafafa' }}>
                  <CardContent>
                    <Typography variant="h6" component="h3" gutterBottom>
                      קוד ציוד: {borrow.id}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">תאריך השאלה: {borrow.startDate}</Typography>
                    <Typography variant="body2" color="textSecondary">תאריך החזרה: {borrow.endDate}</Typography>
                    <Typography variant="body2" color={borrow.status === 'borrowed' ? 'orange' : 'green'}>
                      סטטוס: {borrow.status === 'borrowed' ? 'מושאל' : 'הוחזר'}
                    </Typography>

                    {borrow.status === 'borrowed' && (
                      <Button
                        onClick={() => handleReturn(borrow.id)}
                        variant="contained"
                        color="success"
                        fullWidth
                        sx={{ marginTop: 2 }}
                      >
                        החזר ציוד
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        </Paper>
      )}
    </Box>
  );
};

export default BorrowList;
