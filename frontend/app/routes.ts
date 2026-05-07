// Route configuration for React Router 7
// For now, routes are defined in App.tsx using react-router-dom library mode
// This file serves as the central route config following the guide structure

export const routeConfig = {
  public: [
    { path: '/', page: 'pages/public/home.tsx' },
    { path: '/privacy-policy', page: 'pages/public/privacy-policy.tsx' },
  ],
  auth: [
    { path: '/signin', page: 'pages/auth/login.tsx' },
  ],
  protected: [
    { path: '/app', page: 'pages/dashboard/index.tsx' },
    { path: '/play/:id', page: 'pages/play/detail.tsx' },
    { path: '/editor/:id', page: 'pages/editor/detail.tsx' },
    { path: '/manage/:id', page: 'pages/manage/detail.tsx' },
  ],
};
