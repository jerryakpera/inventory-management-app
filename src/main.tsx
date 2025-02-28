import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AnimatePresence } from 'framer-motion';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@/index.css';
import { router } from '@/Router.tsx';
import { ThemeProvider } from '@/components/theme/ThemeProvider.tsx';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        defaultTheme='dark'
        storageKey='vite-ui-theme'
      >
        <AnimatePresence mode='wait'>
          <RouterProvider router={router} />
        </AnimatePresence>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
);
