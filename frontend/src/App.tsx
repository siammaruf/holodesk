import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ModalProvider } from './app/hooks/useModal';
import LandingPage from './app/page';
import SignInPage from './app/signin/page';
import DashboardPage from './app/app/page';
import PlayPage from './app/play/[id]/page';
import EditorPage from './app/editor/[id]/page';
import ManagePage from './app/manage/[id]/page';
import PrivacyPolicyPage from './app/privacy-policy/page';
import NotFoundPage from './app/not-found';
import { Navbar } from './components/Navbar/Navbar';

function Layout() {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/signin" replace />;
  }
  return <>{children}</>;
}

const router = createBrowserRouter([
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
]);

export default function App() {
  return (
    <ModalProvider>
      <RouterProvider router={router} />
    </ModalProvider>
  );
}
