import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, ShoppingCart, Gift } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useBranchStore } from '@/hooks/useBranchStore';
import { useCartStore } from '@/hooks/useCartStore';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', icon: Home, label: 'Menú' },
  { href: '/promotions', icon: Gift, label: 'Promos' }, // Nuevo item
  { href: '/cart', icon: ShoppingCart, label: 'Carrito' },
];

export function Layout() {
  const { totalItems } = useCartStore();
  
  // Eliminamos la lógica de redirección forzada aquí.
  // La selección de sucursal ahora es obligatoria en el formulario del carrito.

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <main className="flex-1 overflow-y-auto pb-20">
        <Outlet />
      </main>
      <footer className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-card">
        <nav className="mx-auto flex h-16 max-w-md items-center justify-around">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-1 px-4 text-sm font-medium text-muted-foreground hover:text-primary',
                  isActive && 'text-primary'
                )
              }
            >
              <div className="relative">
                <item.icon className="h-6 w-6" />
                {item.href === '/cart' && totalItems() > 0 && (
                  <span className="absolute -right-2 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-fatboy text-xs text-white">
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