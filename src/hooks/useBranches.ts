import { API_URL } from '@/lib/config';
import { useQuery } from '@tanstack/react-query';
import type { Branch } from '@/lib/types';

const fetchBranches = async (): Promise<Branch[]> => {
  const response = await fetch(`${API_URL}/api/branches');
  if (!response.ok) throw new Error('Failed to fetch branches');
  const data = await response.json();
  
  return data.map((b: any) => ({
    ...b,
    id: String(b.id),
  })) as Branch[];
};

export const useBranches = () => {
  return useQuery<Branch[], Error>({
    queryKey: ['branches'],
    queryFn: fetchBranches,
  });
};