import { useQuery } from '@tanstack/react-query';

import { publicApiClient } from '@/api';

export type RefreshTokenResponse = {
  access: string;
};

const fetchRefreshToken = async (): Promise<RefreshTokenResponse> => {
  const response = await publicApiClient.post('/token/refresh/');
  return response.data;
};

export function useAuthToken() {
  return useQuery<RefreshTokenResponse>({
    retry: 0,
    queryKey: ['refreshToken'],
    queryFn: fetchRefreshToken,
    refetchInterval: 1000 * 60 * 4,
  });
}
