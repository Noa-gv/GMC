import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchBorrowsAdmin, updateBorrowAdmin, returnBorrowAdmin, fetchOverdueBorrows } from "../Redux/userActions";
import {
  Table, TableHead, TableBody, TableRow, TableCell, Button, Typography,
  Paper, Dialog, DialogTitle, DialogContent, DialogActions, Box, Stack, Grid2
} from "@mui/material";

const AdminBorrowsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const borrows = useSelector((state) => state.user.borrows);
  const overdueBorrows = useSelector((state) => state.user.overdueBorrows);
  const users = useSelector((state) => state.user.users) || [];
  const [showOverdue, setShowOverdue] = useState(false);

  // הבאת כל רשימת ההשאלות
  useEffect(() => {
    dispatch(fetchBorrowsAdmin());
  }, [dispatch]);

  // כפתור אישור/דחייה של בקשת השאלה
  const handleUpdateStatus = (borrowId, status, endDate = null) => {
    dispatch(updateBorrowAdmin(borrowId, status, endDate));
  };

  // כפתור החזרת ציוד
  const handleReturnEquipment = (borrowId, equipmentId) => {
    dispatch(returnBorrowAdmin(borrowId, equipmentId));
  };

  // כפתור להצגת בקשות שפגו זמנם
  const handleShowOverdue = () => {
    dispatch(fetchOverdueBorrows());
    setShowOverdue(true);
  };

  // כפתור סגירת הצגת בקשות שפגו זמנם
  const handleCloseOverdue = () => {
    setShowOverdue(false);
  };

  // כפתור ניתוב חזרה לעמוד ציוד
  const handleGoToEquipments = () => {
    navigate("/equipments");
  };

  // כדי שנוכל להציג עבור כל השאלה את פרטי הלקוח שלה נחפש את המשתמש במערך ונציג לפי זה את הנתונים
  const findUser = (userId) => (Array.isArray(users) ? users.find((user) => user.id === userId) : {}) || {};

  return (
    <Box sx={{ padding: 3, borderRadius: "8px" }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: "#2c3e50", fontWeight: "bold" }}>
        ניהול בקשות השאלה
      </Typography>

      <Grid2 container spacing={2} justifyContent="center" sx={{ mb: 2 }}>
        <Grid2 item>
          <Button
            variant="contained"
            color="primary"
            sx={{ backgroundColor: "#007bff", "&:hover": { backgroundColor: "#0056b3" } }}
            onClick={handleShowOverdue}
          >
            הצג בקשות שפגו זמנן
          </Button>
        </Grid2>
        <Grid2 item>
          <Button
            variant="contained"
            color="secondary"
            sx={{ backgroundColor: "#6c757d", "&:hover": { backgroundColor: "#5a6268" } }}
            onClick={handleGoToEquipments}
          >
            חזרה לרשימת ציוד
          </Button>
        </Grid2>
      </Grid2>

      {borrows.length === 0 ? (
        <Typography align="center" sx={{ color: "#7f8c8d" }}>
          אין בקשות השאלה
        </Typography>
      ) : (
        <Paper sx={{ overflow: "hidden", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold", color: "#007bff" }}>מספר פריט</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#007bff" }}>שם משתמש</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#007bff" }}>טלפון</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#007bff" }}>אימייל</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#007bff" }}>תאריך סיום</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#007bff" }}>סטטוס</TableCell>
                <TableCell sx={{ fontWeight: "bold", color: "#007bff" }}>פעולות</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {borrows.map((borrow) => {
                const user = borrow.user || findUser(borrow.userId);
                return (
                  <TableRow key={borrow.id}>
                    <TableCell>{borrow.equipmentId}</TableCell>
                    <TableCell>{user.username || "לא זמין"}</TableCell>
                    <TableCell>{user.phone || "לא זמין"}</TableCell>
                    <TableCell>{user.email || "לא זמין"}</TableCell>
                    <TableCell>{new Date(borrow.endDate).toLocaleDateString()}</TableCell>
                    <TableCell>{borrow.status}</TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {borrow.status !== "borrowed" ? (
                          <>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => handleUpdateStatus(borrow.id, "borrowed")}
                              sx={{ backgroundColor: "#28a745", "&:hover": { backgroundColor: "#218838" } }}
                            >
                              אישור החזרה
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={() => handleUpdateStatus(borrow.id, "rejected")}
                              sx={{ backgroundColor: "#dc3545", "&:hover": { backgroundColor: "#c82333" } }}
                            >
                              דחיית החזרה
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              variant="contained"
                              color="warning"
                              onClick={() => {
                                const newEndDate = prompt("הכנס תאריך חדש (YYYY-MM-DD):");
                                if (newEndDate) handleUpdateStatus(borrow.id, "borrowed", newEndDate);
                              }}
                              sx={{ backgroundColor: "#ffc107", "&:hover": { backgroundColor: "#e0a800" } }}
                            >
                              הארכת תאריך
                            </Button>
                            <Button
                              variant="contained"
                              color="info"
                              onClick={() => handleReturnEquipment(borrow.id, borrow.equipmentId)}
                              sx={{ backgroundColor: "#17a2b8", "&:hover": { backgroundColor: "#138496" } }}
                            >
                              החזרת פריט
                            </Button>
                          </>
                        )}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      )}

      <Dialog open={showOverdue} onClose={handleCloseOverdue} maxWidth="lg">
        <DialogTitle sx={{ backgroundColor: "#007bff", color: "#fff" }}>בקשות שפגו זמנן</DialogTitle>
        <DialogContent sx={{ backgroundColor: "#f8f9fa", maxHeight: 600, overflowY: "auto" }}>
          {overdueBorrows.length === 0 ? (
            <Typography sx={{ color: "#7f8c8d" }}>לא קיימות בקשות שפגו זמנן</Typography>
          ) : (
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", color: "#007bff" }}>פריט</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#007bff" }}>שם משתמש</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#007bff" }}>טלפון</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#007bff" }}>אימייל</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#007bff" }}>תאריך סיום</TableCell>
                  <TableCell sx={{ fontWeight: "bold", color: "#007bff" }}>סטטוס</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {overdueBorrows.map((borrow) => {
                  const user = borrow.user || findUser(borrow.userId);
                  return (
                    <TableRow key={borrow.id}>
                      <TableCell>{borrow.equipmentId}</TableCell>
                      <TableCell>{user.username || "לא זמין"}</TableCell>
                      <TableCell>{user.phone || "לא זמין"}</TableCell>
                      <TableCell>{user.email || "לא זמין"}</TableCell>
                      <TableCell>{new Date(borrow.endDate).toLocaleDateString()}</TableCell>
                      <TableCell>{borrow.status}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: "#f8f9fa" }}>
          <Button onClick={handleCloseOverdue} color="primary" sx={{ color: "#007bff" }}>
            סגור
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminBorrowsPage;
