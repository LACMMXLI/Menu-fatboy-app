import { CheckCircle, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function OrderConfirmation() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-md p-8 text-center min-h-screen flex flex-col justify-center items-center">
      <CheckCircle className="h-16 w-16 text-green-500 mb-6" />
      <h1 className="text-3xl font-bold mb-4">¡Pedido Enviado!</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Tu pedido ha sido generado y el mensaje de WhatsApp está listo.
      </p>
      
      <div className="bg-yellow-100 dark:bg-yellow-900/30 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800 mb-8">
        <div className="flex items-center justify-center space-x-2">
          <MessageSquare className="h-5 w-5 text-yellow-700 dark:text-yellow-300" />
          <p className="font-medium text-yellow-800 dark:text-yellow-200">
            Paso Importante:
          </p>
        </div>
        <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
          Por favor, **confirma el envío del mensaje** en la ventana de WhatsApp que se abrió para finalizar tu pedido.
        </p>
      </div>

      <Button onClick={() => navigate('/')} className="w-full">
        Volver al Menú
      </Button>
    </div>
  );
}