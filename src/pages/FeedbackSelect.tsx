import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function FeedbackSelectPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-sm space-y-8 text-center">
        <div className="flex flex-col items-center space-y-4">
          <img src="/logo.png" alt="FATBOY Logo" className="h-48 w-auto" />
          <p className="text-zinc-500 font-medium">Selecciona una sucursal para darnos tu opinión</p>
        </div>
        <div className="grid gap-4">
          <Link to="/feedback/venecia" className="w-full">
            <Button className="w-full h-16 text-xl font-bold bg-[#FFC107] text-black hover:bg-[#FFC107]/90 shadow-lg shadow-[#FFC107]/20 transition-transform active:scale-95">
              Venecia
            </Button>
          </Link>
          <Link to="/feedback/sanmarcos" className="w-full">
            <Button className="w-full h-16 text-xl font-bold bg-[#FFC107] text-black hover:bg-[#FFC107]/90 shadow-lg shadow-[#FFC107]/20 transition-transform active:scale-95">
              San Marcos
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
