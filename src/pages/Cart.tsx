import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCartStore } from '@/hooks/useCartStore';
import { useBranchStore } from '@/hooks/useBranchStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QuantityControl } from '@/components/QuantityControl';
import { buildWhatsAppLink } from '@/utils/whatsapp';
import { showError } from '@/utils/toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';

const customerDetailsSchema = z.object({
  customerName: z.string().min(2, 'El nombre es obligatorio.'),
  customerPhone: z.string().regex(/^\d{10,15}$/, 'El teléfono debe tener entre 10 y 15 dígitos.'),
  branchId: z.string().min(1, 'Debes seleccionar una sucursal.'),
});

type CustomerDetailsForm = z.infer<typeof customerDetailsSchema>;

export default function CartPage() {
  const navigate = useNavigate();
  const { items, customerName, customerPhone, addItem, removeItem, subtotal, setCustomerDetails, clearCart } = useCartStore();
  const { branches, selectedBranch, selectBranch } = useBranchStore();

  const form = useForm<CustomerDetailsForm>({
    resolver: zodResolver(customerDetailsSchema),
    defaultValues: {
      customerName: customerName,
      customerPhone: customerPhone,
      branchId: selectedBranch?.id || '',
    },
    mode: 'onBlur',
  });

  const currentBranch = form.watch('branchId') ? branches.find(b => b.id === form.watch('branchId')) : null;

  const onSubmit = (values: CustomerDetailsForm) => {
    const branch = branches.find(b => b.id === values.branchId);
    
    if (!branch) {
      showError("Error: Sucursal no válida.");
      return;
    }
    if (items.length === 0) {
      showError("Tu carrito está vacío.");
      return;
    }

    // 1. Guardar detalles y sucursal seleccionada en el store
    setCustomerDetails({ customerName: values.customerName, customerPhone: values.customerPhone });
    selectBranch(values.branchId);

    // 2. Abrir WhatsApp
    const url = buildWhatsAppLink(
      branch,
      items,
      values.customerName,
      values.customerPhone,
      subtotal()
    );
    window.open(url, '_blank');

    // 3. Limpiar carrito y redirigir
    clearCart();
    navigate('/confirmation');
  };

  // Sincronizar el store con el formulario si el usuario navega
  form.watch((data) => {
    const currentName = data.customerName ?? '';
    const currentPhone = data.customerPhone ?? '';
    const currentBranchId = data.branchId;

    // Actualizar detalles del cliente en el store
    if (currentName !== customerName || currentPhone !== customerPhone) {
      setCustomerDetails({
        customerName: currentName,
        customerPhone: currentPhone,
      });
    }
    // Actualizar la sucursal seleccionada en el store
    if (currentBranchId && currentBranchId !== selectedBranch?.id) {
      selectBranch(currentBranchId);
    }
  });

  return (
    <div className="mx-auto max-w-md p-4">
      <h1 className="mb-4 text-2xl font-bold">Tu Pedido</h1>
      {items.length === 0 ? (
        <p className="text-center text-muted-foreground">El carrito está vacío.</p>
      ) : (
        <>
          {currentBranch && (
            <Card className="mb-4 bg-primary/10 dark:bg-primary/20 border-primary dark:border-primary/50">
              <CardContent className="p-3 text-center">
                <p className="text-sm font-medium text-primary dark:text-primary-foreground">
                  Recogerás en: <span className="font-bold">{currentBranch.name}</span>
                </p>
              </CardContent>
            </Card>
          )}

          <div className="divide-y dark:divide-gray-700">
            {items.map(item => (
              <div key={item.id} className="flex items-center justify-between py-3">
                <div className="flex-1 pr-4">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)} x {item.quantity} = ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <QuantityControl
                  quantity={item.quantity}
                  onAdd={() => addItem(item)}
                  onRemove={() => removeItem(item.id)}
                />
              </div>
            ))}
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6 space-y-4 border-t pt-6 dark:border-gray-700">
              <h2 className="text-xl font-semibold">Detalles del Pedido</h2>
              
              <FormField
                control={form.control}
                name="branchId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sucursal para recoger</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una sucursal" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {branches.map(branch => (
                          <SelectItem key={branch.id} value={branch.id}>
                            {branch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <h2 className="text-xl font-semibold pt-4">Datos de Contacto</h2>
              
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl><Input placeholder="Tu nombre completo" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="customerPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono (WhatsApp)</FormLabel>
                    <FormControl><Input type="tel" placeholder="Ej: 6861234567" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between text-lg font-bold pt-4">
                <span>Subtotal:</span>
                <span>${subtotal().toFixed(2)}</span>
              </div>
              
              <Button type="submit" className="w-full py-6 text-lg">
                Confirmar y Enviar por WhatsApp
              </Button>
            </form>
          </Form>
        </>
      )}
    </div>
  );
}