import axios from 'axios';
import {
  loginSuccess,
  registerSuccess,
  setEquipments,
  setUserBorrows,
  editEquipmentSuccess,
  setBorrows,
  updateBorrowStatus,
  returnEquipment,
  setOverdueBorrows
} from '../Redux/userSlice';

// התחברות
export const loginUser = (credentials) => async (dispatch) => {
  try {
    const res = await axios.post('http://localhost:3000/auth/login', credentials, {
      headers: { 'Content-Type': 'application/json' },
    });
    dispatch(loginSuccess(res.data.user));
    return res.data;
  } catch (error) {
    console.error('שגיאה בהתחברות:', error);
    throw error;
  }
};

// הרשמה
export const registerUser = (userData) => async (dispatch) => {
  try {
    const res = await axios.post('http://localhost:3000/auth/register', userData, {
      headers: { 'Content-Type': 'application/json' },
    });
    dispatch(registerSuccess(res.data.user));
    return res.data;
  } catch (error) {
    console.error('שגיאה בהרשמה:', error);
    throw error;
  }
};

// שליפת ציוד
export const fetchEquipments = (userId, isAdmin = false) => async (dispatch) => {
  try {
    const url = 'http://localhost:3000/equipments';

    const res = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        user: isAdmin ? 'true' : userId,
      },
    });

    dispatch(setEquipments(res.data));
    return res.data;
  } catch (error) {
    console.error('שגיאה בשליפת ציוד:', error);
    throw error;
  }
};

// החזרת ציוד משתמש
export const returnBorrow = (borrowId, userId, isAdmin = false) => async (dispatch) => {
  try {
    const url = `http://localhost:3000/borrow/${borrowId}/return`;

    const res = await axios.put(url, {}, {
      headers: {
        'Content-Type': 'application/json',
        user: userId,
      },
    });
    alert('הציוד הוחזר בהצלחה');
    dispatch(fetchEquipments(userId, isAdmin));
    dispatch(fetchUserBorrows(userId));
    return res.data;
  } catch (error) {
    console.error('שגיאה בהחזרת הציוד:', error);
    alert('שגיאה בהחזרת הציוד');
    throw error;
  }
};

// הוספת ציוד חדש מנהל
export const addEquipment = (newEquipment, userId) => async (dispatch) => {
  try {
    const res = await axios.post('http://localhost:3000/admin/equipments', newEquipment, {
      headers: {
        'Content-Type': 'application/json',
        user: 'admin',
      },
    });
    alert('ציוד נוסף בהצלחה');
    dispatch(fetchEquipments(userId, true));
    return res.data;
  } catch (error) {
    console.error('שגיאה בהוספת הציוד:', error);
    alert('שגיאה בהוספת הציוד');
    throw error;
  }
};

// עריכת ציוד מנהל
export const editEquipment = (equipmentId, updatedEquipment, userId) => async (dispatch) => {
  try {
    const res = await axios.put(`http://localhost:3000/admin/equipments/${equipmentId}`, updatedEquipment, {
      headers: {
        'Content-Type': 'application/json',
        user: 'admin',
      },
    });
    dispatch(editEquipmentSuccess(res.data)); 
    return res.data;
  } catch (error) {
    console.error('שגיאה בעדכון הציוד:', error);
    throw error; 
  }
};

// מחיקת ציוד מנהל
export const deleteEquipment = (equipmentId, userId) => async (dispatch) => {
  try {
    await axios.delete(`http://localhost:3000/admin/equipments/${equipmentId}`, {
      headers: {
        'Content-Type': 'application/json',
        user: 'admin',
      },
    });
    alert('הציוד נמחק בהצלחה');
    // ריענון הרשימה
    dispatch(fetchEquipments(userId, true));
  } catch (error) {
    console.error('שגיאה במחיקת הציוד:', error);
    alert('שגיאה במחיקת הציוד');
  }
};

// שליפת השאלות משתמש
export const fetchUserBorrows = (userId) => async (dispatch) => {
  try {
    const res = await axios.get('http://localhost:3000/borrows/me', {
      headers: {
        'Content-Type': 'application/json',
        user: userId,
      },
    });
    dispatch(setUserBorrows(res.data));
    return res.data;
  } catch (error) {
    console.error('שגיאה בשליפת ההשאלות:', error);
    throw error;
  }
};

// בקשת השאלה
export const createBorrow = (borrowData, userId) => async (dispatch) => {
  try {
    const res = await axios.post('http://localhost:3000/borrow', borrowData, {
      headers: {
        'Content-Type': 'application/json',
        user: userId,
      },
    });
    alert('בקשת ההשאלה נשלחה בהצלחה');
    dispatch(fetchEquipments(userId));
    dispatch(fetchUserBorrows(userId));
    return res.data;
  } catch (error) {
    console.error('שגיאה בבקשת ההשאלה:', error);
    alert('שגיאה בבקשת ההשאלה');
    throw error;
  }
};

// שליפת בקשות השאלה עבור מנהל
export const fetchBorrowsAdmin = () => async (dispatch) => {
  try {
    const [borrowsRes, usersRes] = await Promise.all([
      axios.get('http://localhost:3000/admin/borrows', {
        headers: {
          'Content-Type': 'application/json',
          user: 'admin',
        },
      }),
      axios.get('http://localhost:3000/admin/users', {
        headers: {
          'Content-Type': 'application/json',
          user: 'admin',
        },
      })
    ]);
    const users = usersRes.data;
    const borrowsWithUsers = borrowsRes.data.map(borrow => ({
      ...borrow,
      user: users.find(u => u.id === borrow.userId) || {} // מוסיפים מידע על המשתמש
    }));

    dispatch(setBorrows(borrowsWithUsers)); // עדכון הסטייט ב-Redux עם הנתונים המשולבים
    return borrowsWithUsers;
  } catch (error) {
    console.error('שגיאה בשליפת בקשות השאלה או המשתמשים:', error);
    throw error;
  }
};


// בקשת השאלה אישור/דחייה עבור מנהל
export const updateBorrowAdmin = (borrowId, updatedStatus, endDate) => async (dispatch) => {
  try {
    const res = await axios.put(`http://localhost:3000/admin/borrow/${borrowId}`, {
      status: updatedStatus,
      endDate: endDate,
    }, {
      headers: {
        'Content-Type': 'application/json',
        user: 'admin',
      },
    });
    dispatch(updateBorrowStatus({
      id: borrowId,
      status: updatedStatus,
      endDate: endDate,
    }));
    alert('הסטטוס עודכן בהצלחה');
    return res.data;
  } catch (error) {
    console.error('שגיאה בעדכון סטטוס הבקשה:', error);
    alert('שגיאה בעדכון סטטוס הבקשה');
    throw error;
  }
};

// החזרת ציוד מנהל
export const returnBorrowAdmin = (borrowId, equipmentId) => async (dispatch) => {
  try {
    const res = await axios.put(`http://localhost:3000/admin/borrow/${borrowId}/return`, {}, {
      headers: {
        'Content-Type': 'application/json',
        user: 'admin',
      },
    });
    dispatch(returnEquipment({
      borrowId: borrowId,
      equipmentId: equipmentId,
    }));
    alert('הציוד הוחזר בהצלחה');
    return res.data;
  } catch (error) {
    console.error('שגיאה בהחזרת הציוד:', error);
    alert('שגיאה בהחזרת הציוד');
    throw error;
  }
};

// בקשות שפגו זמנן
export const fetchOverdueBorrows = (isAdmin) => async (dispatch) => {
  try {
    const res = await axios.get('http://localhost:3000/admin/borrows/overdue',{
      headers: {
        'Content-Type': 'application/json',
        user: 'admin',
      },
    });
    dispatch(setOverdueBorrows(res.data));
  } catch (error) {
    console.error('שגיאה בשליפת בקשות שפגו זמנן:', error);
  }
};
