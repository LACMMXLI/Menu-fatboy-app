import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Branch } from '@/lib/types';

const fetchBranches = async (): Promise<Branch[]> => {
  const { data, error } = await supabase
    .from('branches')
    .select('id, name, phone');

  if (error) throw new Error(error.message);
  
  // Aseguramos que el ID sea string
  return data.map(b => ({
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