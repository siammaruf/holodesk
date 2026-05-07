import { Link } from "react-router";
import { useAppSelector } from "~/redux/store/hooks";
import { appConfig } from "~/config/app.config";

export default function Header() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between mx-auto px-4">
        <Link to="/" className="text-xl font-bold">
          {appConfig.name}
        </Link>
        <nav className="flex gap-4">
          <Link to="/" className="hover:text-primary">Home</Link>
          <Link to="/about" className="hover:text-primary">About</Link>
          {isAuthenticated ? (
            <>
              <Link to="/admin" className="hover:text-primary">Dashboard</Link>
              <Link to="/login" className="hover:text-primary">Logout</Link>
            </>
          ) : (
            <Link to="/login" className="hover:text-primary">Login</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
