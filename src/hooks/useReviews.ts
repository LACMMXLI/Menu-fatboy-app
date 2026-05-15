import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Review {
  id: string;
  branch: string;
  rating: number;
  comment: string;
  created_at: string;
  status: string;
  priority: string;
  source: string;
  device_hash?: string;
}

export const useReviews = () => {
  return useQuery<Review[], Error>({
    queryKey: ['reviews'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Review[];
    },
  });
};

export const useDeleteReviews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (type: 'all' | 'negative') => {
      let query = supabase.from('reviews').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      
      if (type === 'negative') {
        query = query.lte('rating', 2);
      }

      const { error } = await query;

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};
