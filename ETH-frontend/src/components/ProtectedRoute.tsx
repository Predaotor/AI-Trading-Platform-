import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    // Redirect to signin if user is not authenticated
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

export { ProtectedRoute }; 