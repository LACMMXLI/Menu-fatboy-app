import { API_URL } from '@/lib/config';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

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
      const response = await fetch(`${API_URL}/api/reviews');
      if (!response.ok) throw new Error('Failed to fetch reviews');
      return response.json();
    },
  });
};

export const useDeleteReviews = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (type: 'all' | 'negative') => {
      const response = await fetch(`${API_URL}/api/reviews?type=${type}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete reviews');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
};
