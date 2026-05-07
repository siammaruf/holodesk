import { Outlet } from 'react-router-dom';
import { Navbar } from '~/components/layout/Navbar';

export default function BaseLayout() {
  return (
    <div className="relative min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
