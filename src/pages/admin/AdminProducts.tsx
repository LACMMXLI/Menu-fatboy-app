import { useProducts, useDeleteProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'; // Importar Tabs
import { AdminProductDialog } from '@/components/admin/AdminProductDialog';
import { DeleteConfirmationDialog } from '@/components/admin/DeleteConfirmationDialog';
import { Loader2, Plus, Edit } from 'lucide-react'; // Añadir iconos
import { useMemo, useState } from 'react'; // Añadir hooks

export default function AdminProducts() {
  const { data: products, isLoading: isLoadingProducts, isError: isErrorProducts } = useProducts();
  const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories } = useCategories();
  const deleteMutation = useDeleteProduct();
  const [activeTab, setActiveTab] = useState<string>('all');

  // Ordenar categorías por su campo 'order'
  const sortedCategories = useMemo(() => {
    return categories?.sort((a, b) => a.order - b.order) || [];
  }, [categories]);

  // Filtrar productos por la categoría seleccionada (solo productos que no son promociones)
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    let baseProducts = products.filter(p => !p.isPromotion);
    
    if (activeTab === 'all') return baseProducts.sort((a, b) => a.order - b.order);
    return baseProducts
      .filter(p => p.categoryId === activeTab)
      .sort((a, b) => a.order - b.order);
  }, [products, activeTab]);

  const handleDelete = (productId: string, productName: string) => {
    deleteMutation.mutate(productId);
  };

  if (isLoadingProducts || isLoadingCategories) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
  }

  if (isErrorProducts || isErrorCategories || !products || !categories) {
    return <div className="text-center text-destructive bg-destructive/10 p-4 rounded-lg">Error al cargar los datos de productos y categorías.</div>;
  }

  return (
    <div className="space-y-6 animate-fade-up">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-2xl font-black italic uppercase text-white tracking-tight">
          Gestión de <span className="text-primary">Productos</span>
        </h1>
        <AdminProductDialog>
          <Button className="btn-modern text-black font-bold uppercase italic">
            <Plus className="mr-2 h-4 w-4" /> Añadir Producto
          </Button>
        </AdminProductDialog>
      </div>

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between mb-4 overflow-x-auto pb-2 scrollbar-none">
          <TabsList className="bg-card border border-white/5 h-12 p-1">
            <TabsTrigger value="all" className="uppercase font-bold text-xs italic px-6 data-[state=active]:bg-primary data-[state=active]:text-black">
              Todos
            </TabsTrigger>
            {sortedCategories.map(cat => (
              <TabsTrigger 
                key={cat.id} 
                value={cat.id}
                className="uppercase font-bold text-xs italic px-6 data-[state=active]:bg-primary data-[state=active]:text-black"
              >
                {cat.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-0">
          <div className="rounded-xl border border-white/10 bg-card overflow-hidden shadow-2xl">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="hover:bg-transparent border-white/10">
                  <TableHead className="text-white uppercase font-black italic text-xs tracking-widest">Nombre</TableHead>
                  <TableHead className="text-white uppercase font-black italic text-xs tracking-widest">Orden</TableHead>
                  <TableHead className="text-white uppercase font-black italic text-xs tracking-widest">Precio</TableHead>
                  <TableHead className="text-white uppercase font-black italic text-xs tracking-widest">Estado</TableHead>
                  <TableHead className="text-right text-white uppercase font-black italic text-xs tracking-widest">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground italic">
                      No hay productos en esta categoría.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id} className="hover:bg-white/5 border-white/5 transition-colors group">
                      <TableCell className="font-bold text-white group-hover:text-primary transition-colors">
                        {product.name}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-white/20 text-xs font-mono">#{product.order}</Badge>
                      </TableCell>
                      <TableCell className="font-bold text-white">${product.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge 
                          className={product.status === 'active' 
                            ? 'bg-green-500/20 text-green-500 hover:bg-green-500/30' 
                            : 'bg-red-500/20 text-red-500 hover:bg-red-500/30'}
                        >
                          {product.status === 'active' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                          <AdminProductDialog product={product}>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/20 hover:text-primary">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </AdminProductDialog>
                          <DeleteConfirmationDialog
                            title={`¿Eliminar ${product.name}?`}
                            description="Esta acción borrará el producto permanentemente del menú."
                            onConfirm={() => handleDelete(product.id, product.name)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}