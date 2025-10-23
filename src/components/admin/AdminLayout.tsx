import { NavLink, Outlet } from 'react-router-dom';
import { Home, List, ShoppingBasket, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navItems = [
  { href: '/admin/categories', label: 'Categorías', icon: List },
  { href: '/admin/products', label: 'Productos', icon: ShoppingBasket },
];

interface NavItemProps {
  href: string;
  label: string;
  Icon: React.ElementType;
  onClick?: () => void;
}

const AdminNavLink = ({ href, label, Icon, onClick }: NavItemProps) => (
  <NavLink
    to={href}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50',
        isActive && 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-50'
      )
    }
  >
    <Icon className="h-4 w-4" />
    {label}
  </NavLink>
);

export default function AdminLayout() {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleNavClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Sidebar para Desktop */}
      <aside className="hidden w-64 flex-col border-r bg-gray-100/40 p-4 dark:bg-gray-800/40 md:flex">
        <h2 className="mb-6 text-2xl font-bold">Admin</h2>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <AdminNavLink key={item.href} href={item.href} label={item.label} Icon={item.icon} />
          ))}
        </nav>
        <div className="mt-auto">
          <AdminNavLink href="/" label="Volver al menú" Icon={Home} />
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col">
        {/* Header para Mobile (con botón de menú) */}
        <header className="flex items-center justify-between border-b p-4 md:hidden">
          <h1 className="text-xl font-bold">Admin Panel</h1>
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-4">
              <h2 className="mb-6 text-2xl font-bold">Admin</h2>
              <nav className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <AdminNavLink key={item.href} href={item.href} label={item.label} Icon={item.icon} onClick={handleNavClick} />
                ))}
              </nav>
              <div className="mt-auto pt-4 border-t">
                <AdminNavLink href="/" label="Volver al menú" Icon={Home} onClick={handleNavClick} />
              </div>
            </SheetContent>
          </Sheet>
        </header>
        
        <div className="flex-1 p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}