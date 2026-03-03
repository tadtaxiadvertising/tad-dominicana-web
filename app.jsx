import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  FileText,
  HelpCircle,
  Home,
  Landmark,
  LogOut,
  Menu,
  Phone,
  User,
  Wallet,
  X,
} from 'lucide-react';

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes pulseSoft {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  .animate-fade-in { animation: fadeIn 0.45s ease-out forwards; }
  .skeleton { animation: pulseSoft 1.3s ease-in-out infinite; }
`;

const LogoTAD = ({ className = 'w-24 sm:w-28 h-auto' }) => (
  <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M40 15H80C82.7614 15 85 17.2386 85 20V40C85 42.7614 82.7614 45 80 45H40C37.2386 45 35 42.7614 35 40V20C35 17.2386 37.2386 15 40 15Z" stroke="#FFC107" strokeWidth="4"/>
    <path d="M55 22L68 30L55 38V22Z" fill="#FFC107"/>
    <text x="95" y="40" fill="#FFFFFF" fontFamily="sans-serif" fontSize="32" fontWeight="bold" letterSpacing="2">TAD</text>
  </svg>
);

const financeData = { pagoPorAnuncio: 500, comisionVenta: 500 };

const paymentOptions = [
  { id: 'bank_deposit', label: 'Depósito bancario', icon: Landmark },
  { id: 'bank_transfer', label: 'Transferencia a cuenta', icon: Wallet },
  { id: 'cash_pickup', label: 'Pago en efectivo', icon: Banknote },
  { id: 'other', label: 'Otro método configurable', icon: CircleDollarSign },
];

const validatePaymentData = (payload) => {
  const errors = {};
  if (!payload.method) errors.method = 'Selecciona un método de pago.';

  if (payload.method === 'bank_deposit' || payload.method === 'bank_transfer') {
    if (!payload.bankName?.trim()) errors.bankName = 'Banco obligatorio.';
    if (!payload.accountType) errors.accountType = 'Tipo de cuenta obligatorio.';
    if (!/^\d{8,20}$/.test(payload.accountNumber || '')) errors.accountNumber = 'Cuenta de 8 a 20 dígitos numéricos.';
    if (!payload.accountHolder?.trim()) errors.accountHolder = 'Titular obligatorio.';
    if (!/^\d{11,13}$/.test(payload.identification || '')) errors.identification = 'Identificación inválida (11 a 13 dígitos).';
    if (!/^\d{10,12}$/.test(payload.contactPhone || '')) errors.contactPhone = 'Teléfono inválido (10 a 12 dígitos).';
  }

  if (payload.method === 'cash_pickup') {
    if (!payload.pickupPoint?.trim()) errors.pickupPoint = 'Punto de retiro obligatorio.';
    if (!payload.city?.trim()) errors.city = 'Ciudad obligatoria.';
    if (!payload.acceptTerms) errors.acceptTerms = 'Debes aceptar los términos para pago en efectivo.';
  }

  if (payload.method === 'other' && !payload.otherMethodDescription?.trim()) {
    errors.otherMethodDescription = 'Describe el método de pago.';
  }

  return errors;
};

export default function App() {
  const [currentView, setCurrentView] = useState('landing');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const styleSheet = document.createElement('style');
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
    <div className="min-h-screen overflow-x-hidden bg-[#111827] text-gray-200 selection:bg-[#FFC107] selection:text-gray-900 flex flex-col">
      <nav className="sticky top-0 z-50 bg-[#111827]/90 border-b border-gray-800 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between min-h-[72px]">
            <button onClick={() => navigateTo('landing')} className="cursor-pointer">
              <LogoTAD />
            </button>
            <div className="hidden md:flex items-center gap-6">
              {currentView === 'landing' && (
                <>
                  <a href="#como-funciona" className="text-sm hover:text-[#FFC107]">Cómo funciona</a>
                  <a href="#ganancias" className="text-sm hover:text-[#FFC107]">Calcula tus ganancias</a>
                </>
              )}
              {currentView === 'dashboard' ? (
                <button onClick={() => navigateTo('landing')} className="text-red-400 hover:text-red-300 inline-flex items-center gap-2 min-h-[44px] px-2">
                  <LogOut className="w-4 h-4" /> Cerrar sesión
                </button>
              ) : (
                <button onClick={() => navigateTo('login')} className="bg-[#FFC107] text-gray-900 font-bold px-5 py-2.5 rounded-full hover:bg-yellow-300 transition min-h-[44px]">
                  Iniciar Sesión
                </button>
              )}
            </div>
            <button onClick={() => setIsMenuOpen((prev) => !prev)} className="md:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800 p-4 space-y-3 animate-fade-in">
            <button onClick={() => navigateTo('login')} className="w-full bg-[#FFC107] text-gray-900 py-3 rounded-xl font-bold min-h-[44px]">Iniciar Sesión</button>
            <button onClick={() => navigateTo('register')} className="w-full border border-gray-700 py-3 rounded-xl min-h-[44px]">Registro de conductor</button>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {currentView === 'landing' && <LandingView navigateTo={navigateTo} />}
        {currentView === 'login' && <LoginView navigateTo={navigateTo} />}
        {currentView === 'register' && <RegisterView navigateTo={navigateTo} />}
        {currentView === 'dashboard' && <DashboardView />}
      </main>

      <footer className="border-t border-gray-800 bg-gray-900 py-8 mt-auto text-center text-sm text-gray-500">
        <LogoTAD className="w-24 mx-auto mb-3 opacity-70" />TAD © 2026 • República Dominicana
      </footer>
    </div>
  );
}

function LandingView({ navigateTo }) {
  return (
    <div className="animate-fade-in">
      <section className="py-14 md:py-20 lg:py-28 text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight">Tu Vehículo, <span className="text-[#FFC107]">Tu Plataforma de Ingresos</span></h1>
        <p className="mt-6 max-w-3xl mx-auto text-gray-400 text-base md:text-lg">Gana RD$500 por anuncio activo y RD$500 por comisión de venta. Opera todo desde tu portal del conductor TAD.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => navigateTo('register')} className="bg-[#FFC107] text-gray-900 font-bold px-8 py-4 rounded-full hover:bg-yellow-300 min-h-[44px]">Regístrate para empezar a ganar</button>
          <button onClick={() => navigateTo('login')} className="border border-gray-600 px-8 py-4 rounded-full hover:border-[#FFC107] hover:text-[#FFC107] min-h-[44px]">Acceso de Conductor</button>
        </div>
      </section>

      <section id="como-funciona" className="bg-gray-900 border-y border-gray-800 py-16 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {['Kit de instalación con suscripción de RD$6,000.', 'Monetización mensual por anuncios activos.', 'Comisión de RD$500 por cada venta referida.'].map((item, idx) => (
            <div key={idx} className="rounded-2xl border border-gray-700 bg-gray-800/50 p-6">
              <p className="text-[#FFC107] font-bold mb-2">Paso {idx + 1}</p>
              <p className="text-gray-300">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="ganancias" className="py-16 px-4">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 p-5 md:p-10">
          <h2 className="text-3xl font-bold">Calcula tus Ganancias</h2>
          <p className="text-gray-400 mt-2 mb-8">Usa los valores oficiales de TAD para estimar tu ingreso mensual.</p>
          <Calculator />
          <button onClick={() => navigateTo('register')} className="mt-8 bg-[#FFC107] text-gray-900 px-6 py-3 rounded-xl font-bold hover:bg-yellow-300 inline-flex items-center gap-2 min-h-[44px]">
            Regístrate para empezar a ganar <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
}

function Calculator() {
  const [ads, setAds] = useState(0);
  const [sales, setSales] = useState(0);
  const total = ads * financeData.pagoPorAnuncio + sales * financeData.comisionVenta;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <label className="text-sm text-gray-300 block mb-2">Anuncios activos ({financeData.pagoPorAnuncio} RD$ c/u)</label>
        <input type="range" min={0} max={15} value={ads} onChange={(e) => setAds(Number(e.target.value))} className="w-full accent-[#FFC107]" />
        <p className="text-[#FFC107] font-bold mt-2">{ads} anuncios</p>
      </div>
      <div>
        <label className="text-sm text-gray-300 block mb-2">Ventas referidas ({financeData.comisionVenta} RD$ c/u)</label>
        <input type="number" min={0} value={sales} onChange={(e) => setSales(Math.max(0, Number(e.target.value) || 0))} className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3" />
      </div>
      <div className="md:col-span-2 rounded-2xl bg-gray-900 border border-gray-700 p-6">
        <p className="text-gray-400">Ganancia mensual estimada</p>
        <p className="text-4xl font-black text-[#FFC107]">RD${total.toLocaleString('es-DO')}</p>
      </div>
    </div>
  );
}

function LoginView({ navigateTo }) {
  const [mode, setMode] = useState('login');
  const handleAuth = (e) => {
    e.preventDefault();
    navigateTo('dashboard');
  };

  return (
    <div className="min-h-[80vh] px-4 py-10 md:py-12 flex items-center justify-center animate-fade-in">
      <div className="max-w-md w-full rounded-3xl border border-gray-700 bg-gray-800 p-6 md:p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-center">Acceso de Conductor</h2>
        <p className="text-gray-400 text-center mt-2">Ingresa con tu teléfono de WhatsApp y contraseña.</p>
        <div className="mt-6 rounded-xl bg-gray-900 p-1 grid grid-cols-2 gap-1">
          <button onClick={() => setMode('login')} className={`py-2 rounded-lg font-semibold min-h-[44px] ${mode === 'login' ? 'bg-[#FFC107] text-gray-900' : 'text-gray-300'}`}>Login</button>
          <button onClick={() => setMode('signup')} className={`py-2 rounded-lg font-semibold min-h-[44px] ${mode === 'signup' ? 'bg-[#FFC107] text-gray-900' : 'text-gray-300'}`}>Sign Up</button>
        </div>

        <form className="mt-6 space-y-4" onSubmit={handleAuth}>
          <FormField label="Teléfono (WhatsApp)" required type="tel" placeholder="8490000000" inputMode="tel" />
          <FormField label="Contraseña" required type="password" placeholder="••••••••" />
          <button type="submit" className="w-full bg-[#FFC107] text-gray-900 py-3 rounded-xl font-bold hover:bg-yellow-300 transition min-h-[44px]">{mode === 'login' ? 'Entrar al portal' : 'Crear cuenta de conductor'}</button>
        </form>
      </div>
    </div>
  );
}

function RegisterView({ navigateTo }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '', apellido: '', cedula: '', telefono: '', marca: '', modelo: '', ano: '', placa: '',
    plataformas: '', horasDiarias: '', diasSemana: '', ciudad: '', horario: '', tieneTablet: '', experienciaVentas: '', aplicacion: 'Web',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const requiredFieldsByStep = {
    1: ['nombre', 'apellido', 'cedula', 'telefono'],
    2: ['marca', 'modelo', 'ano', 'placa', 'plataformas', 'horasDiarias', 'diasSemana', 'ciudad', 'horario', 'tieneTablet', 'experienciaVentas'],
  };

  const updateField = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const stepHasMissingFields = (stepNumber) => (requiredFieldsByStep[stepNumber] || []).some((field) => !String(formData[field] || '').trim());
  const isPlatformSelected = (platform) => formData.plataformas.split(',').map((item) => item.trim()).filter(Boolean).includes(platform);
  const togglePlatform = (platform) => {
    const selected = formData.plataformas.split(',').map((item) => item.trim()).filter(Boolean);
    const updated = selected.includes(platform) ? selected.filter((item) => item !== platform) : [...selected, platform];
    setFormData((prev) => ({ ...prev, plataformas: updated.join(', ') }));
  };

  const goToNextStep = () => {
    if (stepHasMissingFields(step)) return setSubmitMessage('Completa todas las preguntas de este paso para continuar.');
    setSubmitMessage('');
    setStep((s) => Math.min(4, s + 1));
  };

  const submitRegister = async () => {
    if (stepHasMissingFields(1) || stepHasMissingFields(2)) return setSubmitMessage('Aún faltan respuestas obligatorias antes de enviar.');
    setIsSubmitting(true);
    const scriptURL = import.meta.env.VITE_GOOGLE_SCRIPT_URL || 'https://script.google.com/macros/s/AKfycbyF5Sk3R51l0J3bP5lgM2_MV6Qs47Wo-a8wQFme5cBpaNUnlH85h5Z37P6_2fXZRDVh/exec';

    try {
      const payload = new URLSearchParams({ ...formData, requestId: String(Date.now()) }).toString();
      let beaconSent = false;
      if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
        beaconSent = navigator.sendBeacon(scriptURL, new Blob([payload], { type: 'application/x-www-form-urlencoded;charset=UTF-8' }));
      }
      if (!beaconSent) await fetch(scriptURL, { method: 'POST', mode: 'no-cors', body: payload, keepalive: true });
      setSubmitMessage('Registro enviado correctamente.');
      setTimeout(() => navigateTo('login'), 700);
    } catch (error) {
      setSubmitMessage(`Error al enviar: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] px-4 py-8 md:py-10 animate-fade-in">
      <div className="max-w-3xl mx-auto rounded-3xl border border-gray-700 bg-gray-800 p-5 md:p-10">
        <h2 className="text-2xl md:text-3xl font-bold">Registro de Conductor TAD</h2>
        <p className="text-gray-400 mt-2">Completa los 4 pasos del onboarding.</p>
        <div className="flex gap-2 mt-6">{[1, 2, 3, 4].map((n) => <div key={n} className={`h-2 flex-1 rounded-full ${step >= n ? 'bg-[#FFC107]' : 'bg-gray-700'}`} />)}</div>

        {step === 1 && <BasicDataStep formData={formData} updateField={updateField} />}
        {step === 2 && <OperationDataStep formData={formData} updateField={updateField} isPlatformSelected={isPlatformSelected} togglePlatform={togglePlatform} />}
        {step === 3 && <div className="mt-8"><h3 className="font-bold text-xl mb-2">Paso 3: Configurar método de pago</h3><PaymentMethodConfigurator /></div>}
        {step === 4 && <RegisterSummary formData={formData} submitMessage={submitMessage} isSubmitting={isSubmitting} submitRegister={submitRegister} />}

        <div className="mt-8 flex justify-between gap-3">
          <button onClick={() => setStep((s) => Math.max(1, s - 1))} className="px-4 py-2 text-gray-300 min-h-[44px]" disabled={step === 1}>Atrás</button>
          <button onClick={goToNextStep} className="px-6 py-3 rounded-xl bg-[#FFC107] text-gray-900 font-bold disabled:opacity-50 min-h-[44px]" disabled={step === 4 || (step < 3 && stepHasMissingFields(step))}>Siguiente</button>
        </div>
      </div>
    </div>
  );
}

function DashboardView() {
  const [tab, setTab] = useState('inicio');
  const [isLoading, setIsLoading] = useState(true);
  const [monthFilter, setMonthFilter] = useState('Todos');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const payments = [{ id: 1, month: 'Enero', ads: 8, sales: 2 }, { id: 2, month: 'Febrero', ads: 10, sales: 3 }, { id: 3, month: 'Marzo', ads: 12, sales: 2 }, { id: 4, month: 'Abril', ads: 11, sales: 4 }].map((row) => ({ ...row, total: row.ads * financeData.pagoPorAnuncio + row.sales * financeData.comisionVenta }));
  const filteredPayments = useMemo(() => payments.filter((p) => monthFilter === 'Todos' || p.month === monthFilter), [monthFilter]);
  const tabs = [{ id: 'inicio', label: 'Inicio', icon: Home }, { id: 'perfil', label: 'Mi Perfil', icon: User }, { id: 'ganancias', label: 'Mis Ganancias', icon: CircleDollarSign }, { id: 'soporte', label: 'Soporte', icon: HelpCircle }];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8 md:grid md:grid-cols-[230px_1fr] gap-6 animate-fade-in">
      <aside className="hidden md:block bg-gray-900 border border-gray-800 rounded-2xl p-3 h-fit sticky top-24">{tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-2 min-h-[44px] ${tab === id ? 'bg-[#FFC107] text-gray-900 font-bold' : 'text-gray-300 hover:bg-gray-800'}`}><Icon className="w-5 h-5" /> {label}</button>)}</aside>
      <section>
        {tab === 'inicio' && <div className="space-y-6"><h2 className="text-3xl font-bold">Inicio (Resumen)</h2><div className="grid md:grid-cols-2 gap-6"><div className="rounded-2xl bg-[#FFC107] text-gray-900 p-6"><p className="font-semibold">Saldo Disponible</p><p className="text-5xl font-black mt-2">RD$7,500</p></div><div className="rounded-2xl border border-gray-700 bg-gray-800 p-6"><p className="text-gray-400">Anuncios Activos</p><p className="text-4xl font-black mt-2">12</p></div></div></div>}

        {tab === 'perfil' && <div className="space-y-5"><h2 className="text-3xl font-bold">Mi Perfil</h2><div className="grid md:grid-cols-2 gap-4"><UploadField label="Foto de perfil" icon={User} /><UploadField label="Foto de la cédula" icon={FileText} /><input className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-3" placeholder="Placa" /><input className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-3" placeholder="Modelo" /><input className="rounded-xl border border-gray-700 bg-gray-900 px-4 py-3" placeholder="Año" /><button className="bg-[#FFC107] text-gray-900 rounded-xl font-bold px-5 py-3 min-h-[44px]">Guardar perfil</button></div><div className="pt-2"><PaymentMethodConfigurator /></div></div>}

        {tab === 'ganancias' && (
          <div>
            <h2 className="text-3xl font-bold mb-4">Mis Ganancias</h2>
            {isLoading ? <div className="space-y-4"><div className="h-40 rounded-2xl bg-gray-800 skeleton" /><div className="h-20 rounded-2xl bg-gray-800 skeleton" /><div className="h-20 rounded-2xl bg-gray-800 skeleton" /></div> : <div className="space-y-6"><div className="rounded-2xl border border-gray-700 bg-gray-900 p-5"><p className="text-sm text-gray-400 mb-3">Progresión mensual (RD$)</p><LineChart data={payments} /></div><div className="rounded-2xl border border-gray-700 bg-gray-900 overflow-hidden"><div className="p-4 border-b border-gray-800 flex items-center justify-between"><h3 className="font-bold">Historial de pagos recibidos</h3><select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"><option>Todos</option>{payments.map((p) => <option key={p.id}>{p.month}</option>)}</select></div><div className="hidden md:block overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-800/60 text-gray-300"><tr><th className="text-left p-3">Mes</th><th className="text-left p-3">Anuncios</th><th className="text-left p-3">Comisiones</th><th className="text-left p-3">Total</th></tr></thead><tbody>{filteredPayments.map((row) => <tr key={row.id} className="border-t border-gray-800"><td className="p-3">{row.month}</td><td className="p-3">RD${row.ads * financeData.pagoPorAnuncio}</td><td className="p-3">RD${row.sales * financeData.comisionVenta}</td><td className="p-3 text-[#FFC107] font-bold">RD${row.total.toLocaleString('es-DO')}</td></tr>)}</tbody></table></div><div className="md:hidden p-4 space-y-3">{filteredPayments.map((row) => <article key={row.id} className="rounded-xl border border-gray-700 p-3 bg-gray-800/40"><p className="font-bold">{row.month}</p><p className="text-sm text-gray-300">Anuncios: RD${row.ads * financeData.pagoPorAnuncio}</p><p className="text-sm text-gray-300">Comisiones: RD${row.sales * financeData.comisionVenta}</p><p className="text-sm text-[#FFC107] font-bold">Total: RD${row.total.toLocaleString('es-DO')}</p></article>)}</div></div></div>}
          </div>
        )}

        {tab === 'soporte' && <div className="rounded-2xl border border-gray-700 bg-gray-900 p-6"><h2 className="text-3xl font-bold mb-3">Soporte</h2><p className="text-gray-400 mb-5">¿Necesitas ayuda con tu cuenta o instalación?</p><a href="https://wa.me/18495043872" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#FFC107] text-gray-900 px-6 py-3 rounded-xl font-bold min-h-[44px]"><Phone className="w-5 h-5" /> WhatsApp 8495043872</a></div>}
      </section>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 grid grid-cols-4">{tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={`py-3 text-xs flex flex-col items-center gap-1 min-h-[44px] ${tab === id ? 'text-[#FFC107]' : 'text-gray-400'}`}><Icon className="w-4 h-4" /> {label}</button>)}</nav>
    </div>
  );
}

function PaymentMethodConfigurator() {
  const [form, setForm] = useState({ method: '', accountType: '', acceptTerms: false });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle');

  const setValue = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));
  const canSubmit = Object.keys(validatePaymentData(form)).length === 0 && !!form.method;

  const save = async () => {
    const nextErrors = validatePaymentData(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    if (!window.confirm('¿Confirmas guardar este método de pago?')) return;

    setState('saving');
    try {
      const response = await fetch('/api/payment-method', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-driver-id': 'demo-driver-1' },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error('No fue posible guardar la configuración.');
      setState('success');
      setErrors({});
    } catch (error) {
      setState('error');
      setErrors({ global: error.message });
    }
  };

  return (
    <div className="rounded-2xl border border-gray-700 p-4 md:p-5 bg-gray-900/50 space-y-4">
      <h4 className="font-bold">Método de pago del chofer</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {paymentOptions.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" onClick={() => { setValue('method', id); setErrors({}); }} className={`rounded-2xl border p-4 text-left min-h-[88px] transition ${form.method === id ? 'border-[#FFC107] bg-[#FFC107]/10' : 'border-gray-700 bg-gray-900 hover:border-gray-500'}`}>
            <Icon className="w-5 h-5 mb-2 text-[#FFC107]" />
            <p className="font-semibold">{label}</p>
          </button>
        ))}
      </div>

      {(form.method === 'bank_deposit' || form.method === 'bank_transfer') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <FormField label="Nombre del banco" value={form.bankName || ''} onChange={(e) => setValue('bankName', e.target.value)} />
          <SelectField label="Tipo de cuenta" value={form.accountType || ''} onChange={(e) => setValue('accountType', e.target.value)} options={[{ value: '', label: 'Seleccionar' }, { value: 'ahorros', label: 'Ahorros' }, { value: 'corriente', label: 'Corriente' }]} />
          <FormField label="Número de cuenta" inputMode="numeric" value={form.accountNumber || ''} onChange={(e) => setValue('accountNumber', e.target.value.replace(/\D/g, ''))} />
          <FormField label="Nombre del titular" value={form.accountHolder || ''} onChange={(e) => setValue('accountHolder', e.target.value)} />
          <FormField label="Cédula o identificación" inputMode="numeric" value={form.identification || ''} onChange={(e) => setValue('identification', e.target.value.replace(/\D/g, ''))} />
          <FormField label="Teléfono de contacto" type="tel" inputMode="tel" value={form.contactPhone || ''} onChange={(e) => setValue('contactPhone', e.target.value.replace(/\D/g, ''))} />
        </div>
      )}

      {form.method === 'cash_pickup' && (
        <div className="space-y-3 rounded-2xl border border-gray-700 p-4 bg-gray-900">
          <p className="text-sm text-gray-400">El pago en efectivo estará disponible en los puntos autorizados por la plataforma.</p>
          <FormField label="Punto de retiro preferido" value={form.pickupPoint || ''} onChange={(e) => setValue('pickupPoint', e.target.value)} />
          <FormField label="Ciudad" value={form.city || ''} onChange={(e) => setValue('city', e.target.value)} />
          <label className="inline-flex gap-2 items-start text-sm"><input type="checkbox" checked={!!form.acceptTerms} onChange={(e) => setValue('acceptTerms', e.target.checked)} />Acepto términos y condiciones para pago en efectivo.</label>
        </div>
      )}

      {form.method === 'other' && <label className="block"><span className="text-sm text-gray-300 mb-2 block">Describe el método de pago</span><textarea value={form.otherMethodDescription || ''} onChange={(e) => setValue('otherMethodDescription', e.target.value)} className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3" rows={4} /></label>}

      <div className="space-y-1">{Object.entries(errors).filter(([k]) => k !== 'global').map(([key, msg]) => <ErrorText key={key} text={msg} />)}</div>
      {state === 'saving' && <p className="text-sm text-gray-300">Guardando configuración…</p>}
      {state === 'success' && <p className="text-sm text-green-400 inline-flex gap-2 items-center"><CheckCircle2 className="w-4 h-4" />Configuración guardada correctamente.</p>}
      {errors.global && <p className="text-sm text-red-400 inline-flex gap-2 items-center"><AlertTriangle className="w-4 h-4" />{errors.global}</p>}

      <button type="button" onClick={save} disabled={!canSubmit || state === 'saving'} className="w-full sm:w-auto bg-[#FFC107] text-gray-900 px-6 py-3 rounded-xl font-bold min-h-[44px] disabled:opacity-50">Guardar método de pago</button>
    </div>
  );
}

function BasicDataStep({ formData, updateField }) {
  return (
    <div className="mt-8 space-y-4">
      <h3 className="font-bold text-xl">Paso 1: Cuéntanos sobre ti</h3>
      <p className="text-sm text-gray-400">Estos datos son necesarios para contactarte y validar tu registro.</p>
      <FormField name="nombre" value={formData.nombre} onChange={updateField} label="Nombre" />
      <FormField name="apellido" value={formData.apellido} onChange={updateField} label="Apellido" />
      <FormField name="cedula" value={formData.cedula} onChange={updateField} label="Cédula" inputMode="numeric" />
      <FormField name="telefono" value={formData.telefono} onChange={updateField} label="Teléfono" type="tel" inputMode="tel" />
    </div>
  );
}

function OperationDataStep({ formData, updateField, isPlatformSelected, togglePlatform }) {
  return (
    <div className="mt-8 space-y-4">
      <h3 className="font-bold text-xl">Paso 2: Tu operación diaria</h3>
      <p className="text-sm text-gray-400">Responde estas preguntas para recomendarte campañas adecuadas.</p>
      <FormField name="marca" value={formData.marca} onChange={updateField} label="Marca" />
      <FormField name="modelo" value={formData.modelo} onChange={updateField} label="Modelo" />
      <FormField name="ano" value={formData.ano} onChange={updateField} label="Año" inputMode="numeric" />
      <FormField name="placa" value={formData.placa} onChange={updateField} label="Placa" />

      <label className="block text-sm text-gray-300">¿En qué plataforma(s) trabajas actualmente?</label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {['Uber', 'InDrive', 'DiDi', 'Otra'].map((platform) => (
          <button key={platform} type="button" onClick={() => togglePlatform(platform)} className={`rounded-xl border px-3 py-2 text-sm min-h-[44px] transition ${isPlatformSelected(platform) ? 'border-[#FFC107] bg-[#FFC107]/20 text-[#FFC107]' : 'border-gray-700 bg-gray-900 text-gray-300 hover:border-gray-500'}`}>{platform}</button>
        ))}
      </div>

      <FormField name="horasDiarias" value={formData.horasDiarias} onChange={updateField} label="¿Cuántas horas conduces por día?" inputMode="numeric" />
      <FormField name="diasSemana" value={formData.diasSemana} onChange={updateField} label="¿Cuántos días a la semana manejas?" inputMode="numeric" />
      <FormField name="ciudad" value={formData.ciudad} onChange={updateField} label="Ciudad" />
      <SelectField name="horario" value={formData.horario} onChange={updateField} label="Horario" options={[{ value: '', label: 'Selecciona horario' }, { value: 'Mañana', label: 'Mañana' }, { value: 'Tarde', label: 'Tarde' }, { value: 'Noche', label: 'Noche' }, { value: 'Mixto', label: 'Mixto' }]} />
      <SelectField name="tieneTablet" value={formData.tieneTablet} onChange={updateField} label="¿Tiene tablet?" options={[{ value: '', label: 'Selecciona una opción' }, { value: 'Sí', label: 'Sí' }, { value: 'No', label: 'No' }]} />
      <SelectField name="experienciaVentas" value={formData.experienciaVentas} onChange={updateField} label="¿Tiene experiencia en ventas?" options={[{ value: '', label: 'Selecciona una opción' }, { value: 'Sí', label: 'Sí' }, { value: 'No', label: 'No' }]} />
    </div>
  );
}

function RegisterSummary({ formData, submitMessage, isSubmitting, submitRegister }) {
  return (
    <div className="mt-8 rounded-2xl border border-[#FFC107]/40 bg-[#FFC107]/10 p-6">
      <h3 className="font-bold text-xl mb-2">Paso 4: Confirmación y envío</h3>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300">
        <p><strong>Nombre:</strong> {formData.nombre} {formData.apellido}</p><p><strong>Cédula:</strong> {formData.cedula}</p>
        <p><strong>Teléfono:</strong> {formData.telefono}</p><p><strong>Vehículo:</strong> {formData.marca} {formData.modelo} ({formData.ano})</p>
        <p><strong>Placa:</strong> {formData.placa}</p><p><strong>Plataformas:</strong> {formData.plataformas}</p>
      </div>
      {submitMessage && <p className="mt-3 text-sm text-[#FFC107]">{submitMessage}</p>}
      <button onClick={submitRegister} disabled={isSubmitting} className="mt-4 bg-[#FFC107] text-gray-900 px-6 py-3 rounded-xl font-bold disabled:opacity-50 min-h-[44px]">{isSubmitting ? 'Enviando...' : 'Finalizar registro'}</button>
    </div>
  );
}

function FormField({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-300 mb-2 block">{label}</span>
      <input {...props} className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 focus:outline-none focus:border-[#FFC107]" />
    </label>
  );
}

function SelectField({ label, options, ...props }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-300 mb-2 block">{label}</span>
      <select {...props} className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3">{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select>
    </label>
  );
}

function UploadField({ label, icon: Icon }) {
  return (
    <label className="rounded-xl border border-dashed border-gray-600 bg-gray-900 p-4 flex items-center gap-3 cursor-pointer">
      <Icon className="w-5 h-5 text-[#FFC107]" />
      <span className="text-sm">{label}</span>
      <input type="file" className="hidden" />
    </label>
  );
}

function ErrorText({ text }) {
  return <p className="text-sm text-red-400">• {text}</p>;
}

function LineChart({ data }) {
  const width = 560;
  const height = 180;
  const max = Math.max(...data.map((d) => d.total));
  const stepX = width / (data.length - 1);
  const points = data.map((d, i) => {
    const x = i * stepX;
    const y = height - (d.total / max) * (height - 20) - 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44">
      <polyline fill="none" stroke="#FFC107" strokeWidth="4" points={points} />
      {data.map((d, i) => {
        const x = i * stepX;
        const y = height - (d.total / max) * (height - 20) - 10;
        return <g key={d.id}><circle cx={x} cy={y} r="4" fill="#FFC107" /><text x={x} y={height - 2} fill="#9CA3AF" fontSize="10" textAnchor="middle">{d.month.slice(0, 3)}</text></g>;
      })}
    </svg>
  );
}
