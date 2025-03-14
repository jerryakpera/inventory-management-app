import {
  Tag,
  Package,
  FileText,
  Settings,
  BarChart3,
  RefreshCcw,
  UsersRound,
  ShoppingCart,
  ShoppingBasket,
} from 'lucide-react';

export const data = {
  user: {
    name: 'Admin User',
    email: 'admin@example.com',
    avatar: '/avatars/admin.jpg',
  },
  teams: [
    {
      name: 'Warehouse HQ',
      logo: Package,
      plan: 'Enterprise',
    },
    {
      name: 'Retail Store',
      logo: ShoppingCart,
      plan: 'Startup',
    },
  ],
  navMain: [
    {
      title: 'Catalog',
      url: '#',
      icon: ShoppingBasket,
      items: [
        { title: 'Products', url: '/products' },
        { title: 'Variants', url: '/variants' },
        { title: 'Categories', url: '/categories' },
      ],
    },
    {
      title: 'Inventory',
      url: '#',
      icon: Package,
      items: [
        { title: 'Adjust Stock', url: '#' },
        { title: 'Transfer Stock', url: '#' },
      ],
    },
    {
      title: 'Miscellaneous',
      url: '#',
      icon: Tag,
      items: [
        { title: 'Units', url: '/units' },
        { title: 'Brands', url: '/brands' },
      ],
    },
    {
      title: 'Purchases',
      url: '#',
      icon: FileText,
      items: [
        { title: 'Purchase Orders List', url: '#' },
        { title: 'Create Purchase Order', url: '#' },
        { title: 'Approval Workflow', url: '#' },
        { title: 'Expected Delivery Dates', url: '#' },
      ],
    },
    {
      title: 'Sales & Orders',
      url: '#',
      icon: ShoppingCart,
      items: [
        { title: 'Order List', url: '#' },
        { title: 'Invoice Generation', url: '#' },
        { title: 'Order Fulfillment', url: '#' },
      ],
    },
    {
      title: 'Returns & Refunds',
      url: '#',
      icon: RefreshCcw,
      items: [
        { title: 'Returns Management', url: '#' },
        { title: 'Stock Adjustments', url: '#' },
      ],
    },
    {
      title: 'Users',
      url: '#',
      icon: UsersRound,
      items: [
        { title: 'User Management', url: '#' },
        { title: 'Activity Logs', url: '#' },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings,
      items: [
        { title: 'API Integrations', url: '#' },
        { title: 'Payment Gateways', url: '#' },
        { title: 'General Settings', url: '#' },
      ],
    },
  ],
  projects: [
    {
      name: 'Inventory Tracking',
      url: '#',
      icon: Package,
    },
    {
      name: 'E-commerce Sync',
      url: '#',
      icon: ShoppingCart,
    },
    {
      name: 'Analytics Dashboard',
      url: '#',
      icon: BarChart3,
    },
  ],
};
