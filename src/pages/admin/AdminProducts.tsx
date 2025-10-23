import { useProducts, useDeleteProduct } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AdminProductDialog } from '@/components/admin/AdminProductDialog';
import { DeleteConfirmationDialog } from '@/components/admin/DeleteConfirmationDialog';
import { Loader2 } from 'lucide-react';

export default function AdminProducts() {
  const { data: products, isLoading: isLoadingProducts, isError: isErrorProducts } = useProducts();
  const { data: categories, isLoading: isLoadingCategories, isError: isErrorCategories } = useCategories();
  const deleteMutation = useDeleteProduct();

  const getCategoryName = (categoryId: string) => {
    return categories?.find(c => c.id === categoryId)?.name || 'N/A';
  }

  const handleDelete = (productId: string, productName: string) => {
    deleteMutation.mutate(productId);
  };

  if (isLoadingProducts || isLoadingCategories) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (isErrorProducts || isErrorCategories || !products || !categories) {
    return <div className="text-center text-destructive">Error al cargar los datos.</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Productos</CardTitle>
        <AdminProductDialog>
          <Button>Añadir Producto</Button>
        </AdminProductDialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                <TableCell>${product.price.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={product.status === 'active' ? 'default' : 'destructive'}>
                    {product.status === 'active' ? 'Activo' : 'Inactivo'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right flex justify-end space-x-2">
                  <AdminProductDialog product={product}>
                    <Button variant="outline" size="sm">Editar</Button>
                  </AdminProductDialog>
                  <DeleteConfirmationDialog
                    title={`¿Estás seguro de eliminar ${product.name}?`}
                    description="Esta acción no se puede deshacer."
                    onConfirm={() => handleDelete(product.id, product.name)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}