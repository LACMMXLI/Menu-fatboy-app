import { API_URL } from '@/lib/config';
import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { io } from 'socket.io-client';
import type { Order, OrderItem } from '@/lib/types';
import { toast } from 'sonner';

const fetchOrders = async (branchId: string): Promise<Order[]> => {
  // Pass branchId if API filters by branch, for now API returns all or we can filter here
  // Ideally update server to accept ?branchId=${branchId}
  const response = await fetch(`${API_URL}/api/orders?branchId=${branchId}`);
  if (!response.ok) throw new Error('Failed to fetch orders');
  const data = await response.json();
  
  // Return orders filtered by branchId (temporary client-side filter until server filters)
  return data.filter((o: Order) => o.branch_id === branchId) as Order[];
};

export const useOrders = (branchId: string | undefined) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['orders', branchId],
    queryFn: () => fetchOrders(branchId!),
    enabled: !!branchId,
  });

  useEffect(() => {
    if (!branchId) return;

    // Conectar a Socket.io en el mismo dominio (o proxy local)
    const socket = io(API_URL || undefined);

    socket.on('connect', () => {
      socket.emit('join_orders');
    });

    socket.on('postgres_changes', (payload: any) => {
      // Filtrar si el pedido es de esta sucursal
      if (payload.new && payload.new.branch_id !== branchId) return;

      console.log('Order Change via Socket:', payload);
      queryClient.invalidateQueries({ queryKey: ['orders', branchId] });
      
      if (payload.eventType === 'INSERT') {
        const newOrder = payload.new as Order;
        toast.success(`¡Nuevo pedido de ${newOrder.customer_name}!`, {
          description: 'Llegó un nuevo pedido a la sucursal.',
          duration: 10000,
        });
        // Play sound notification
        const audio = new Audio('/notification.mp3');
        audio.play().catch(e => console.error("Error playing sound:", e));
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [branchId, queryClient]);

  return query;
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return async (orderId: string, status: Order['status'], branchId: string) => {
    const updateData: any = { status };
    
    if (status === 'impreso') updateData.printed_at = new Date().toISOString();
    if (status === 'finalizado') updateData.completed_at = new Date().toISOString();
    if (status === 'cancelado') updateData.cancelled_at = new Date().toISOString();

    const response = await fetch(`${API_URL}/api/orders/${orderId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData)
    });

    if (!response.ok) {
      toast.error('Error al actualizar el pedido');
      throw new Error('Error al actualizar el pedido');
    }

    queryClient.invalidateQueries({ queryKey: ['orders', branchId] });
  };
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return async (order: Omit<Order, 'id' | 'created_at' | 'status' | 'items'>, items: Omit<OrderItem, 'id' | 'order_id'>[]) => {
    // El backend creará la orden y sus items al mismo tiempo en /api/orders
    const payload = {
      ...order,
      items
    };

    const response = await fetch(`${API_URL}/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) throw new Error('Error al crear orden');

    const orderData = await response.json();

    queryClient.invalidateQueries({ queryKey: ['orders', order.branch_id] });
    return orderData;
  };
};

export const useClearOrderHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (branchId: string) => {
      // Necesitamos un endpoint en el backend para borrar historial, por ahora mockeado o implementar en index.ts
      const response = await fetch(`${API_URL}/api/orders/history?branchId=${branchId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Error clearing order history');
      }
    },
    onSuccess: (_, branchId) => {
      queryClient.invalidateQueries({ queryKey: ['orders', branchId] });
    },
  });
};
