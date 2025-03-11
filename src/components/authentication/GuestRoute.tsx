import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AuthContext } from '@/contexts/AuthContext';

type GuestRouteProps = {
  children: React.ReactNode;
};

export const GuestRoute = ({ children }: GuestRouteProps) => {
  console.log('GuestRoute');
  const navigate = useNavigate();

  const { user } = useContext(AuthContext);

  useEffect(() => {
    console.log('GuestRoute - useEffect');
    if (user) {
      console.log('GuestRoute - useEffect - user');
      navigate('/');
    }
  }, [user, navigate]);

  return <>{children}</>;
};
