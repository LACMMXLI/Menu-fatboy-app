import { useCategories, useDeleteCategory } from '@/hooks/useCategories';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AdminCategoryDialog } from '@/components/admin/AdminCategoryDialog';
import { DeleteConfirmationDialog } from '@/components/admin/DeleteConfirmationDialog';
import { Loader2 } from 'lucide-react';

export default function AdminCategories() {
  const { data: categories, isLoading, isError } = useCategories();
  const deleteMutation = useDeleteCategory();

  const handleDelete = (categoryId: string, categoryName: string) => {
    deleteMutation.mutate(categoryId);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (isError || !categories) {
    return <div className="text-center text-destructive">Error al cargar las categorías.</div>;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Categorías</CardTitle>
        <AdminCategoryDialog>
          <Button>Añadir Categoría</Button>
        </AdminCategoryDialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Orden</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.order}</TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  <Badge variant={category.status === 'active' ? 'default' : 'destructive'}>
                    {category.status === 'active' ? 'Activa' : 'Inactiva'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right flex justify-end space-x-2">
                  <AdminCategoryDialog category={category}>
                    <Button variant="outline" size="sm">Editar</Button>
                  </AdminCategoryDialog>
                  <DeleteConfirmationDialog
                    title={`¿Estás seguro de eliminar ${category.name}?`}
                    description="Esta acción no se puede deshacer. Se recomienda primero desactivar la categoría."
                    onConfirm={() => handleDelete(category.id, category.name)}
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