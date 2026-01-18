import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../lib/contexts/AuthContext";
import { Center, Spinner } from "@chakra-ui/react";

interface PrivateRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];
}

const PrivateRoute = ({
  children,
  allowedRoles,
}: PrivateRouteProps): JSX.Element => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner />
      </Center>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
