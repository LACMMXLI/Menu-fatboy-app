import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Lock } from 'lucide-react';
import { showError } from '@/utils/toast';

export default function AdminLogin() {
  const [pin, setPin] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/admin/pedidos/venecia";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // PIN simple para demostración/protección básica
    if (pin === '1234') {
      localStorage.setItem('admin_auth', 'true');
      navigate(from, { replace: true });
    } else {
      showError('PIN incorrecto');
      setPin('');
    }
  };

  return (
    <div className="min-h-screen bg-[#090704] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffcc3310,transparent_50%)]" />
      
      <Card className="w-full max-w-md bg-zinc-900 border-white/10 shadow-2xl relative z-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
        <CardHeader className="text-center pt-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 border border-primary/20">
            <Lock className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-3xl font-black italic uppercase tracking-tighter text-white">
            Acceso <span className="text-primary">Admin</span>
          </CardTitle>
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-2">
            Ingresa el PIN de seguridad
          </p>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              <Input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="h-16 text-center text-3xl tracking-[1em] font-black bg-black/40 border-white/10 rounded-2xl focus:ring-primary/50 focus:border-primary/50"
                maxLength={4}
                autoFocus
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-14 bg-primary text-black text-lg font-black uppercase italic rounded-2xl hover:bg-primary/90 active:scale-[0.98] transition-all"
            >
              Entrar al Panel 🚀
            </Button>
          </form>
          
          <p className="text-center text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] mt-8">
            Fatboy Burgers Order System v1.0
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
