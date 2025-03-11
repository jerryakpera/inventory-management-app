import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '@/contexts/AuthContext';

type GuestRouteProps = {
  children: React.ReactNode;
};

export const GuestRoute = ({ children }: GuestRouteProps) => {
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return <>{children}</>;
};
