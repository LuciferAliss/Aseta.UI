import LoginPage from '../Pages/LoginPage';
import RegisterPage from '../Pages/RegisterPage';
import ProfilePage from '../Pages/ProfilePage';
import PrivateRoute from '../components/PrivateRoute';
import MainPage from '../Pages/MainPage';
import CreateInventoryPage from '../Pages/CreateInventoryPage';
import InventoryPage from '../Pages/InventoryPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const AppRouter = () => {
  return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/inventory/:id" element={<InventoryPage />}></Route>
          <Route path="/" element={<MainPage />}/>
          <Route element={<PrivateRoute />}>
            <Route path="/create-inventory" element={<CreateInventoryPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Router>
  );
};

export default AppRouter;