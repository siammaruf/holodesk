import { Outlet, Navigate } from "react-router";
import { useAppSelector } from "~/redux/store/hooks";
import Sidebar from "../../components/layout/sidebar";
import { ErrorBoundary } from "~/components/error-boundary";
import { SuspenseLoader } from "~/components/ui/suspense-loader";

export default function DashboardLayout() {
  const { isAuthenticated, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return <SuspenseLoader size="fullScreen" message="Verifying authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1">
        <header className="border-b">
          <div className="flex h-16 items-center px-6">
            <h1 className="text-xl font-bold">Dashboard</h1>
          </div>
        </header>
        <main className="p-6">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}