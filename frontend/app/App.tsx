import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ModalProvider } from './hooks/useModal';
import LandingPage from './pages/public/home';
import SignInPage from './pages/auth/login';
import DashboardPage from './pages/dashboard/index';
import PlayPage from './pages/play/detail';
import EditorPage from './pages/editor/detail';
import ManagePage from './pages/manage/detail';
import PrivacyPolicyPage from './pages/public/privacy-policy';
import NotFoundPage from './pages/not-found';
import { Navbar } from './components/layout/Navbar';
import ModalParent from './components/Modal/ModalParent';

function Layout() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <ModalParent />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="w-full h-dvh grid place-items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  return <>{children}</>;
}

function RootLayout() {
  return (
    <ModalProvider>
      <Outlet />
    </ModalProvider>
  );
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
      {
        path: '/signin',
        element: <SignInPage />,
      },
      {
        path: '/privacy-policy',
        element: <PrivacyPolicyPage />,
      },
      {
        element: <Layout />,
        children: [
          {
            path: '/app',
            element: (
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/play/:id',
            element: (
              <ProtectedRoute>
                <PlayPage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/editor/:id',
            element: (
              <ProtectedRoute>
                <EditorPage />
              </ProtectedRoute>
            ),
          },
          {
            path: '/manage/:id',
            element: (
              <ProtectedRoute>
                <ManagePage />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
