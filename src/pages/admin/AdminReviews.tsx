import { useReviews, Review, useDeleteReviews } from "@/hooks/useReviews";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Star, MessageSquare, AlertCircle, Filter, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AdminReviews() {
  const { data: reviews, isLoading } = useReviews();
  const deleteReviews = useDeleteReviews();
  const [filter, setFilter] = useState<'all' | 'negative' | 'positive'>('all');
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredReviews = reviews?.filter(r => {
    if (filter === 'negative') return r.rating <= 2;
    if (filter === 'positive') return r.rating >= 4;
    return true;
  });

  const handleDelete = async (type: 'all' | 'negative') => {
    const confirmMsg = type === 'negative' 
      ? "¿Estás seguro de eliminar todas las reseñas negativas?" 
      : "¿Estás seguro de eliminar TODAS las reseñas?";
    
    if (!window.confirm(confirmMsg)) return;

    setIsDeleting(true);
    try {
      await deleteReviews.mutateAsync(type);
      toast.success("Reseñas eliminadas correctamente");
    } catch (error) {
      toast.error("Error al eliminar reseñas");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
            Feedback de <span className="text-primary">Clientes</span>
          </h1>
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">
            Gestiona las reseñas y sugerencias
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/5">
            <Button 
              variant={filter === 'all' ? 'default' : 'ghost'}
              size="sm"
              className={`rounded-lg px-4 ${filter === 'all' ? 'bg-primary text-black' : 'text-zinc-400'}`}
              onClick={() => setFilter('all')}
            >
              Todas
            </Button>
            <Button 
              variant={filter === 'negative' ? 'default' : 'ghost'}
              size="sm"
              className={`rounded-lg px-4 ${filter === 'negative' ? 'bg-red-500 text-white' : 'text-zinc-400'}`}
              onClick={() => setFilter('negative')}
            >
              <AlertCircle className="h-4 w-4 mr-2" />
              Negativas
            </Button>
            <Button 
              variant={filter === 'positive' ? 'default' : 'ghost'}
              size="sm"
              className={`rounded-lg px-4 ${filter === 'positive' ? 'bg-green-500 text-white' : 'text-zinc-400'}`}
              onClick={() => setFilter('positive')}
            >
              Positivas
            </Button>
          </div>

          <div className="flex gap-2 border-l border-white/10 pl-3">
             <Button 
              variant="destructive"
              size="sm"
              className="rounded-lg h-9 font-bold uppercase text-[10px] tracking-widest gap-2"
              onClick={() => handleDelete('negative')}
              disabled={isDeleting}
            >
              <Trash2 className="h-3 w-3" />
              Limpiar Negativas
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredReviews?.map((review) => (
          <Card key={review.id} className="bg-zinc-950 border-white/5 overflow-hidden group hover:border-white/10 transition-all">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className={cn(
                  "w-full md:w-48 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/5",
                  review.rating <= 2 ? "bg-red-500/5" : "bg-white/5"
                )}>
                  <div className="flex gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star 
                        key={s} 
                        className={cn(
                          "h-4 w-4",
                          s <= review.rating ? "fill-amber-500 text-amber-500" : "text-zinc-700"
                        )} 
                      />
                    ))}
                  </div>
                  <span className="text-2xl font-black text-white">{review.rating}/5</span>
                  <Badge variant="outline" className="mt-2 border-white/10 text-[10px] uppercase font-bold text-zinc-400">
                    {review.branch}
                  </Badge>
                </div>

                <div className="flex-1 p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-2">
                        {review.rating <= 2 && <AlertCircle className="h-5 w-5 text-red-500 animate-pulse" />}
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
                          {format(new Date(review.created_at), "PPP p", { locale: es })}
                        </span>
                      </div>
                      {review.priority === 'high' && (
                        <Badge className="bg-red-600 text-white animate-bounce">Urgente</Badge>
                      )}
                    </div>
                    
                    <p className="text-zinc-200 font-medium italic leading-relaxed">
                      "{review.comment || 'Sin comentario'}"
                    </p>
                  </div>

                  <div className="mt-6 flex items-center gap-4 border-t border-white/5 pt-4">
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Dispositivo:</span>
                    <span className="text-[10px] font-mono text-zinc-500 truncate max-w-[150px]">
                      {review.device_hash || 'Anon'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredReviews?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
            <MessageSquare className="h-16 w-16 mb-4 opacity-10" />
            <p className="text-xl font-black uppercase italic tracking-widest opacity-20">No hay reseñas para mostrar</p>
          </div>
        )}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
