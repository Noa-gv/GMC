import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEquipments, fetchUserBorrows, deleteEquipment } from '../Redux/userActions';
import { useNavigate } from 'react-router-dom';
import BorrowDialog from './BorrowDialog';
import { Container, Typography, Button, Card, CardContent, CardActions, CardMedia, Grid } from '@mui/material';

const EquipmentsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.user.user);
  const equipments = useSelector((state) => state.user.equipments);
  const isAdmin = useSelector((state) => state.user.isAdmin);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState(null);

  // קבלה ושמירה של isAdmin כדי שיופיעו כפתורי ניהול
  useEffect(() => {
    if (user) {
      dispatch(fetchEquipments(user.userId, isAdmin));
    }
  }, [dispatch, user, isAdmin]);

  // כפתור למעבר לרשימת ההשאלות למשתמש
  const handleBorrow = (equipmentId) => {
    const selected = equipments.find((equipment) => equipment.id === equipmentId);
    setSelectedEquipment(selected);
    setIsDialogOpen(true);
  };

  // כפתור לבקשת השאלה בפתיחה של דיאלוג
  const handleBorrowSuccess = () => {
    setIsDialogOpen(false);
    setSelectedEquipment(null);
    dispatch(fetchEquipments(user.userId, isAdmin));
    dispatch(fetchUserBorrows(user.id));
  };

  // אם מנהל - יופיע כפתור לעמוד הוספת מוצר
  const handleAddEquipment = () => {
    navigate('/admin/equipments');
  };

  // אם מנהל - יופיע כפתור לעדכון מוצר עבור כל מוצר
  const handleEditEquipment = (equipmentId) => {
    navigate(`/admin/equipments/${equipmentId}`);
  };

  // אם מנהל - יופיע כפתור מחיקה עבור כל מוצר
  const handleDeleteEquipment = (equipmentId) => {
    if (window.confirm('האם את בטוחה שברצונך למחוק את הפריט?')) {
      dispatch(deleteEquipment(equipmentId, user.userId));
    }
  };

  // אם מנהל - יופיע כפתור ניהול רשימת השאלה
  const handleAdminBorrows = () => {
    navigate('/admin/borrows');
  };

  // כפתור לרשימת ההשאלות של המשתמש
  const handleGoToBorrowsPage = () => {
    navigate('/borrows/me');
  };

  if (!user) return <Typography variant="h5" align="center">עליך להתחבר כדי לצפות בציוד</Typography>;

  return (
    <Container component="main" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom color="primary.dark">
        רשימת ציוד
      </Typography>

      {/* כפתורים למנהל */}
      {isAdmin && (
        <Grid container spacing={2} justifyContent="center" sx={{ mb: 4 }}>
          <Grid item>
            <Button variant="contained" sx={{ backgroundColor: '#1976D2', color: 'white', '&:hover': { backgroundColor: '#1565C0' } }} onClick={handleAddEquipment}>
              הוסף ציוד חדש
            </Button>
          </Grid>
          <Grid item>
            <Button variant="contained" sx={{ backgroundColor: '#1565C0', color: 'white', '&:hover': { backgroundColor: '#0D47A1' } }} onClick={handleAdminBorrows}>
              נהל בקשות השאלה
            </Button>
          </Grid>
        </Grid>
      )}

      {/* כפתור למעבר לרשימת השאלות של המשתמש */}
      <Grid container justifyContent="center" sx={{ mb: 4 }}>
        <Button variant="outlined" color="primary" onClick={handleGoToBorrowsPage} sx={{ fontWeight: 'bold', padding: '8px 24px' }}>
          הצג את ההשאלות שלי
        </Button>
      </Grid>

      {/* הצגת ציוד */}
      <Grid container spacing={3} justifyContent="center">
        {equipments.length === 0 ? (
          <Typography variant="h6" align="center" color="text.secondary">
            אין ציוד להצגה כרגע
          </Typography>
        ) : (
          equipments.map((equipment) => (
            <Grid item key={equipment.id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ borderRadius: 2, boxShadow: 3, border: '1px solid #BBDEFB', transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.05)' } }}>
                {equipment.imageUrl && (
                  <CardMedia component="img" height="140" image={equipment.imageUrl} alt={equipment.name} />
                )}
                <CardContent>
                  <Typography variant="h6" color="primary">{equipment.name}</Typography>
                  <Typography variant="body2" color="textSecondary">{equipment.description}</Typography>
                  <Typography variant="body2">קטגוריה: {equipment.category}</Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: equipment.status === 'available' ? 'green' : 'red', fontWeight: 'bold' }}
                  >
                    סטטוס: {equipment.status}
                  </Typography>
                </CardContent>
                <CardActions>
                  {equipment.status === 'available' && !isAdmin && (
                    <Button size="small" sx={{ color: '#1976D2' }} onClick={() => handleBorrow(equipment.id)}>
                      השאלה
                    </Button>
                  )}
                  {isAdmin && (
                    <>
                      <Button size="small" sx={{ color: '#1565C0' }} onClick={() => handleEditEquipment(equipment.id)}>
                        ערוך
                      </Button>
                      <Button size="small" sx={{ color: 'red' }} onClick={() => handleDeleteEquipment(equipment.id)}>
                        מחק
                      </Button>
                    </>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* דיאלוג להשאלת ציוד */}
      {isDialogOpen && selectedEquipment && (
        <BorrowDialog
          equipment={selectedEquipment}
          userId={user.id}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={handleBorrowSuccess}
        />
      )}
    </Container>
  );
};

export default EquipmentsPage;
