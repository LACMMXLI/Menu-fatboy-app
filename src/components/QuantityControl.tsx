import { Button } from '@/components/ui/button';
import { Minus, Plus } from 'lucide-react';

interface QuantityControlProps {
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

export function QuantityControl({ quantity, onAdd, onRemove }: QuantityControlProps) {
  if (quantity === 0) {
    return (
      <Button onClick={onAdd} size="sm" className="h-8 w-8 p-0">
        <Plus className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button onClick={onRemove} size="sm" variant="outline" className="h-8 w-8 p-0">
        <Minus className="h-4 w-4" />
      </Button>
      <span className="w-4 text-center font-medium">{quantity}</span>
      <Button onClick={onAdd} size="sm" className="h-8 w-8 p-0">
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}