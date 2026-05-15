import { NavLink, Outlet } from 'react-router-dom';
import { Home, List, ShoppingBasket, Menu, Star, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navItems = [
  { href: '/admin/pedidos/venecia', label: 'Pedidos Venecia', icon: ShoppingBasket },
  { href: '/admin/pedidos/san-marcos', label: 'Pedidos San Marcos', icon: ShoppingBasket },
  { href: '/admin/categories', label: 'Categorías', icon: List },
  { href: '/admin/products', label: 'Productos', icon: ShoppingBasket },
  { href: '/admin/promotions', label: 'Promociones', icon: Star },
  { href: '/admin/reviews', label: 'Reseñas', icon: MessageSquare },
];

interface NavItemProps {
  href: string;
  label: string;
  Icon: React.ElementType;
  isCollapsed?: boolean;
  onClick?: () => void;
}

const AdminNavLink = ({ href, label, Icon, isCollapsed, onClick }: NavItemProps) => (
  <NavLink
    to={href}
    onClick={onClick}
    className={({ isActive }) =>
      cn(
        'flex items-center gap-3 rounded-xl px-3 py-3 transition-all duration-300 hover:bg-white/5',
        isActive ? 'bg-primary text-black font-bold shadow-lg shadow-primary/20' : 'text-zinc-400 hover:text-white',
        isCollapsed && 'justify-center px-0'
      )
    }
    title={isCollapsed ? label : ''}
  >
    <Icon className={cn("h-5 w-5 shrink-0", isActive => isActive ? "scale-110" : "")} />
    {!isCollapsed && <span className="truncate font-bold uppercase tracking-tight text-xs">{label}</span>}
  </NavLink>
);

export function AdminLayout({ title, children }: { title?: string, children?: React.ReactNode }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleNavClick = () => {
    setIsSheetOpen(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-[#050505]">
      {/* Sidebar para Desktop */}
      <aside 
        className={cn(
          "hidden md:flex flex-col border-r border-white/5 bg-zinc-950/50 backdrop-blur-xl transition-all duration-300 ease-in-out relative",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className={cn("p-6 flex items-center transition-all", isCollapsed ? "justify-center" : "justify-between")}>
          {!isCollapsed && (
            <h2 className="text-2xl font-black italic uppercase text-primary tracking-tighter">
              Admin
            </h2>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 rounded-lg border border-white/10 bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex flex-col gap-2 px-3">
          {navItems.map((item) => (
            <AdminNavLink 
              key={item.href} 
              href={item.href} 
              label={item.label} 
              Icon={item.icon} 
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>

        <div className="mt-auto p-3 border-t border-white/5">
          <AdminNavLink 
            href="/" 
            label="Volver al menú" 
            Icon={Home} 
            isCollapsed={isCollapsed} 
          />
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Header para Mobile (con botón de menú) o Título para Desktop */}
        <header className="flex items-center justify-between border-b border-white/5 p-4 bg-zinc-950/20 backdrop-blur">
          <div className="flex items-center gap-4">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="text-zinc-400">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-4 bg-zinc-950 border-r border-white/10 text-white">
                <h2 className="mb-6 text-2xl font-black italic uppercase text-primary">Admin</h2>
                <nav className="flex flex-col gap-2">
                  {navItems.map((item) => (
                    <AdminNavLink key={item.href} href={item.href} label={item.label} Icon={item.icon} onClick={handleNavClick} />
                  ))}
                </nav>
                <div className="mt-auto pt-4 border-t border-white/10">
                  <AdminNavLink href="/" label="Volver al menú" Icon={Home} onClick={handleNavClick} />
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-xl font-black italic uppercase text-white tracking-tight">{title || 'Panel de Control'}</h1>
          </div>
          
          <div className="flex items-center gap-2">
             <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
             <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Sistema Activo</span>
          </div>
        </header>
        
        <div className="flex-1 overflow-auto">
          {children || <Outlet />}
        </div>
      </main>
    </div>
  );
}

export default AdminLayout;