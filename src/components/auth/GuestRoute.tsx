import { Navigate, useLocation } from 'react-router-dom';

import { useAuthToken } from '@/hooks/use-auth-token';

type GuestRouteProps = {
  children: React.ReactNode;
};

export function GuestRoute({ children }: GuestRouteProps) {
  const location = useLocation();

  const { data } = useAuthToken();

  if (data) {
    const { access } = data;

    if (access) {
      return (
        <Navigate
          replace
          to='/'
          state={{ from: location }}
        />
      );
    }
  }

  return <>{children}</>;
}
