import { NavLink, Outlet } from 'react-router-dom';
import { Home, List, ShoppingBasket } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/admin/categories', label: 'Categorías', icon: List },
  { href: '/admin/products', label: 'Productos', icon: ShoppingBasket },
];

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden w-64 flex-col border-r bg-gray-100/40 p-4 dark:bg-gray-800/40 md:flex">
        <h2 className="mb-6 text-2xl font-bold">Admin</h2>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
                  isActive && 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-50'
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mt-auto">
            <NavLink to="/" className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50">
                <Home className="h-4 w-4" />
                Volver al menú
            </NavLink>
        </div>
      </aside>
      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}