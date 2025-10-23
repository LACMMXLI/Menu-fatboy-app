import { useCategoryStore } from '@/hooks/useCategoryStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AdminCategoryDialog } from '@/components/admin/AdminCategoryDialog';

export default function AdminCategories() {
  const { categories } = useCategoryStore();
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

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
            {sortedCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.order}</TableCell>
                <TableCell className="font-medium">{category.name}</TableCell>
                <TableCell>
                  <Badge variant={category.status === 'active' ? 'default' : 'destructive'}>
                    {category.status === 'active' ? 'Activa' : 'Inactiva'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <AdminCategoryDialog category={category}>
                    <Button variant="outline" size="sm">Editar</Button>
                  </AdminCategoryDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}