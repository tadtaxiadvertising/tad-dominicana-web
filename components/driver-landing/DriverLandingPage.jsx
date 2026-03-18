import HeroSection from './HeroSection';
import ProcessSection from './ProcessSection';
import EarningsCalculator from './EarningsCalculator';
import FAQSection from './FAQSection';

function TopNav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#09090c]/92 backdrop-blur-xl">
      <div className="mx-auto flex min-h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="text-lg font-black uppercase text-white">
          TAD <span className="text-[#FFD400]">Choferes</span>
        </div>
        <nav className="hidden items-center gap-6 md:flex">
          <a href="#como-funciona" className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500 hover:text-white">Cómo funciona</a>
          <a href="#calculadora" className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500 hover:text-white">Calculadora</a>
          <a href="#faqs" className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500 hover:text-white">FAQ</a>
        </nav>
        <a href="https://wa.me/18495043872?text=Hola,%20quiero%20mi%20pantalla%20ahora%20y%20quiero%20saber%20cómo%20registrarme%20en%20TAD." className="hidden min-h-11 items-center justify-center rounded-2xl bg-[#FFD400] px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-black md:flex">
          Quiero mi pantalla ahora
        </a>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#09090c] py-10 text-center text-sm text-zinc-500">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <p>TAD © 2026. Todos los derechos reservados.</p>
        <p className="mt-2">Modelo comercial para choferes de apps y taxis de base en República Dominicana.</p>
      </div>
    </footer>
  );
}

export default function DriverLandingPage() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-[#09090c] text-white">
      <TopNav />
      <main>
        <HeroSection />
        <ProcessSection />
        <EarningsCalculator />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
}
