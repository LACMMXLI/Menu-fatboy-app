import { useParams } from 'react-router-dom';
import { useOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { useBranches } from '@/hooks/useBranches';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Printer, CheckCircle, XCircle, Clock, Smartphone } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState, useEffect } from 'react';

const statusColors = {
  nuevo: 'bg-blue-500 hover:bg-blue-600',
  impreso: 'bg-purple-500 hover:bg-purple-600',
  finalizado: 'bg-green-500 hover:bg-green-600',
  cancelado: 'bg-red-500 hover:bg-red-600',
};

export default function OrderManagement() {
  const { branchName } = useParams();
  const { data: branches } = useBranches();
  const currentBranch = branches?.find(b => b.name.toLowerCase().replace(/\s+/g, '-') === branchName?.toLowerCase());
  
  const { data: orders, isLoading } = useOrders(currentBranch?.id);
  const updateStatus = useUpdateOrderStatus();
  const [activeTab, setActiveTab] = useState<'active' | 'finished'>('active');

  const activeOrders = orders?.filter(o => o.status === 'nuevo' || o.status === 'impreso') || [];
  const finishedOrders = orders?.filter(o => o.status === 'finalizado' || o.status === 'cancelado') || [];

  const handlePrint = (order: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const itemsHtml = order.items?.map((item: any) => `
      <div style="display: flex; justify-between: space-between; border-bottom: 1px dashed #ccc; padding: 5px 0;">
        <span>${item.quantity}x ${item.name}</span>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Pedido #${order.id.slice(0, 8)}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; width: 80mm; margin: 0; padding: 10px; font-size: 14px; }
            .header { text-align: center; border-bottom: 2px solid black; padding-bottom: 10px; margin-bottom: 10px; }
            .section { margin-bottom: 10px; }
            .total { font-weight: bold; font-size: 18px; text-align: right; border-top: 2px solid black; padding-top: 10px; }
            @media print { body { width: 100%; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="margin: 0;">FATBOY BURGERS</h2>
            <p style="margin: 5px 0;">Sucursal ${currentBranch?.name}</p>
            <p style="margin: 5px 0;">${format(new Date(order.created_at), 'Pp', { locale: es })}</p>
          </div>
          <div class="section">
            <strong>CLIENTE:</strong> ${order.customer_name}<br>
            <strong>TEL:</strong> ${order.customer_phone || 'N/A'}<br>
            <strong>PAGO:</strong> ${order.payment_method.toUpperCase()}
          </div>
          <div class="section">
            <strong>PEDIDO:</strong><br>
            ${itemsHtml}
          </div>
          <div class="total">
            TOTAL: $${order.total.toFixed(2)}
          </div>
          <p style="text-align: center; margin-top: 20px;">¡Gracias por tu compra!</p>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
    printWindow.document.close();

    if (order.status === 'nuevo') {
      updateStatus(order.id, 'impreso', currentBranch!.id);
    }
  };

  if (!currentBranch && !isLoading) {
    return <div className="p-8 text-center text-white">Sucursal no encontrada</div>;
  }

  return (
    <div className="min-h-screen bg-[#090704] p-4 md:p-8 text-white">
      <header className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-primary">
            Panel de Pedidos
          </h1>
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">
            Sucursal {currentBranch?.name}
          </p>
        </div>
        
        <div className="flex bg-zinc-900 rounded-xl p-1 border border-white/5">
          <Button 
            variant={activeTab === 'active' ? 'default' : 'ghost'}
            className={`rounded-lg px-6 ${activeTab === 'active' ? 'bg-primary text-black' : 'text-white'}`}
            onClick={() => setActiveTab('active')}
          >
            Activos ({activeOrders.length})
          </Button>
          <Button 
            variant={activeTab === 'finished' ? 'default' : 'ghost'}
            className={`rounded-lg px-6 ${activeTab === 'finished' ? 'bg-primary text-black' : 'text-white'}`}
            onClick={() => setActiveTab('finished')}
          >
            Historial
          </Button>
        </div>
      </header>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeTab === 'active' ? activeOrders : finishedOrders).map((order) => (
            <Card key={order.id} className="bg-zinc-900 border-white/10 overflow-hidden flex flex-col">
              <CardHeader className="pb-3 border-b border-white/5">
                <div className="flex justify-between items-start mb-2">
                  <Badge className={statusColors[order.status]}>
                    {order.status.toUpperCase()}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground font-mono">
                    #{order.id.slice(0, 8)}
                  </span>
                </div>
                <CardTitle className="text-xl font-black text-white flex items-center gap-2">
                  {order.customer_name}
                </CardTitle>
                <div className="flex items-center gap-4 mt-1">
                   <div className="flex items-center gap-1 text-xs text-muted-foreground font-semibold">
                    <Clock className="h-3 w-3" />
                    {format(new Date(order.created_at), 'p', { locale: es })}
                  </div>
                  {order.customer_phone && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground font-semibold">
                      <Smartphone className="h-3 w-3" />
                      {order.customer_phone}
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 py-4">
                <div className="space-y-2">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center text-sm font-bold">
                      <span className="text-white/80">
                        <span className="text-primary mr-2">{item.quantity}x</span>
                        {item.name}
                      </span>
                      <span className="text-white">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                {order.notes && (
                  <div className="mt-4 p-2 bg-black/40 rounded-lg text-xs italic text-zinc-400 border border-white/5">
                    <strong>Notas:</strong> {order.notes}
                  </div>
                )}
              </CardContent>

              <CardFooter className="bg-black/40 p-4 border-t border-white/5 flex flex-col gap-3">
                <div className="flex justify-between w-full items-center mb-1">
                  <span className="text-sm font-black uppercase text-zinc-500 italic tracking-tighter">Total Final:</span>
                  <span className="text-2xl font-black text-primary">$${order.total.toFixed(2)}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 w-full">
                  <Button 
                    variant="outline" 
                    className="border-primary/30 text-white hover:bg-primary/10 h-12 rounded-xl font-bold gap-2"
                    onClick={() => handlePrint(order)}
                  >
                    <Printer className="h-4 w-4" />
                    Imprimir
                  </Button>
                  
                  {activeTab === 'active' ? (
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white h-12 rounded-xl font-bold gap-2"
                      onClick={() => updateStatus(order.id, 'finalizado', currentBranch!.id)}
                    >
                      <CheckCircle className="h-4 w-4" />
                      Finalizar
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost"
                      className="text-muted-foreground hover:text-white h-12 rounded-xl font-bold"
                      disabled
                    >
                      Completado
                    </Button>
                  )}
                </div>
                
                {activeTab === 'active' && (
                  <Button 
                    variant="ghost"
                    className="w-full text-red-400 hover:text-red-500 hover:bg-red-500/10 h-10 rounded-xl font-bold gap-2 text-xs"
                    onClick={() => updateStatus(order.id, 'cancelado', currentBranch!.id)}
                  >
                    <XCircle className="h-3 w-3" />
                    Cancelar Pedido
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      
      {activeTab === 'active' && activeOrders.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center h-64 text-zinc-500">
          <Clock className="h-16 w-16 mb-4 opacity-20" />
          <p className="text-xl font-black italic uppercase tracking-widest opacity-30">No hay pedidos activos</p>
        </div>
      )}
    </div>
  );
}
