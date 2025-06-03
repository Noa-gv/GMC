import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { editEquipment } from '../Redux/userActions';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, MenuItem, Select, InputLabel, FormControl, Typography, Box, Paper } from '@mui/material';

const AdminEditEquipments = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { equipmentId } = useParams();
    const user = useSelector((state) => state.user.user);
    const equipments = useSelector((state) => state.user.equipments);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        status: 'available',
        imageUrl: '',
    });

    // const categories = ['smartphone', 'laptop', 'iphone'];

    //בדיקה אם הסוג של הקוד מוצר שקיבלנו הוא int
    const numericEquipmentId = equipmentId ? Number(equipmentId) : null;

    //קבלה ושמירה של קוד מוצר כדי שבעידכון ובהבאת המוצר יוצגו הערכים שהיו
    useEffect(() => {
        if (numericEquipmentId && equipments.length > 0) {
            const equipmentToEdit = equipments.find(e => e.id === numericEquipmentId);
            if (equipmentToEdit) {
                setFormData({
                    name: equipmentToEdit.name || '',
                    description: equipmentToEdit.description || '',
                    category: equipmentToEdit.category || '',
                    status: equipmentToEdit.status || 'available',
                    imageUrl: equipmentToEdit.imageUrl || '',
                });
            }
        }
    }, [numericEquipmentId, equipments]);

    //עדכון נתונים בזמן אמת בתוך input
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    //שמירה ועדכון נתונים חדשים של המוצר
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!numericEquipmentId) {
            alert('ID ציוד לא קיים');
            return;
        }
        try {
            const updatedEquipment = {
                ...formData,
                userId: user.userId,
            };
            await dispatch(editEquipment(numericEquipmentId, updatedEquipment, user.userId));
            alert('הציוד עודכן בהצלחה');
            navigate('/equipments');
        } catch (error) {
            console.error('שגיאה בעדכון הציוד:', error);
            alert('שגיאה בעדכון הציוד');
        }
    };

    //כפתור לחזרה וביטול לעמוד רשימת ציוד
    const handleCancel = () => {
        navigate('/equipments');
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <Paper elevation={3} sx={{ padding: 4, borderRadius: 2, backgroundColor: '#f9f9f9', width: '500px' }}>
                <Typography variant="h4" gutterBottom textAlign="center">עריכת ציוד </Typography>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
                    <TextField
                        label="שם הציוד"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth required margin="normal" />
                    <TextField
                        label="תיאור"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth required multiline rows={4} margin="normal" />
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
                        <Select name="status"
                            value={formData.status}
                            onChange={handleChange}>
                            <MenuItem value="available">זמין</MenuItem>
                            <MenuItem value="borrowed">בהשאלה</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="קישור לתמונה"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleChange}
                        fullWidth margin="normal" />
                    <Box
                        display="flex"
                        justifyContent="space-between" mt={2}>
                        <Button type="submit" variant="contained" color="primary">עדכן ציוד</Button>
                        <Button type="button" variant="outlined" color="secondary" onClick={handleCancel}>ביטול</Button>
                    </Box>
                </form>
            </Paper>
        </Box>
    );
};

export default AdminEditEquipments;
