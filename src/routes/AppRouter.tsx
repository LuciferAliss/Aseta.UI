import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
import PrivateRoute from '../components/PrivateRoute';
import MainPage from '../pages/MainPage';
import CreateInventoryPage from '../pages/CreateInventoryPage';
import InventoryPage from '../pages/InventoryPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const AppRouter = () => {
  return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/inventory/:id" element={<InventoryPage />}></Route>
          <Route path="/create-inventory" element={<CreateInventoryPage />} />
          <Route path="/" element={<MainPage />}/>
          <Route element={<PrivateRoute />}>
            
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Router>
  );
};

export default AppRouter;