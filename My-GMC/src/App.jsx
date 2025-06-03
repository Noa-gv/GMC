import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// עמודים
import Login from './Pages/LoginPage';
import Register from './Pages/RegisterPage';
import BorrowList from './Pages/BorrowList';
import EquipmentsPage from './Pages/EquipmentsPage'
import AdminAddEquipment from './Pages/AdminAddEquipment';
import AdminEditEquipments from './Pages/AdminEditEquipments'
import AdminBorrowsPage from './Pages/AdminBorrowsPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/equipments" element={<EquipmentsPage />} />
        <Route path="/borrows/me" element={<BorrowList />} />
        <Route path="/admin/equipments" element={<AdminAddEquipment />} />
        <Route path="/admin/equipments/:equipmentId" element={<AdminEditEquipments />} />
        <Route path="/admin/equipments/:Id" element={<EquipmentsPage />} />
        <Route path="/admin/borrows" element={<AdminBorrowsPage />} /> 
        <Route path="/admin/borrowes/overdue" element={<AdminBorrowsPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;