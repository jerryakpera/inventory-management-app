import { createBrowserRouter } from 'react-router-dom';

import AdminLayout from '@/features/admin/layout/AdminLayout';

import * as adminPages from '@/features/admin/pages';
import * as variantPages from '@/features/variants/pages';
import * as productsPages from '@/features/products/pages';
import * as unitPages from '@/features/taxonomy/pages/units';
import * as categoriesPages from '@/features/taxonomy/pages/categories';
import { GuestRoute } from './components/authentication/GuestRoute';
import { ProtectedRoute } from './components/authentication/ProtectedRoute';

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
        path: 'variants/add',
        element: <variantPages.AddProductVariantPage />,
      },
      {
        path: 'variants/:id/edit',
        element: <variantPages.EditVariantPage />,
      },
      {
        path: 'variants/:id',
        element: <variantPages.VariantDetailPage />,
      },
      {
        path: 'variants',
        element: <variantPages.VariantsPage />,
      },
      {
        path: 'products/:id/edit/image',
        element: <productsPages.EditProductImagePage />,
      },
      {
        path: 'products/:id/edit',
        element: <productsPages.EditProductPage />,
      },
      {
        path: 'products/add',
        element: <productsPages.AddProductPage />,
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
      {
        path: 'units/:id/edit',
        element: <unitPages.EditUnitPage />,
      },
      {
        path: 'units/add',
        element: <unitPages.AddUnitPage />,
      },
      {
        path: 'units/:id',
        element: <unitPages.UnitPage />,
      },
      {
        path: 'units/',
        element: <unitPages.UnitsPage />,
      },
      {
        path: 'catalog',
        element: <productsPages.CatalogIndex />,
      },
    ],
  },
]);
