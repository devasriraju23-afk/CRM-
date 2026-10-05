import { Outlet } from 'react-router-dom';
import PublicNav from '../components/layout/PublicNav.jsx';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <PublicNav />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
