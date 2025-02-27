// Define routes for my application using react-router-dom
import { createBrowserRouter } from 'react-router-dom';

import AdminLayout from '@/features/admin/layout/AdminLayout';

import * as adminPages from '@/features/admin/pages';
import * as productsPages from '@/features/products/pages';

export const router = createBrowserRouter([
  {
    path: 'login',
    element: <adminPages.LoginPage />,
  },
  {
    path: '/',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <adminPages.Dashboard />,
      },
      {
        path: 'products',
        element: <productsPages.ProductsPage />,
      },
      // Create route for adding product
      {
        path: 'products/add',
        element: <productsPages.AddProductPage />,
      },
    ],
  },
]);
