import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, ShoppingCart, Gift } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useBranchStore } from '@/hooks/useBranchStore';
import { useCartStore } from '@/hooks/useCartStore';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/menu', icon: Home, label: 'Menú' },
  { href: '/promotions', icon: Gift, label: 'Promos' }, // Nuevo item
  { href: '/cart', icon: ShoppingCart, label: 'Carrito' },
];

export function Layout() {
  const { totalItems } = useCartStore();
  const location = useLocation();
  const isPromotionsPage = location.pathname === '/promotions';
  
  // Eliminamos la lógica de redirección forzada aquí.
  // La selección de sucursal ahora es obligatoria en el formulario del carrito.

  return (
    <div className="flex h-screen w-full flex-col bg-background">
      <main className={cn("flex-1", isPromotionsPage ? "overflow-hidden" : "overflow-y-auto pb-14")}>
        <Outlet />
      </main>
      <footer className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-card shadow-2xl z-40">
        <nav className="mx-auto flex h-12 max-w-md items-center justify-around px-2">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center gap-0.5 px-3 text-[10px] font-black uppercase tracking-wider text-muted-foreground hover:text-primary transition-all duration-150',
                  isActive && 'text-primary'
                )
              }
            >
              <div className="relative">
                <item.icon className="h-5 w-5" />
                {item.href === '/cart' && totalItems() > 0 && (
                  <span className="absolute -right-1.5 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-red-fatboy text-[9px] font-bold text-white shadow-md">
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