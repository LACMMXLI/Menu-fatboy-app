import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, ShoppingCart, Store } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useBranchStore } from '@/hooks/useBranchStore';
import { useCartStore } from '@/hooks/useCartStore';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Menú' },
  { href: '/cart', icon: ShoppingCart, label: 'Carrito' },
  { href: '/branch', icon: Store, label: 'Sucursal' },
];

export function Layout() {
  const { selectedBranch } = useBranchStore();
  const { totalItems } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!selectedBranch && location.pathname !== '/branch') {
      navigate('/branch', { replace: true });
    }
  }, [selectedBranch, location.pathname, navigate]);

  if (!selectedBranch && location.pathname !== '/branch') {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <p>Cargando...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50 dark:bg-gray-950">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      <footer className="fixed bottom-0 left-0 right-0 border-t bg-white dark:bg-black">
        <nav className="mx-auto flex h-16 max-w-md items-center justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 px-4 text-sm font-medium text-gray-500 hover:text-primary dark:text-gray-400',
                  isActive && 'text-primary dark:text-white'
                )
              }
            >
              <div className="relative">
                <item.icon className="h-6 w-6" />
                {item.href === '/cart' && totalItems() > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {totalItems()}
                  </span>
                )}
              </div>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </footer>
    </div>
  );
}