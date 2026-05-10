import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { generateDeviceHash } from "@/utils/hash";

const RATING_TEXT = {
  1: "Lo sentimos 😕",
  2: "Ayúdanos a mejorar",
  3: "Gracias por tu feedback",
  4: "¡Genial! ¿Nos dejas reseña en Google?",
  5: "¡Excelente! ¿Nos dejas reseña en Google?",
};

export default function FeedbackPage() {
  const { branch } = useParams<{ branch: string }>();
  const navigate = useNavigate();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  const normalizedBranch = branch?.toLowerCase();

  useEffect(() => {
    if (status === "success" && redirectUrl) {
      // Pequeño retraso para que el usuario vea el mensaje de éxito antes de ser redirigido
      const timer = setTimeout(() => {
        window.location.href = redirectUrl;
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [status, redirectUrl]);

  if (!normalizedBranch || (normalizedBranch !== "venecia" && normalizedBranch !== "sanmarcos")) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <p className="text-destructive mb-4">Sucursal no válida.</p>
        <Button onClick={() => navigate("/")}>Volver al inicio</Button>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (rating === 0) return;
    
    setStatus("loading");
    setErrorMessage("");

    try {
      const userAgent = navigator.userAgent;
      const deviceHash = await generateDeviceHash(userAgent);

      const { error } = await supabase
        .from("reviews")
        .insert({
          branch: normalizedBranch,
          rating,
          comment,
          device_hash: deviceHash,
          status: "pending",
          priority: rating <= 2 ? "high" : "normal",
          source: "web"
        });

      if (error) throw error;

      const googleUrl = normalizedBranch === "venecia" 
        ? "https://search.google.com/local/writereview?placeid=ChIJi0vnrExx14ARCFbYG3xvPqo" 
        : "https://search.google.com/local/writereview?placeid=ChIJ6zxiklN714ARVQ2BPf3W3Xc";

      if (rating >= 4) {
        setRedirectUrl(googleUrl);
      }
      
      setStatus("success");
    } catch (err: any) {
      setErrorMessage(err.message);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 4000);
    }
  };

  if (status === "success") {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100 via-slate-50 to-white">
        <div className="w-full max-w-sm flex flex-col items-center gap-4">
          <Card className="text-center py-12 animate-in fade-in zoom-in duration-300 w-full bg-white/90 backdrop-blur-3xl border-zinc-300/50 shadow-xl rounded-[32px]">
            <CardContent className="space-y-6">
              <div className="text-6xl">🙌</div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-black">
                  {rating >= 4 ? "¡Muchísimas gracias!" : "Gracias por tu opinión"}
                </h2>
                <p className="text-zinc-500">
                  {rating >= 4 
                    ? "Si puedes, déjanos tu reseña en Google para que más gente nos conozca ⭐"
                    : "Tu feedback es muy valioso. Lo revisaremos hoy mismo para mejorar nuestro servicio."}
                </p>
              </div>
              {rating >= 4 && redirectUrl && (
                <Button 
                  className="w-full h-14 text-lg bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-wider rounded-2xl shadow-xl transition-all" 
                  onClick={() => window.location.href = redirectUrl}
                >
                  Abrir Google Reviews
                </Button>
              )}
              <Button variant="outline" className="mt-4" onClick={() => navigate("/")}>
                Volver al inicio
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 py-8 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-100 via-slate-50 to-white">
      <div className="w-full max-w-sm flex flex-col items-center gap-4">
        <header className="flex flex-col items-center">
          <img 
            src="/logo.png" 
            alt="FATBOY Logo" 
            className="h-[100px] md:h-[125px] w-auto object-contain"
          />
          <span className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] -mt-2 opacity-60">
            Sucursal {normalizedBranch === "venecia" ? "Venecia" : "San Marcos"}
          </span>
        </header>

        <Card className="relative overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] border-zinc-300/50 bg-white/90 backdrop-blur-3xl ring-1 ring-black/10 rounded-[32px] w-full">
          <CardHeader className="text-center p-3 pb-1 relative z-10">
            <div className="bg-zinc-900 w-fit mx-auto px-3 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest text-zinc-100 mb-1 shadow-md">
              Feedback
            </div>
            <CardTitle className="text-xl font-black tracking-tight text-black leading-tight">
              ¿Cómo fue tu visita?
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-4 pt-1 space-y-4 relative z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="flex gap-1 sm:gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`text-4xl sm:text-5xl transition-all duration-300 transform active:scale-75 ${
                      rating >= star 
                        ? "text-amber-500 scale-105 drop-shadow-[0_0_12px_rgba(245,158,11,0.6)]" 
                        : "text-zinc-200 hover:text-zinc-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <div className="h-4">
                {rating > 0 && (
                  <p className="text-[10px] font-black text-black bg-zinc-100 px-3 py-1 rounded-full uppercase tracking-widest animate-in slide-in-from-top-1 duration-300">
                    {RATING_TEXT[rating as keyof typeof RATING_TEXT]}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <div className="relative">
                <Textarea
                  placeholder="¿Qué podríamos mejorar? (opcional)"
                  value={comment}
                  onChange={(e) => setComment(e.target.value.slice(0, 500))}
                  className="resize-none min-h-[90px] border-zinc-200 bg-white p-4 text-sm rounded-[20px] shadow-sm placeholder:text-zinc-400 text-black font-medium focus:ring-2 focus:ring-black/5"
                />
              </div>

              {status === "error" && (
                <div className="bg-red-50 text-red-700 p-3 rounded-xl text-[10px] font-black text-center border border-red-100">
                  {errorMessage || "¡VAYA! INTÉNTALO DE NUEVO"}
                </div>
              )}

              <Button
                className={`w-full h-14 text-base font-black rounded-2xl shadow-2xl active:scale-[0.98] transition-all transform duration-200 ${
                  rating === 0 
                    ? "bg-zinc-100 text-zinc-400 border-none cursor-not-allowed" 
                    : "bg-black hover:bg-zinc-900 text-white border border-white/10"
                }`}
                disabled={rating === 0 || status === "loading"}
                onClick={handleSubmit}
              >
                {status === "loading" ? "ENVIANDO..." : "ENVIAR MI OPINIÓN"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Google Badge Sticker */}
        <div className="mt-8 flex items-center gap-2 bg-zinc-900 px-3 py-1.5 rounded-2xl shadow-2xl border border-white/10 group hover:scale-105 transition-all duration-300">
          <div className="flex flex-col items-end">
            <span className="text-[7px] font-black text-zinc-500 uppercase tracking-tighter leading-none">Powered by</span>
            <span className="text-[10px] font-black text-white">Google</span>
          </div>
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </div>
      </div>
    </div>
  );
}
