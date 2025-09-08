import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage.tsx';
import RegisterPage from '../pages/RegisterPage.tsx';
import ProfilePage from '../pages/ProfilePage.tsx';
import PrivateRoute from '../components/PrivateRoute';
import MainPage from '../pages/MainPage.tsx';
import CreateInventoryPage from '../pages/CreateInventoryPage.tsx';
import InventoryPage from '../pages/InventoryPage.tsx';

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