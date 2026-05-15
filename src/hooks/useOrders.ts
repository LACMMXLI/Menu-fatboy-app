import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Order, OrderItem } from '@/lib/types';
import { toast } from 'sonner';

const fetchOrders = async (branchId: string): Promise<Order[]> => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*)
    `)
    .eq('branch_id', branchId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as Order[];
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

    const channel = supabase
      .channel(`orders-branch-${branchId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `branch_id=eq.${branchId}`,
        },
        (payload) => {
          console.log('Order Change:', payload);
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
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'order_items',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['orders', branchId] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
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

    const { error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId);

    if (error) {
      toast.error('Error al actualizar el pedido');
      throw error;
    }

    queryClient.invalidateQueries({ queryKey: ['orders', branchId] });
  };
};

export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return async (order: Omit<Order, 'id' | 'created_at' | 'status' | 'items'>, items: Omit<OrderItem, 'id' | 'order_id'>[]) => {
    // 1. Insert order
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([order])
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Insert order items
    const itemsWithOrderId = items.map(item => ({
      ...item,
      order_id: orderData.id
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(itemsWithOrderId);

    if (itemsError) throw itemsError;

    queryClient.invalidateQueries({ queryKey: ['orders', order.branch_id] });
    return orderData;
  };
};

export const useClearOrderHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (branchId: string) => {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('branch_id', branchId)
        .in('status', ['finalizado', 'cancelado']);

      if (error) {
        throw error;
      }
    },
    onSuccess: (_, branchId) => {
      queryClient.invalidateQueries({ queryKey: ['orders', branchId] });
    },
  });
};
