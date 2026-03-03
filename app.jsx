import React, { useState, useEffect } from 'react';
import { Play, ChevronRight, Monitor, Wrench, DollarSign, CheckCircle2, AlertCircle, LogOut, User, Car, FileText, Share2, TrendingUp, Smartphone, ShieldCheck, Menu, X } from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';

// --- CUSTOM CSS FOR ANIMATIONS ---
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
  .delay-100 { animation-delay: 100ms; }
  .delay-200 { animation-delay: 200ms; }
  .delay-300 { animation-delay: 300ms; }
  .custom-scrollbar::-webkit-scrollbar { width: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: #1f2937; border-radius: 4px; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #FFD700; border-radius: 4px; }
`;

// --- LOGO TAD ---
const LogoTAD = ({ className = "w-32 h-auto" }) => (
  <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M40 15H80C82.7614 15 85 17.2386 85 20V40C85 42.7614 82.7614 45 80 45H40C37.2386 45 35 42.7614 35 40V20C35 17.2386 37.2386 15 40 15Z" stroke="#FFD700" strokeWidth="4"/>
    <path d="M55 22L68 30L55 38V22Z" fill="#FFD700"/>
    <path d="M15 22H30" stroke="#FFD700" strokeWidth="4" strokeLinecap="round"/>
    <path d="M25 30H30" stroke="#FFD700" strokeWidth="4" strokeLinecap="round"/>
    <path d="M10 30H15" stroke="#FFD700" strokeWidth="4" strokeLinecap="round"/>
    <path d="M20 38H30" stroke="#FFD700" strokeWidth="4" strokeLinecap="round"/>
    <text x="95" y="40" fill="#FFFFFF" fontFamily="sans-serif" fontSize="32" fontWeight="bold" letterSpacing="2">TAD</text>
  </svg>
);

// --- MAIN APP COMPONENT ---
export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
    return () => styleSheet.remove();
  }, []);

  const navigateTo = (view) => {
    setCurrentView(view);
    setIsMenuOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <div className="min-h-screen bg-[#111827] text-gray-200 font-sans selection:bg-[#FFD700] selection:text-gray-900 flex flex-col">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#111827]/90 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => navigateTo('landing')}>
              <LogoTAD />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {currentView === 'landing' && (
                <>
                  <a href="#como-funciona" className="text-sm font-medium hover:text-[#FFD700] transition-colors">Cómo Funciona</a>
                  <a href="#ganancias" className="text-sm font-medium hover:text-[#FFD700] transition-colors">Calculadora</a>
                </>
              )}
              {currentView === 'dashboard' ? (
                <button onClick={() => navigateTo('landing')} className="flex items-center text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
                  <LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión
                </button>
              ) : (
                <button onClick={() => navigateTo('login')} className="bg-[#FFD700] text-gray-900 px-6 py-2.5 rounded-full font-bold text-sm hover:bg-yellow-400 hover:scale-105 transition-all shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                  Área del Conductor
                </button>
              )}
            </div>
            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white">
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-gray-900 border-b border-gray-800 animate-fade-in">
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
              {currentView === 'dashboard' ? (
                <button onClick={() => navigateTo('landing')} className="block w-full text-left px-3 py-2 text-red-400 font-medium">Cerrar Sesión</button>
              ) : (
                <button onClick={() => navigateTo('login')} className="block w-full text-center mt-4 bg-[#FFD700] text-gray-900 px-4 py-3 rounded-md font-bold">
                  Área del Conductor
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* DYNAMIC CONTENT VIEWS */}
      <main className="flex-grow">
        {currentView === 'landing' && <LandingView navigateTo={navigateTo} />}
        {currentView === 'login' && <LoginView navigateTo={navigateTo} />}
        {currentView === 'register' && <RegisterView navigateTo={navigateTo} />}
        {currentView === 'dashboard' && <DashboardView />}
      </main>

      {/* FOOTER */}
      <footer className="bg-gray-900 border-t border-gray-800 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <LogoTAD className="w-24 h-auto mx-auto mb-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
          <p className="text-gray-500 text-sm">
            TAD © 2026. Todos los derechos reservados.<br/>
            Contratos regidos por el Código Civil de la República Dominicana.<br/>
            Modelo de Colaboración Independiente.
          </p>
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      <a href="https://wa.me/18495043872?text=Hola,%20quiero%20más%20información%20sobre%20cómo%20ser%20conductor%20TAD." target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-400 hover:scale-110 transition-all animate-bounce z-50 flex items-center justify-center">
        <Smartphone className="w-6 h-6" />
      </a>
      
      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
}

// --- LANDING VIEW ---
function LandingView({ navigateTo }) {
  return (
    <div className="animate-fade-in">
      {/* HERO SECTION */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFD700]/5 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Tu Vehículo,<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-yellow-200"> Tu Propia Valla Digital. </span>
          </h1>
          <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Gana dinero extra mientras conduces. Instalamos tablets de 10" para entretener a tus pasajeros y generar ingresos por publicidad. El ecosistema más rentable para choferes en RD.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button onClick={() => navigateTo('register')} className="w-full sm:w-auto bg-[#FFD700] text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-yellow-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,215,0,0.4)] flex items-center justify-center">
              Comenzar a Ganar <ChevronRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* EL MODELO SECTION */}
      <section id="como-funciona" className="py-20 bg-gray-900 border-y border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">El Modelo de Negocio</h2>
            <p className="mt-4 text-gray-400">Transparente, rentable y diseñado para tu beneficio.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-[#FFD700]/50 transition-all hover:-translate-y-2">
              <div className="bg-gray-900 w-14 h-14 rounded-full flex items-center justify-center mb-6 border border-gray-700">
                <ShieldCheck className="w-7 h-7 text-[#FFD700]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">1. Suscripción Anual</h3>
              <p className="text-gray-400">
                Inversión única de <span className="text-[#FFD700] font-bold">RD$6,000</span>. Cubre tu Kit Tecnológico (Tablet 10", Soporte, Cargador) y mantenimiento por 12 meses.
              </p>
            </div>
            <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-[#FFD700]/50 transition-all hover:-translate-y-2 delay-100">
              <div className="bg-gray-900 w-14 h-14 rounded-full flex items-center justify-center mb-6 border border-gray-700">
                <Wrench className="w-7 h-7 text-[#FFD700]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">2. Instalación Pro</h3>
              <p className="text-gray-400">
                Técnico a domicilio o en punto de encuentro. Instalación rápida, sin cables a la vista y lista para operar con FullyKiosk.
              </p>
            </div>
            <div className="bg-gray-800/50 p-8 rounded-2xl border border-gray-700 hover:border-[#FFD700]/50 transition-all hover:-translate-y-2 delay-200">
              <div className="bg-gray-900 w-14 h-14 rounded-full flex items-center justify-center mb-6 border border-gray-700">
                <TrendingUp className="w-7 h-7 text-[#FFD700]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">3. Ingresos Pasivos</h3>
              <p className="text-gray-400">
                Ganas por cada anuncio que se reproduce en tu vehículo y comisiones infinitas por referir marcas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CALCULATOR SECTION */}
      <section id="ganancias" className="py-20 bg-[#111827]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 md:p-12 border border-gray-700 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <DollarSign className="w-64 h-64 text-[#FFD700]" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 relative z-10">Calculadora de Ganancias</h2>
            <p className="text-gray-400 mb-8 relative z-10">Simula tus ingresos mensuales. (Máximo 15 anuncios simultáneos por vehículo).</p>
            <Calculator />
          </div>
        </div>
      </section>
    </div>
  );
}

// --- CALCULATOR COMPONENT ---
function Calculator() {
  const [ads, setAds] = useState(4);
  const [sales, setSales] = useState(0);
  const incomePerAd = 500;
  const commissionPerSale = 500;
  const subscriptionCost = 6000;
  const totalIncome = (ads * incomePerAd) + (sales * commissionPerSale);
  const roiMonths = totalIncome > 0 ? Math.ceil(subscriptionCost / totalIncome) : '---';

  return (
    <div className="space-y-8 relative z-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="flex justify-between text-sm font-medium text-gray-300">
            <span>Anuncios Activos (RD$500 c/u)</span>
            <span className="text-[#FFD700] font-bold">{ads}</span>
          </label>
          <input type="range" min="0" max="15" value={ads} onChange={(e) => setAds(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#FFD700]" />
          <div className="flex justify-between text-xs text-gray-500">
            <span>0</span>
            <span>Máx 15</span>
          </div>
        </div>
        <div className="space-y-4">
          <label className="flex justify-between text-sm font-medium text-gray-300">
            <span>Ventas Propias (RD$500 c/u)</span>
            <span className="text-[#FFD700] font-bold">{sales}</span>
          </label>
          <input type="number" min="0" value={sales} onChange={(e) => setSales(Math.max(0, Number(e.target.value)))} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD700] transition-colors" placeholder="Ej: 2" />
          <p className="text-xs text-gray-500">Comisiones ilimitadas si tú traes al cliente.</p>
        </div>
      </div>
      <div className="bg-gray-900/80 rounded-2xl p-6 border border-gray-700/50 flex flex-col md:flex-row items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">Ganancia Mensual Proyectada</p>
          <p className="text-4xl font-extrabold text-[#FFD700]"> RD$ {totalIncome.toLocaleString()} </p>
        </div>
        <div className="mt-4 md:mt-0 text-right md:border-l border-gray-700 md:pl-8">
          <p className="text-gray-400 text-sm mb-1">Retorno de Inversión (RD$6,000)</p>
          <p className="text-xl font-bold text-white"> {roiMonths === '---' ? '---' : `En ${roiMonths} mes${roiMonths > 1 ? 'es' : ''}`} </p>
        </div>
      </div>
      <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-start">
        <CheckCircle2 className="w-5 h-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
        <p className="text-sm text-green-200"> Recuperas tu inversión de suscripción rápidamente. El resto del año es 100% ganancia pura para ti. </p>
      </div>
    </div>
  );
}

// --- LOGIN VIEW ---
function LoginView({ navigateTo }) {
  const handleLogin = (e) => {
    e.preventDefault();
    navigateTo('dashboard');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in py-12">
      <div className="max-w-md w-full bg-gray-800 border border-gray-700 rounded-2xl p-8 shadow-xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white">Portal del Conductor</h2>
          <p className="text-gray-400 mt-2">Ingresa para ver tus ganancias</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Correo Electrónico</label>
            <input type="email" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FFD700] transition-colors" placeholder="chofer@ejemplo.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
            <input type="password" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FFD700] transition-colors" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-[#FFD700] text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors shadow-lg mt-4">
            Entrar al Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

// --- REGISTER VIEW ---
function RegisterView({ navigateTo }) {
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', cedula: '', telefono: '',
    marca: '', ano: '', placa: '', aplicacion: 'uber'
  });

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleComplete = async () => {
    if (!agreed) return;
    setIsSubmitting(true);
    
    // Google Apps Script URL - TAD Dominicana
    const scriptURL = "https://script.google.com/macros/s/AKfycbyF5Sk3R51l0J3bP5lgM2_MV6Qs47Wo-a8wQFme5cBpaNUnlH85h5Z37P6_2fXZRDVh/exec";
    
    try {
      if (scriptURL !== "TU_URL_DE_GOOGLE_APPS_SCRIPT_AQUI") {
        const formPayload = new FormData();
        Object.keys(formData).forEach(key => formPayload.append(key, formData[key]));
        await fetch(scriptURL, { method: 'POST', body: formPayload, mode: 'no-cors' });
      }
      
      const message = `Hola, he completado mi registro en el portal TAD a nombre de ${formData.nombre} ${formData.apellido} y deseo proceder con el pago de mi suscripción anual de RD$6,000 para recibir mi Kit Tecnológico.`;
      window.open(`https://wa.me/18495043872?text=${encodeURIComponent(message)}`, '_blank');
      navigateTo('landing');
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      alert('Hubo un error al conectar con la base de datos, pero te redirigiremos a WhatsApp para continuar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in py-12">
      <div className="max-w-2xl w-full bg-gray-800 border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
        {/* Progress Bar */}
        <div className="bg-gray-900 px-8 py-4 border-b border-gray-700 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-[#FFD700] text-gray-900' : 'bg-gray-700 text-gray-400'}`}>1</div>
            <div className={`w-12 h-1 ${step >= 2 ? 'bg-[#FFD700]' : 'bg-gray-700'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-[#FFD700] text-gray-900' : 'bg-gray-700 text-gray-400'}`}>2</div>
            <div className={`w-12 h-1 ${step >= 3 ? 'bg-[#FFD700]' : 'bg-gray-700'}`}></div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-[#FFD700] text-gray-900' : 'bg-gray-700 text-gray-400'}`}>3</div>
          </div>
          <span className="text-sm font-medium text-gray-400">Paso {step} de 3</span>
        </div>

        <div className="p-8">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center"><User className="mr-2 text-[#FFD700]" /> Datos Personales</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Nombre</label>
                    <input name="nombre" value={formData.nombre} onChange={handleInputChange} type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#FFD700] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Apellido</label>
                    <input name="apellido" value={formData.apellido} onChange={handleInputChange} type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#FFD700] focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Cédula</label>
                  <input name="cedula" value={formData.cedula} onChange={handleInputChange} type="text" placeholder="000-0000000-0" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#FFD700] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Teléfono (WhatsApp)</label>
                  <input name="telefono" value={formData.telefono} onChange={handleInputChange} type="tel" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#FFD700] focus:outline-none" />
                </div>
              </div>
              <div className="mt-8 flex justify-end">
                <button onClick={nextStep} className="bg-[#FFD700] text-gray-900 px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors">Siguiente</button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center"><Car className="mr-2 text-[#FFD700]" /> Datos del Vehículo</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Marca / Modelo</label>
                    <input name="marca" value={formData.marca} onChange={handleInputChange} type="text" placeholder="Ej: Hyundai Sonata Y20" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#FFD700] focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Año</label>
                    <input name="ano" value={formData.ano} onChange={handleInputChange} type="number" placeholder="Ej: 2015" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#FFD700] focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Placa</label>
                  <input name="placa" value={formData.placa} onChange={handleInputChange} type="text" className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#FFD700] focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Aplicación Principal</label>
                  <select name="aplicacion" value={formData.aplicacion} onChange={handleInputChange} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-[#FFD700] focus:outline-none">
                    <option value="uber">Uber</option>
                    <option value="didi">DiDi</option>
                    <option value="indrive">inDrive</option>
                    <option value="privado">Taxi Privado / Base</option>
                  </select>
                </div>
              </div>
              <div className="mt-8 flex justify-between">
                <button onClick={prevStep} className="text-gray-400 hover:text-white px-4 py-2 font-medium">Atrás</button>
                <button onClick={nextStep} className="bg-[#FFD700] text-gray-900 px-6 py-2 rounded-lg font-bold hover:bg-yellow-400 transition-colors">Siguiente</button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="animate-fade-in">
              <h3 className="text-xl font-bold text-white mb-6 flex items-center"><FileText className="mr-2 text-[#FFD700]" /> Contrato Mercantil</h3>
              <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 h-64 overflow-y-auto custom-scrollbar mb-6 text-sm text-gray-400 space-y-4">
                <h4 className="font-bold text-white text-center">CONTRATO DE COLABORACIÓN MERCANTIL INDEPENDIENTE</h4>
                <p><strong>ENTRE:</strong> Por una parte, <strong>TAD</strong>, y por la otra parte, EL COLABORADOR INDEPENDIENTE.</p>
                <p><strong>PRIMERO:</strong> TAD autoriza a EL COLABORADOR a instalar un Kit Tecnológico en su vehículo.</p>
                <p><strong>SEGUNDO:</strong> ESTE ACUERDO NO CONSTITUYE UN CONTRATO DE TRABAJO. Se utilizan equipos para generar ingresos suplementarios.</p>
                <p><strong>TERCERO:</strong> Suscripción anual de RD$6,000.00 que cubre uso del Kit, software y mantenimiento.</p>
                <p><strong>CUARTO:</strong> Compensación de RD$500.00 mensuales por anuncio activo (máx 15) y RD$500 de comisión por referidos.</p>
              </div>
              <div className="flex items-start mb-8">
                <div className="flex items-center h-5">
                  <input id="terms" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-5 h-5 bg-gray-900 border-gray-700 rounded accent-[#FFD700] cursor-pointer" />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-white cursor-pointer">
                    Acepto términos de colaboración mercantil no-laboral.
                  </label>
                  <p className="text-gray-500">Reconozco que este registro guardará mis datos y me redirigirá para el pago.</p>
                </div>
              </div>
              <div className="flex justify-between">
                <button onClick={prevStep} disabled={isSubmitting} className="text-gray-400 hover:text-white px-4 py-2 font-medium disabled:opacity-50">Atrás</button>
                <button onClick={handleComplete} disabled={!agreed || isSubmitting} className={`px-6 py-3 rounded-lg font-bold flex items-center transition-all ${ agreed && !isSubmitting ? 'bg-[#FFD700] text-gray-900 hover:bg-yellow-400 hover:scale-105 shadow-[0_0_15px_rgba(255,215,0,0.3)]' : 'bg-gray-700 text-gray-500 cursor-not-allowed' }`}>
                  {isSubmitting ? 'Guardando Datos...' : 'Confirmar y Pagar'} {!isSubmitting && <ChevronRight className="ml-2 w-5 h-5" />}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- DASHBOARD VIEW ---
function DashboardView() {
  const [activeTab, setActiveTab] = useState('resumen');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header Dashboard */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Portal del Conductor</h1>
        <p className="text-gray-400">Bienvenido al sistema de gestión TAD</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-8 border-b border-gray-700">
        <button onClick={() => setActiveTab('resumen')} className={`px-4 py-2 font-medium transition-colors ${activeTab === 'resumen' ? 'text-[#FFD700] border-b-2 border-[#FFD700]' : 'text-gray-400 hover:text-white'}`}>
          Resumen
        </button>
        <button onClick={() => setActiveTab('anuncios')} className={`px-4 py-2 font-medium transition-colors ${activeTab === 'anuncios' ? 'text-[#FFD700] border-b-2 border-[#FFD700]' : 'text-gray-400 hover:text-white'}`}>
          Anuncios
        </button>
      </div>

      {/* Tab Content: Resumen */}
      {activeTab === 'resumen' && (
        <div className="animate-fade-in space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <p className="text-gray-400 text-sm font-bold">Anuncios Activos</p>
              <h3 className="text-3xl font-black text-white mt-2">9 / 15</h3>
              <p className="text-xs text-green-400 mt-1">RD$4,500 este mes</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <p className="text-gray-400 text-sm font-bold">Referidos</p>
              <h3 className="text-3xl font-black text-white mt-2">3</h3>
              <p className="text-xs text-green-400 mt-1">RD$1,500 este mes</p>
            </div>
            <div className="bg-[#FFD700] rounded-xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform"><DollarSign className="w-20 h-20 text-gray-900" /></div>
              <p className="text-gray-900 text-sm font-bold">Ganancias Acumuladas</p>
              <h3 className="text-4xl font-black text-gray-900 mt-2">RD$ 6,000</h3>
              <p className="text-xs text-gray-800 mt-1 font-medium">Ciclo: Marzo 2026</p>
            </div>
          </div>

          {/* Referidos */}
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h3 className="text-xl font-bold text-white mb-2">Programa de Referidos (Sin Límite)</h3>
                <p className="text-gray-400 text-sm max-w-md">
                  Por cada marca o negocio que refieras y pague pauta en TAD, ganas <strong className="text-[#FFD700]">RD$500 mensuales</strong> mientras su anuncio esté activo. No hay límite de comisiones.
                </p>
              </div>
              <div className="w-full md:w-auto flex flex-col space-y-3">
                <button className="bg-white text-gray-900 px-6 py-3 rounded-lg font-bold flex items-center justify-center hover:bg-gray-100 transition-colors">
                  <Share2 className="w-5 h-5 mr-2" /> Copiar Enlace de Ventas
                </button>
                <a href="https://wa.me/?text=Anúnciate%20en%20los%20taxis%20de%20TAD.%20Contáctalos%20y%20diles%20que%20vienes%20de%20mi%20parte%20(A123456)." target="_blank" rel="noopener noreferrer" className="bg-[#25D366] text-white px-6 py-3 rounded-lg font-bold flex items-center justify-center hover:bg-green-500 transition-colors">
                  Compartir por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content: Anuncios */}
      {activeTab === 'anuncios' && (
        <div className="animate-fade-in">
          <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
              <h3 className="font-bold text-white">Proyectándose en tu vehículo</h3>
              <span className="bg-gray-900 text-[#FFD700] text-xs font-bold px-3 py-1 rounded-full border border-gray-700">9 / 15 Máximo</span>
            </div>
            <div className="divide-y divide-gray-700">
              {[
                { id: 1, marca: "Supermercados Nacional", tipo: "Video 15s", estado: "Activo" },
                { id: 2, marca: "Banco Popular (AutoPréstamo)", tipo: "Imagen estática", estado: "Activo" },
                { id: 3, marca: "Claro (Internet Fibra)", tipo: "Video 10s", estado: "Activo" },
                { id: 4, marca: "Restaurante El Pelícano", tipo: "Referido Tuyo", estado: "Activo", referido: true },
                { id: 5, marca: "Seguros Universal", tipo: "Video 15s", estado: "Activo" },
              ].map((ad) => (
                <div key={ad.id} className="p-6 flex items-center justify-between hover:bg-gray-750 transition-colors">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-700 mr-4">
                      {ad.tipo.includes('Video') ? <Play className="w-6 h-6 text-gray-500" /> : <Monitor className="w-6 h-6 text-gray-500" />}
                    </div>
                    <div>
                      <h4 className="text-white font-medium flex items-center">
                        {ad.marca}
                        {ad.referido && <span className="ml-2 bg-[#FFD700]/20 text-[#FFD700] text-[10px] font-bold px-2 py-0.5 rounded uppercase">Venta Propia</span>}
                      </h4>
                      <p className="text-sm text-gray-500">{ad.tipo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#FFD700] font-bold">+RD$500</p>
                    <p className="text-xs text-green-400">{ad.estado}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
