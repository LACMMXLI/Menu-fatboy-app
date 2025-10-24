import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { Category } from '@/lib/types';

interface CategoryNavigationProps {
  categories: Category[];
  activeCategoryId: string | null;
  onSelectCategory: (id: string) => void;
}

export function CategoryNavigation({ categories, activeCategoryId, onSelectCategory }: CategoryNavigationProps) {
  return (
    <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-sm border-b border-gray-800 py-2">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 px-4">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              size="sm"
              onClick={() => onSelectCategory(category.id)}
              className={cn(
                'flex-shrink-0 text-sm font-medium transition-colors',
                activeCategoryId === category.id
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'text-muted-foreground hover:bg-muted/50'
              )}
            >
              {category.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="h-1.5" />
      </ScrollArea>
    </div>
  );
}