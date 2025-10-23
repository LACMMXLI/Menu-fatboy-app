import { useNavigate } from 'react-router-dom';
import { useBranchStore } from '@/hooks/useBranchStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function BranchSelector() {
  const { branches, selectBranch } = useBranchStore();
  const navigate = useNavigate();

  const handleSelect = (branchId: string) => {
    selectBranch(branchId);
    navigate('/');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 dark:bg-black">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Elige una sucursal</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {branches.map((branch) => (
            <Button
              key={branch.id}
              onClick={() => handleSelect(branch.id)}
              className="w-full py-6 text-lg"
            >
              {branch.name}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}