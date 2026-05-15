import { useParams } from 'react-router-dom';
import { useOrders, useUpdateOrderStatus, useClearOrderHistory } from '@/hooks/useOrders';
import { useBranches } from '@/hooks/useBranches';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Printer, CheckCircle, XCircle, Clock, Smartphone, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

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
  const clearHistory = useClearOrderHistory();
  const [activeTab, setActiveTab] = useState<'active' | 'finished'>('active');
  const [isClearing, setIsClearing] = useState(false);

  const activeOrders = orders?.filter(o => o.status === 'nuevo' || o.status === 'impreso') || [];
  const finishedOrders = orders?.filter(o => o.status === 'finalizado' || o.status === 'cancelado') || [];

  const handleClearHistory = async () => {
    if (!currentBranch) return;
    if (!window.confirm("¿Estás seguro de limpiar todo el historial de esta sucursal? (Pedidos finalizados y cancelados)")) return;

    setIsClearing(true);
    try {
      await clearHistory.mutateAsync(currentBranch.id);
      toast.success("Historial limpiado correctamente");
    } catch (error) {
      toast.error("Error al limpiar historial");
    } finally {
      setIsClearing(false);
    }
  };

  const handlePrint = (order: any) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const productionItemsHtml = order.items?.map((item: any) => `
      <div style="border-bottom: 1px dashed #000; padding: 4px 0; font-size: 18px;">
        <span style="font-weight: bold;">${item.quantity}x ${item.name}</span>
        ${item.notes ? `<div style="font-size: 14px; font-style: italic; margin-left: 10px;">* ${item.notes}</div>` : ''}
      </div>
    `).join('');

    const customerItemsHtml = order.items?.map((item: any) => `
      <div style="display: flex; justify-content: space-between; border-bottom: 1px dashed #ccc; padding: 5px 0;">
        <span>${item.quantity}x ${item.name}</span>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Pedido #${order.id.slice(0, 8)}</title>
          <style>
            body { font-family: 'Courier New', Courier, monospace; width: 80mm; margin: 0; padding: 0; color: black; }
            .ticket { padding: 10px; page-break-after: always; }
            .header { text-align: center; border-bottom: 2px solid black; padding-bottom: 10px; margin-bottom: 10px; }
            .section { margin-bottom: 10px; }
            .total { font-weight: bold; font-size: 18px; text-align: right; border-top: 2px solid black; padding-top: 10px; }
            .kitchen-label { text-align: center; font-size: 24px; font-weight: bold; border: 2px solid black; margin-bottom: 10px; }
            @media print { body { width: 80mm; } }
          </style>
        </head>
        <body>
          <!-- TICKET DE PRODUCCIÓN (COCINA) -->
          <div class="ticket">
            <div class="kitchen-label">COCINA</div>
            <div class="header">
              <h2 style="margin: 0;">ORDEN #${order.id.slice(0, 8)}</h2>
              <p style="margin: 5px 0;">${currentBranch?.name}</p>
              <p style="margin: 5px 0;">${format(new Date(order.created_at), 'Pp', { locale: es })}</p>
            </div>
            <div class="section">
              <strong>CLIENTE:</strong> ${order.customer_name}<br>
            </div>
            <div class="section">
              <strong>DETALLE:</strong><br>
              ${productionItemsHtml}
            </div>
            ${order.notes ? `<div class="section" style="border: 1px solid black; padding: 5px;"><strong>NOTAS GENERALES:</strong><br>${order.notes}</div>` : ''}
          </div>

          <!-- TICKET DE CLIENTE -->
          <div class="ticket" style="page-break-after: auto;">
            <div class="header">
              <h2 style="margin: 0;">FATBOY BURGERS</h2>
              <p style="margin: 5px 0;">Sucursal ${currentBranch?.name}</p>
              <p style="margin: 5px 0;">${format(new Date(order.created_at), 'Pp', { locale: es })}</p>
              <p style="margin: 5px 0; font-size: 12px;">Pedido #${order.id.slice(0, 8)}</p>
            </div>
            <div class="section">
              <strong>CLIENTE:</strong> ${order.customer_name}<br>
              ${order.customer_phone ? `<strong>TEL:</strong> ${order.customer_phone}<br>` : ''}
              <strong>PAGO:</strong> ${order.payment_method.toUpperCase()}
            </div>
            <div class="section">
              <strong>RESUMEN:</strong><br>
              ${customerItemsHtml}
            </div>
            <div class="total">
              TOTAL: $${order.total.toFixed(2)}
            </div>
            <p style="text-align: center; margin-top: 20px;">¡Gracias por tu preferencia!</p>
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() { window.close(); };
            }
          </script>
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
        
        <div className="flex bg-zinc-900 rounded-xl p-1 border border-white/5 items-center gap-1">
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
          
          <div className="h-6 w-[1px] bg-white/10 mx-1" />

          <Button 
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg h-9 w-9"
            onClick={handleClearHistory}
            disabled={isClearing || finishedOrders.length === 0}
            title="Limpiar Historial"
          >
            <Trash2 className="h-4 w-4" />
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
