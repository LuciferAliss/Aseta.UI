import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import ProfilePage from '../pages/ProfilePage';
// import EmailConfirmationPage from '../pages/EmailConfirmationPage';
import PrivateRoute from '../components/PrivateRoute';
import MainPage from '../pages/MainPage';

const AppRouter = () => {
  return (
      <Router>
        <Routes>
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<MainPage />}/>
          {/* <Route path="/confirm-email" element={<EmailConfirmationPage />} /> */}

          <Route element={<PrivateRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Routes>
      </Router>
  );
};

export default AppRouter;