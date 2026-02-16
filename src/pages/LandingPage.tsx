import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Utensils, Gift, MapPin } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center animate-in fade-in duration-700">
      
      {/* Título pequeño arriba */}
      <h1 className="text-xl font-medium tracking-widest text-[#FFC107] uppercase mb-8">
        Bienvenido a
      </h1>

      {/* Logo */}
      <div className="relative w-64 h-64 mb-12">
        <div className="absolute inset-0 bg-[#FFC107]/10 rounded-full blur-2xl animate-pulse"></div>
        <img 
            src="/logo.png" 
            alt="Fatboy Logo" 
            className="relative w-full h-full object-contain drop-shadow-2xl"
        />
      </div>
      
      {/* Contenedor compacto de Botones */}
      <div className="w-full max-w-sm space-y-3">
        
        {/* Fila 1: Menú y Promociones */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/menu" className="w-full">
            <Button className="w-full h-12 text-base font-bold bg-[#FFC107] text-black hover:bg-[#FFC107]/90 shadow-lg shadow-[#FFC107]/20 transition-transform active:scale-95">
              <Utensils className="mr-2 h-4 w-4" />
              MENÚ
            </Button>
          </Link>
          
          <Link to="/promotions" className="w-full">
              <Button variant="outline" className="w-full h-12 text-base font-bold border-[#FFC107]/50 text-white hover:bg-[#FFC107]/10 hover:text-[#FFC107] transition-transform active:scale-95">
                  <Gift className="mr-2 h-4 w-4 text-[#FFC107]" />
                  PROMOS
              </Button>
          </Link>
        </div>

        {/* Separador sutil */}
        <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground font-medium">Pide por WhatsApp</span>
            </div>
        </div>

        {/* Fila 2: Sucursales WhatsApp */}
        <div className="grid grid-cols-2 gap-3">
            <Button 
                variant="default" 
                className="w-full h-12 text-sm font-bold bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg shadow-green-500/20 transition-transform active:scale-95 group overflow-hidden" 
                onClick={() => window.open("https://wa.me/526861105191", "_blank")}
            >
                <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5 fill-current flex-shrink-0" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.124-.297.05.591.321.793.537.227.242.51.54.723.133.213.255.435.349.678.093.242.049.454.049.454s-.438 1.157-1.11 1.64c-.672.484-1.282.47-1.282.47s-3.418-.553-6.505-3.64c-3.087-3.087-3.64-6.505-3.64-6.505s-.014-.61.47-1.282c.483-.672 1.64-1.11 1.64-1.11s.212-.008.455.049c.243.093.465.215.678.349.197.202.468.495.537.793C9.077 4.542 10.233 7.5 10.233 7.5s.149.372-.025.792c-.173.42-.52.767-.792 1.09-.272.32-.57.47-.42.742.149.273.669 1.116 1.487 1.934.818.818 1.661 1.338 1.934 1.487.272.149.421-.149.742-.421.323-.272.67-.519 1.09-.691.42-.174.792-.025.792-.025s2.957 1.156 3.106 1.255Z"/></svg>
                VENECIA
            </Button>
            <Button 
                variant="default" 
                className="w-full h-12 text-sm font-bold bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg shadow-green-500/20 transition-transform active:scale-95 group overflow-hidden" 
                onClick={() => window.open("https://wa.me/526862761824", "_blank")}
            >
                <svg viewBox="0 0 24 24" className="mr-2 h-5 w-5 fill-current flex-shrink-0" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.124-.297.05.591.321.793.537.227.242.51.54.723.133.213.255.435.349.678.093.242.049.454.049.454s-.438 1.157-1.11 1.64c-.672.484-1.282.47-1.282.47s-3.418-.553-6.505-3.64c-3.087-3.087-3.64-6.505-3.64-6.505s-.014-.61.47-1.282c.483-.672 1.64-1.11 1.64-1.11s.212-.008.455.049c.243.093.465.215.678.349.197.202.468.495.537.793C9.077 4.542 10.233 7.5 10.233 7.5s.149.372-.025.792c-.173.42-.52.767-.792 1.09-.272.32-.57.47-.42.742.149.273.669 1.116 1.487 1.934.818.818 1.661 1.338 1.934 1.487.272.149.421-.149.742-.421.323-.272.67-.519 1.09-.691.42-.174.792-.025.792-.025s2.957 1.156 3.106 1.255Z"/></svg>
                SAN MARCOS
            </Button>
        </div>

        {/* Separador sutil Google */}
        <div className="relative py-2 mt-2">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground font-medium">Ayúdanos a mejorar</span>
            </div>
        </div>

        {/* Botón Google Reviews */}
        <Button 
            variant="outline" 
            className="w-full h-12 text-sm font-bold bg-white text-black hover:bg-gray-100 hover:text-black border-transparent shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2" 
            onClick={() => window.open("https://fatboy-star.vercel.app/", "_blank")}
        >
            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            CALIFÍCANOS EN GOOGLE
        </Button>

      </div>
      
      <footer className="absolute bottom-4 text-xs text-muted-foreground/30">
        © {new Date().getFullYear()} Fatboy Burgers
      </footer>
    </div>
  );
}
