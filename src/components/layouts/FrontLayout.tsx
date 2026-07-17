import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function FrontLayout() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header />
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}