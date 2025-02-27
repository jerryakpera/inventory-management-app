import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import './index.css';
import { router } from './Router.tsx';
import { ThemeProvider } from '@/components/theme/ThemeProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider
      defaultTheme='dark'
      storageKey='vite-ui-theme'
    >
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
