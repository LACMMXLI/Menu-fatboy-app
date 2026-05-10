import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Gift,
  Menu as MenuIcon,
  Sparkles,
  Star,
  Utensils,
} from "lucide-react";

const branchLinks = [
  {
    name: "Venecia",
    href: "https://wa.me/526861105191",
  },
  {
    name: "San Marcos",
    href: "https://wa.me/526862761824",
  },
];

function GoogleIcon() {
  return (
    <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="h-[18px] w-[18px] shrink-0 fill-current" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.27-1.38a9.86 9.86 0 0 0 4.72 1.2h.01c5.46 0 9.9-4.45 9.9-9.91C21.95 6.45 17.51 2 12.04 2Zm5.77 14.16c-.24.68-1.4 1.31-1.96 1.39-.5.08-1.13.11-1.83-.11-.42-.13-.97-.31-1.66-.61-2.92-1.26-4.82-4.2-4.97-4.39-.15-.2-1.19-1.58-1.19-3.02s.75-2.15 1.02-2.45c.27-.3.59-.37.79-.37h.57c.18.01.43-.07.67.51.24.59.82 2.03.89 2.18.07.15.12.32.02.52-.1.2-.15.32-.3.49-.15.17-.32.38-.45.51-.15.15-.31.31-.13.61.18.3.78 1.29 1.68 2.09 1.16 1.03 2.13 1.35 2.43 1.5.3.15.47.13.65-.08.17-.2.75-.87.95-1.17.2-.3.4-.25.67-.15.27.1 1.74.82 2.04.97.3.15.5.22.57.35.07.13.07.75-.17 1.43Z" />
    </svg>
  );
}

export default function LandingPage() {
  const [showReviewPrompt, setShowReviewPrompt] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setShowReviewPrompt(true);
    }, 700);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#090704] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffcc3329,transparent_34%),linear-gradient(180deg,#191105_0%,#090704_48%,#050403_100%)]" />
      <div className="absolute -left-28 top-12 h-64 w-64 rounded-full bg-[#FFC107]/20 blur-3xl" />
      <div className="absolute -right-24 bottom-20 h-56 w-56 rounded-full bg-[#25D366]/10 blur-3xl" />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-md flex-col px-5 py-5">
        <header className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-[#FFC107] shadow-2xl shadow-black/30 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            Bienvenido
          </div>
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#FFC107]/30 bg-[#FFC107]/10 text-[#FFC107] shadow-lg shadow-[#FFC107]/10">
            <Utensils className="h-5 w-5" />
          </div>
        </header>

        <div className="flex flex-1 flex-col justify-center py-4">
          <div className="relative mx-auto mb-3 flex h-[clamp(170px,25vh,224px)] w-full max-w-[280px] items-center justify-center">
            <div className="absolute inset-4 rounded-full bg-[#FFC107]/[0.12] blur-3xl" />
            <img
              src="/logo.png"
              alt="Fatboy Logo"
              className="relative h-full w-full object-contain drop-shadow-[0_24px_42px_rgba(0,0,0,0.72)]"
            />
          </div>

          <Button
            asChild
            variant="outline"
            className="mb-4 h-[58px] w-full rounded-2xl border-[#FFC107]/25 bg-white text-sm font-black text-black shadow-[0_18px_42px_rgba(255,255,255,0.14)] hover:bg-zinc-100 hover:text-black active:scale-[0.98]"
          >
            <Link to="/feedback">
              <GoogleIcon />
              CALIFÍCANOS EN GOOGLE
              <Star className="ml-auto h-4 w-4 fill-[#FFC107] text-[#FFC107]" />
            </Link>
          </Button>

          <div className="mb-4 text-center">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-white/45">
              Fatboy Burgers
            </p>
            <h1 className="mt-2 text-[28px] font-black leading-none tracking-tight text-white">
              Ordena rápido.
              <span className="block text-[#FFC107]">Come mejor.</span>
            </h1>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button
                asChild
                className="h-[54px] rounded-2xl bg-[#FFC107] text-[15px] font-black text-black shadow-[0_14px_32px_rgba(255,193,7,0.25)] hover:bg-[#ffd24a] active:scale-[0.98]"
              >
                <Link to="/menu">
                  <MenuIcon className="h-5 w-5" />
                  MENÚ
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-[54px] rounded-2xl border-[#FFC107]/30 bg-white/[0.06] text-[15px] font-black text-white shadow-xl shadow-black/20 hover:bg-[#FFC107]/10 hover:text-[#FFC107] active:scale-[0.98]"
              >
                <Link to="/promotions">
                  <Gift className="h-5 w-5 text-[#FFC107]" />
                  PROMOS
                </Link>
              </Button>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.055] p-2.5 shadow-xl shadow-black/25 backdrop-blur-md">
              <div className="mb-2 flex items-center justify-between px-1">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FFC107]">
                  Pide por WhatsApp
                </p>
                <p className="text-[10px] font-semibold text-white/42">
                  Elige sucursal
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {branchLinks.map((branch) => (
                  <button
                    key={branch.href}
                    type="button"
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-[#25D366]/20 bg-[#25D366] px-2 text-center text-xs font-black uppercase tracking-wide text-white shadow-[0_10px_20px_rgba(37,211,102,0.16)] transition hover:bg-[#20c35d] active:scale-[0.98]"
                    onClick={() => window.open(branch.href, "_blank")}
                  >
                    <WhatsAppIcon />
                    <span>{branch.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer className="pb-1 text-center text-[11px] font-semibold text-white/28">
          © {new Date().getFullYear()} Fatboy Burgers
        </footer>
      </section>

      <Dialog open={showReviewPrompt} onOpenChange={setShowReviewPrompt}>
        <DialogContent className="w-[calc(100vw-32px)] max-w-[360px] rounded-[28px] border-zinc-200 bg-white p-0 text-black shadow-[0_34px_90px_rgba(0,0,0,0.55)]">
          <div className="space-y-5 p-6 pt-7 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 shadow-inner">
              <GoogleIcon />
            </div>
            <div className="space-y-2">
              <DialogTitle className="text-2xl font-black tracking-tight text-black">
                Califícanos
              </DialogTitle>
              <DialogDescription className="text-sm font-medium leading-relaxed text-zinc-500">
                Tu opinión nos ayuda a mejorar tu próxima visita.
              </DialogDescription>
            </div>
            <Button
              asChild
              className="h-14 w-full rounded-2xl bg-black text-sm font-black uppercase tracking-wide text-white shadow-xl hover:bg-zinc-900 active:scale-[0.98]"
            >
              <Link to="/feedback" onClick={() => setShowReviewPrompt(false)}>
                <GoogleIcon />
                Calificar ahora
                <Star className="ml-auto h-4 w-4 fill-[#FFC107] text-[#FFC107]" />
              </Link>
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="h-10 w-full rounded-2xl text-sm font-bold text-zinc-500 hover:bg-zinc-100 hover:text-black"
              onClick={() => setShowReviewPrompt(false)}
            >
              Después
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
