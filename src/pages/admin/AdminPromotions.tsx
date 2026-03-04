import { useMemo } from 'react';
import { useProducts, useUpdateProduct } from '@/hooks/useProducts';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Image as ImageIcon, Loader2 } from 'lucide-react';
import { AdminProductDialog } from '@/components/admin/AdminProductDialog';

export default function AdminPromotions() {
  const { data: products, isLoading } = useProducts();
  const updateMutation = useUpdateProduct();

  const promotions = useMemo(() => {
    return products?.filter(p => p.isPromotion).sort((a, b) => a.order - b.order) || [];
  }, [products]);

  const toggleStatus = (product: any) => {
    updateMutation.mutate({
      ...product,
      status: product.status === 'active' ? 'inactive' : 'active'
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 flex justify-between items-center">
        <p className="text-muted-foreground">Administra los banners y promociones que aparecen en el carrusel principal.</p>
        <AdminProductDialog isPromotionDefault={true}>
          <Button className="btn-modern text-black font-bold">
            <Plus className="mr-2 h-4 w-4" /> Nueva Promoción
          </Button>
        </AdminProductDialog>
      </div>

      <div className="rounded-xl border border-white/10 bg-card overflow-hidden">
        <Table>
          <TableHeader className="bg-white/5">
            <TableRow>
              <TableHead className="w-[100px]">Imagen</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Orden</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                  No hay promociones configuradas.
                </TableCell>
              </TableRow>
            ) : (
              promotions.map((promo) => (
                <TableRow key={promo.id} className="hover:bg-white/5 transition-colors">
                  <TableCell>
                    {promo.imageUrl ? (
                      <img 
                        src={promo.imageUrl} 
                        alt={promo.name} 
                        className="h-12 w-20 object-cover rounded shadow-sm border border-white/10"
                      />
                    ) : (
                      <div className="h-12 w-20 bg-muted rounded flex items-center justify-center">
                        <ImageIcon className="h-6 w-6 text-muted-foreground opacity-20" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-bold text-white">{promo.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-white/20">{promo.order}</Badge>
                  </TableCell>
                  <TableCell>
                    <button onClick={() => toggleStatus(promo)}>
                      <Badge 
                        variant={promo.status === 'active' ? 'default' : 'secondary'}
                        className={promo.status === 'active' ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' : ''}
                      >
                        {promo.status === 'active' ? 'Activa' : 'Inactiva'}
                      </Badge>
                    </button>
                  </TableCell>
                  <TableCell className="text-right">
                    <AdminProductDialog product={promo}>
                      <Button variant="ghost" size="icon" className="hover:text-primary hover:bg-primary/10">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </AdminProductDialog>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
