import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  equipments: [],
  userBorrows: [],
  borrows: [],
  overdueBorrows: [],
  isAdmin: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // התחברות
    loginSuccess: (state, action) => {
      state.user = action.payload;
      state.isAdmin = action.payload.isAdmin;
    },
    // הרשמה
    registerSuccess: (state, action) => {
      state.user = action.payload;
      state.isAdmin = action.payload.isAdmin;
    },
    // רשימת ציוד משתמש
    setEquipments: (state, action) => {
      state.equipments = action.payload;
    },
    // רשימת השאלות למשתמש
    setUserBorrows: (state, action) => {
      state.userBorrows = action.payload;
    },
    // האם מנהל
    setAdminStatus: (state, action) => {
      state.isAdmin = action.payload;
    },
    // הוספת/עדכון ציוד
    editEquipmentSuccess: (state, action) => {
      const index = state.equipments.findIndex(e => e.id === action.payload.id);
      if (index !== -1) {
        state.equipments[index] = action.payload;
      }
    },
    // שמירת בקשות השאלה למנהל
    setBorrows: (state, action) => {
      state.borrows = action.payload;
    },
     // עדכון סטטוס בקשת השאלה
     updateBorrowStatus: (state, action) => {
      const index = state.borrows.findIndex(borrow => borrow.id === action.payload.id);
      if (index !== -1) {
        state.borrows[index].status = action.payload.status;
        state.borrows[index].endDate = action.payload.endDate;
      }
    },
    // עדכון סטטוס החזרת הציוד
    returnEquipment: (state, action) => {
      const borrowIndex = state.borrows.findIndex(borrow => borrow.id === action.payload.borrowId);
      if (borrowIndex !== -1) {
        state.borrows[borrowIndex].status = 'completed';
      }
      const equipmentIndex = state.equipments.findIndex(e => e.id === action.payload.equipmentId);
      if (equipmentIndex !== -1) {
        state.equipments[equipmentIndex].status = 'available';
      }
    },
    //בקשות שפגו זמנם
    setOverdueBorrows: (state, action) => {
      state.overdueBorrows = action.payload;
      state.isAdmin = action.payload.isAdmin;
    },
  },
});

export const {
  loginSuccess,
  registerSuccess,
  setEquipments,
  setUserBorrows,
  setAdminStatus,
  editEquipmentSuccess,
  setBorrows,
  updateBorrowStatus,
  returnEquipment,
  setOverdueBorrows
} = userSlice.actions;

export default userSlice.reducer;
