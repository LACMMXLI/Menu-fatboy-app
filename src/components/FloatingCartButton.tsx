import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/hooks/useCartStore';
import { Button } from '@/components/ui/button';

export function FloatingCartButton() {
  const navigate = useNavigate();
  const totalItems = useCartStore((state) => state.totalItems());
  const subtotal = useCartStore((state) => state.subtotal());

  if (totalItems === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-0 right-0 z-10 flex justify-center">
      <Button
        onClick={() => navigate('/cart')}
        className="w-11/12 max-w-xs rounded-full py-6 shadow-lg transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="flex w-full items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <span className="font-bold">{totalItems} {totalItems === 1 ? 'Artículo' : 'Artículos'}</span>
          </div>
          <span className="text-lg font-extrabold">${subtotal.toFixed(2)}</span>
        </div>
      </Button>
    </div>
  );
}