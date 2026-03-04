import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCartStore } from '@/hooks/useCartStore';
import { useBranchStore } from '@/hooks/useBranchStore';
import { useBranches } from '@/hooks/useBranches';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QuantityControl } from '@/components/QuantityControl';
import { buildWhatsAppLink } from '@/utils/whatsapp';
import { showError } from '@/utils/toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const customerDetailsSchema = z.object({
  customerName: z.string().min(2, 'El nombre es obligatorio.'),
  customerPhone: z.string().regex(/^\d{10,15}$/, 'El teléfono debe tener entre 10 y 15 dígitos.'),
  branchId: z.string().min(1, 'Debes seleccionar una sucursal.'),
  deliveryMethod: z.enum(['pickup', 'delivery']),
  paymentMethod: z.enum(['cash', 'card']),
  address: z.string().optional(),
  reference: z.string().optional(),
}).refine((data) => {
  if (data.deliveryMethod === 'delivery' && (!data.address || data.address.length < 5)) {
    return false;
  }
  return true;
}, {
  message: "La dirección es obligatoria para pedidos a domicilio.",
  path: ["address"],
});

type CustomerDetailsForm = z.infer<typeof customerDetailsSchema>;

const DELIVERY_FEE = 50;

export default function CartPage() {
  const navigate = useNavigate();
  const { 
    items, 
    customerName, 
    customerPhone, 
    deliveryMethod,
    paymentMethod,
    address,
    reference,
    addItem, 
    removeItem, 
    subtotal, 
    setCustomerDetails, 
    clearCart 
  } = useCartStore();
  const { selectedBranch, selectBranch } = useBranchStore();
  const { data: branches, isLoading: isLoadingBranches } = useBranches();

  const form = useForm<CustomerDetailsForm>({
    resolver: zodResolver(customerDetailsSchema),
    defaultValues: {
      customerName: customerName,
      customerPhone: customerPhone,
      branchId: selectedBranch?.id || '',
      deliveryMethod: deliveryMethod || 'pickup',
      paymentMethod: paymentMethod || 'cash',
      address: address || '',
      reference: reference || '',
    },
    mode: 'onBlur',
  });

  const currentBranch = branches?.find(b => b.id === form.watch('branchId')) || null;
  const watchDeliveryMethod = form.watch('deliveryMethod');

  const onSubmit = (values: CustomerDetailsForm) => {
    const branch = branches?.find(b => b.id === values.branchId);
    
    if (!branch) {
      showError("Error: Sucursal no válida.");
      return;
    }
    if (items.length === 0) {
      showError("Tu carrito está vacío.");
      return;
    }

    // 1. Guardar detalles y sucursal seleccionada en el store
    const details = { 
      customerName: values.customerName, 
      customerPhone: values.customerPhone,
      deliveryMethod: values.deliveryMethod,
      paymentMethod: values.paymentMethod,
      address: values.address,
      reference: values.reference
    };
    setCustomerDetails(details);
    selectBranch(branch);

    // 2. Abrir WhatsApp
    const url = buildWhatsAppLink(
      branch,
      items,
      details as any,
      subtotal()
    );
    window.open(url, '_blank');

    // 3. Limpiar carrito y redirigir
    clearCart();
    navigate('/confirmation');
  };

  // Sincronizar el store con el formulario si el usuario navega
  form.watch((data) => {
    setCustomerDetails({
      customerName: data.customerName || '',
      customerPhone: data.customerPhone || '',
      deliveryMethod: (data.deliveryMethod as 'pickup' | 'delivery') || 'pickup',
      paymentMethod: (data.paymentMethod as 'cash' | 'card') || 'cash',
      address: data.address || '',
      reference: data.reference || '',
    });

    if (data.branchId && data.branchId !== selectedBranch?.id && branches) {
      const branch = branches.find(b => b.id === data.branchId);
      if (branch) {
        selectBranch(branch);
      }
    }
  });

  if (isLoadingBranches) {
    return <div className="mx-auto max-w-md p-4 text-center pt-20"><Loader2 className="h-8 w-8 animate-spin mx-auto" /> <p className="mt-2">Cargando sucursales...</p></div>;
  }

  return (
    <div className="mx-auto max-w-md p-4 animate-fade-up">
      <header className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">
          Tu <span className="text-primary">Pedido</span>
        </h1>
        <div className="bg-primary/20 px-3 py-1 rounded-full border border-primary/30">
          <span className="text-xs font-bold text-primary uppercase">{items.length} {items.length === 1 ? 'Producto' : 'Productos'}</span>
        </div>
      </header>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-white/10">
          <p className="text-muted-foreground mb-4 font-medium italic">¿Aún no has elegido nada delicioso?</p>
          <Button onClick={() => navigate('/')} variant="outline" className="rounded-full border-primary text-primary hover:bg-primary/10">
            Ir al Menú
          </Button>
        </div>
      ) : (
        <>
          {currentBranch && (
            <Card className="mb-6 overflow-hidden border-none bg-gradient-to-r from-primary/20 to-transparent backdrop-blur-sm">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="bg-primary p-2 rounded-lg text-black">
                  {watchDeliveryMethod === 'delivery' ? '🛵' : '🏠'}
                </div>
                <div>
                  <p className="text-xs uppercase font-black text-primary/80 tracking-widest">Método de entrega</p>
                  <p className="text-sm font-bold text-white leading-tight">
                    {watchDeliveryMethod === 'delivery' 
                      ? "Envío a domicilio (+$50.00)" 
                      : `Recogerás en ${currentBranch.name}`}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3 mb-8">
            <h2 className="text-xs uppercase font-black text-white/40 tracking-widest px-1">Resumen de productos</h2>
            {items.map(item => (
              <div key={item.id} className="group flex items-center justify-between p-3 bg-card/50 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
                <div className="flex-1 pr-4">
                  <h3 className="font-bold text-white group-hover:text-primary transition-colors leading-tight">{item.name}</h3>
                  <p className="text-xs text-muted-foreground font-semibold">
                    ${item.price.toFixed(2)} c/u
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-sm text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  <div className="scale-90 opacity-80 group-hover:opacity-100 transition-opacity">
                    <QuantityControl
                      quantity={item.quantity}
                      onAdd={() => addItem(item)}
                      onRemove={() => removeItem(item.id)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-card p-6 rounded-3xl border border-white/5 shadow-2xl">
              <div className="space-y-4">
                <h2 className="text-lg font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full block"></span>
                  Configuración
                </h2>
                
                <FormField
                  control={form.control}
                  name="branchId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Sucursal cercana</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 bg-black/40 border-white/10 rounded-xl focus:ring-primary/50">
                            <SelectValue placeholder="Selecciona una sucursal" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="bg-[#111] border-white/10">
                          {branches?.map(branch => (
                            <SelectItem key={branch.id} value={branch.id} className="focus:bg-primary/20 focus:text-white">
                              {branch.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="deliveryMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Tipo de pedido</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-2"
                        >
                          <div className="flex-1">
                            <RadioGroupItem value="pickup" id="pickup" className="sr-only" />
                            <Label 
                              htmlFor="pickup" 
                              className={`flex h-12 flex-col items-center justify-center rounded-xl border-2 transition-all cursor-pointer ${field.value === 'pickup' ? 'border-primary bg-primary/10 text-white shadow-[0_0_15px_rgba(255,191,0,0.25)]' : 'border-white/5 bg-black/20 text-muted-foreground hover:bg-white/5'}`}
                            >
                              <span className="text-sm font-bold">Para recoger</span>
                            </Label>
                          </div>
                          <div className="flex-1">
                            <RadioGroupItem value="delivery" id="delivery" className="sr-only" />
                            <Label 
                              htmlFor="delivery" 
                              className={`flex h-12 flex-col items-center justify-center rounded-xl border-2 transition-all cursor-pointer ${field.value === 'delivery' ? 'border-primary bg-primary/10 text-white shadow-[0_0_15px_rgba(255,191,0,0.25)]' : 'border-white/5 bg-black/20 text-muted-foreground hover:bg-white/5'}`}
                            >
                              <span className="text-sm font-bold">A domicilio</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Método de pago</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-2"
                        >
                          <div className="flex-1">
                            <RadioGroupItem value="cash" id="cash" className="sr-only" />
                            <Label 
                              htmlFor="cash" 
                              className={`flex h-12 flex-col items-center justify-center rounded-xl border-2 transition-all cursor-pointer ${field.value === 'cash' ? 'border-primary bg-primary/10 text-white shadow-[0_0_15px_rgba(255,191,0,0.25)]' : 'border-white/5 bg-black/20 text-muted-foreground hover:bg-white/5'}`}
                            >
                              <span className="text-sm font-bold">💵 Efectivo</span>
                            </Label>
                          </div>
                          <div className="flex-1">
                            <RadioGroupItem value="card" id="card" className="sr-only" />
                            <Label 
                              htmlFor="card" 
                              className={`flex h-12 flex-col items-center justify-center rounded-xl border-2 transition-all cursor-pointer ${field.value === 'card' ? 'border-primary bg-primary/10 text-white shadow-[0_0_15px_rgba(255,191,0,0.25)]' : 'border-white/5 bg-black/20 text-muted-foreground hover:bg-white/5'}`}
                            >
                              <span className="text-sm font-bold">💳 Tarjeta</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <h2 className="text-lg font-black text-white uppercase italic tracking-tighter flex items-center gap-2">
                  <span className="w-1.5 h-6 bg-primary rounded-full block"></span>
                  Tus Datos
                </h2>
                
                {watchDeliveryMethod === 'delivery' && (
                  <>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Dirección Completa</FormLabel>
                          <FormControl>
                            <Textarea 
                              className="bg-black/40 border-white/10 rounded-xl focus:ring-primary/50 min-h-[80px]"
                              placeholder="Calle, número, colonia..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="reference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Referencias</FormLabel>
                          <FormControl>
                            <Input 
                              className="h-12 bg-black/40 border-white/10 rounded-xl focus:ring-primary/50"
                              placeholder="Casa color azul, frente al parque..." 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Nombre Completo</FormLabel>
                      <FormControl>
                        <Input 
                          className="h-12 bg-black/40 border-white/10 rounded-xl focus:ring-primary/50"
                          placeholder="Como aparecerá en el pedido" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Teléfono de contacto</FormLabel>
                      <FormControl>
                        <Input 
                          className="h-12 bg-black/40 border-white/10 rounded-xl focus:ring-primary/50"
                          type="tel" 
                          placeholder="Ej: 6861234567" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="pt-6 border-t border-white/5 space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground px-1 font-semibold italic">
                  <span>Subtotal:</span>
                  <span>${subtotal().toFixed(2)}</span>
                </div>
                {watchDeliveryMethod === 'delivery' && (
                  <div className="flex justify-between text-sm text-primary px-1 font-bold italic">
                    <span>Cuota de envío:</span>
                    <span>$50.00</span>
                  </div>
                )}
                <div className="flex justify-between items-end pt-2 px-1">
                  <span className="text-xl font-black text-white italic uppercase tracking-tighter">Total Final:</span>
                  <span className="text-3xl font-black text-primary tracking-tight">
                    ${(subtotal() + (watchDeliveryMethod === 'delivery' ? DELIVERY_FEE : 0)).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <Button type="submit" className="btn-modern w-full py-8 text-xl text-black rounded-2xl shadow-xl hover:shadow-primary/30 active:scale-95 uppercase font-black italic">
                Enviar por WhatsApp 🚀
              </Button>
            </form>
          </Form>
        </>
      )}
    </div>
  );
}