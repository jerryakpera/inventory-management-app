import { Navigate, useLocation } from 'react-router-dom';

import { useAuthToken } from '@/hooks/use-auth-token';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();

  const { data, isLoading } = useAuthToken();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return (
      <Navigate
        replace
        to='/login'
        state={{ from: location }}
      />
    );
  }

  return <>{children}</>;
}
