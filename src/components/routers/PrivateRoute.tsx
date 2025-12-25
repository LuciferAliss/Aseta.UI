import type { JSX } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  isAuth: boolean;
  children: JSX.Element;
}

const PrivateRoute = ({ isAuth, children }: PrivateRouteProps) => {
  if (!isAuth) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default PrivateRoute;
