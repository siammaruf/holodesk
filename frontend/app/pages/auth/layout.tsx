import { Outlet } from "react-router";
import { ErrorBoundary } from "~/components/error-boundary";

export default function AuthLayout() {
  return (
    <div className="container mx-auto">
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}