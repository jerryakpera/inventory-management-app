import { createBrowserRouter } from 'react-router-dom';

import AdminLayout from '@/features/admin/layout/AdminLayout';

import * as adminPages from '@/features/admin/pages';
import * as productsPages from '@/features/products/pages';
import * as categoriesPages from '@/features/taxonomy/pages/categories';

import { GuestRoute, ProtectedRoute } from '@/components/auth';

export const router = createBrowserRouter([
  {
    path: 'login',
    element: (
      <GuestRoute>
        <adminPages.LoginPage />
      </GuestRoute>
    ),
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <adminPages.Dashboard />,
      },
      {
        path: 'products/:id',
        element: <productsPages.ProductDetailPage />,
      },
      {
        path: 'products',
        element: <productsPages.ProductsPage />,
      },
      {
        path: 'products/add',
        element: <productsPages.AddProductPage />,
      },
      {
        path: 'categories/:id/edit',
        element: <categoriesPages.EditCategoryPage />,
      },
      {
        path: 'categories/add',
        element: <categoriesPages.AddCategoryPage />,
      },
      {
        path: 'categories/:id',
        element: <categoriesPages.CategoryPage />,
      },
      {
        path: 'categories/',
        element: <categoriesPages.CategoriesPage />,
      },
    ],
  },
]);
