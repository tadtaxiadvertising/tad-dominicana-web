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
  .animate-fade-in { animation: fadeIn 0.35s ease-out forwards; }
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
            <div className="hidden md:flex items-center gap-4 lg:gap-6">
              {currentView === 'landing' && (
                <>
                  <a href="#como-funciona" className="text-sm hover:text-[#FFC107]">Cómo funciona</a>
                  <a href="#ganancias" className="text-sm hover:text-[#FFC107]">Calcula tus ganancias</a>
                </>
              )}
              {currentView === 'dashboard' ? (
                <button onClick={() => navigateTo('landing')} className="text-red-400 hover:text-red-300 inline-flex items-center gap-2 min-h-[44px] px-3">
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
      <section className="py-12 md:py-20 text-center px-4">
        <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight">Tu Vehículo, <span className="text-[#FFC107]">Tu Plataforma de Ingresos</span></h1>
        <p className="mt-4 md:mt-6 max-w-3xl mx-auto text-gray-400 text-base md:text-lg">Gana RD$500 por anuncio activo y RD$500 por comisión de venta.</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button onClick={() => navigateTo('register')} className="bg-[#FFC107] text-gray-900 font-bold px-6 py-3 rounded-full hover:bg-yellow-300 min-h-[44px]">Regístrate</button>
          <button onClick={() => navigateTo('login')} className="border border-gray-600 px-6 py-3 rounded-full hover:border-[#FFC107] hover:text-[#FFC107] min-h-[44px]">Acceso de Conductor</button>
        </div>
      </section>
    </div>
  );
}

function LoginView({ navigateTo }) {
  const handleAuth = (e) => {
    e.preventDefault();
    navigateTo('dashboard');
  };

  return (
    <div className="min-h-[80vh] px-4 py-8 md:py-12 flex items-center justify-center animate-fade-in">
      <div className="max-w-md w-full rounded-3xl border border-gray-700 bg-gray-800 p-6 md:p-8 shadow-xl">
        <h2 className="text-2xl font-bold text-center">Acceso de Conductor</h2>
        <form className="mt-6 space-y-4" onSubmit={handleAuth}>
          <Field label="Teléfono (WhatsApp)" type="tel" name="phone" placeholder="8490000000" required />
          <Field label="Contraseña" type="password" name="password" placeholder="••••••••" required />
          <button type="submit" className="w-full bg-[#FFC107] text-gray-900 py-3 rounded-xl font-bold hover:bg-yellow-300 transition min-h-[44px]">Entrar al portal</button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm text-gray-300 mb-2 block">{label}</span>
      <input {...props} className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 focus:outline-none focus:border-[#FFC107]" />
    </label>
  );
}

function RegisterView({ navigateTo }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ nombre: '', apellido: '', cedula: '', telefono: '', ciudad: '' });

  const hasMissing = Object.values(formData).some((value) => !String(value).trim());
  const updateField = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="min-h-[80vh] px-4 py-8 md:py-10 animate-fade-in">
      <div className="max-w-3xl mx-auto rounded-3xl border border-gray-700 bg-gray-800 p-5 md:p-8">
        <h2 className="text-2xl md:text-3xl font-bold">Registro de Conductor TAD</h2>
        <div className="flex gap-2 mt-6">{[1, 2].map((n) => <div key={n} className={`h-2 flex-1 rounded-full ${step >= n ? 'bg-[#FFC107]' : 'bg-gray-700'}`} />)}</div>

        {step === 1 && (
          <div className="mt-6 space-y-4">
            <h3 className="font-bold text-xl">Paso 1: Datos básicos</h3>
            <Field label="Nombre" name="nombre" value={formData.nombre} onChange={updateField} required />
            <Field label="Apellido" name="apellido" value={formData.apellido} onChange={updateField} required />
            <Field label="Cédula" type="number" inputMode="numeric" name="cedula" value={formData.cedula} onChange={updateField} required />
            <Field label="Teléfono" type="tel" inputMode="tel" name="telefono" value={formData.telefono} onChange={updateField} required />
            <Field label="Ciudad" name="ciudad" value={formData.ciudad} onChange={updateField} required />
          </div>
        )}

        {step === 2 && (
          <div className="mt-6">
            <h3 className="font-bold text-xl mb-3">Paso 2: Configurar método de pago</h3>
            <PaymentMethodConfigurator onSaved={() => navigateTo('login')} />
          </div>
        )}

        <div className="mt-8 flex justify-between gap-3">
          <button onClick={() => setStep(1)} className="px-4 py-2 text-gray-300 min-h-[44px]" disabled={step === 1}>Atrás</button>
          <button onClick={() => setStep(2)} className="px-6 py-3 rounded-xl bg-[#FFC107] text-gray-900 font-bold disabled:opacity-50 min-h-[44px]" disabled={step === 2 || hasMissing}>Siguiente</button>
        </div>
      </div>
    </div>
  );
}

function PaymentMethodConfigurator({ onSaved }) {
  const [form, setForm] = useState({ method: '', accountType: '', acceptTerms: false });
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle');

  const setValue = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));
  const validationErrors = validatePaymentData(form);
  const canSubmit = Object.keys(validationErrors).length === 0 && !!form.method;

  const save = async () => {
    const newErrors = validatePaymentData(form);
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

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
      onSaved?.();
    } catch (error) {
      setState('error');
      setErrors((prev) => ({ ...prev, global: error.message }));
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {paymentOptions.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" onClick={() => { setValue('method', id); setErrors({}); }} className={`rounded-2xl border p-4 text-left min-h-[88px] transition ${form.method === id ? 'border-[#FFC107] bg-[#FFC107]/10' : 'border-gray-700 bg-gray-900 hover:border-gray-500'}`}>
            <Icon className="w-5 h-5 mb-2 text-[#FFC107]" />
            <p className="font-semibold">{label}</p>
          </button>
        ))}
      </div>
      {errors.method && <ErrorText text={errors.method} />}

      {(form.method === 'bank_deposit' || form.method === 'bank_transfer') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Field label="Banco" name="bankName" value={form.bankName || ''} onChange={(e) => setValue('bankName', e.target.value)} />
          <label className="block"><span className="text-sm text-gray-300 mb-2 block">Tipo de cuenta</span>
            <select value={form.accountType || ''} onChange={(e) => setValue('accountType', e.target.value)} className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3">
              <option value="">Seleccionar</option><option value="ahorros">Ahorros</option><option value="corriente">Corriente</option>
            </select></label>
          <Field label="Número de cuenta" type="text" inputMode="numeric" name="accountNumber" value={form.accountNumber || ''} onChange={(e) => setValue('accountNumber', e.target.value.replace(/\D/g, ''))} />
          <Field label="Titular" name="accountHolder" value={form.accountHolder || ''} onChange={(e) => setValue('accountHolder', e.target.value)} />
          <Field label="Cédula / ID" type="text" inputMode="numeric" name="identification" value={form.identification || ''} onChange={(e) => setValue('identification', e.target.value.replace(/\D/g, ''))} />
          <Field label="Teléfono de contacto" type="tel" inputMode="tel" name="contactPhone" value={form.contactPhone || ''} onChange={(e) => setValue('contactPhone', e.target.value.replace(/\D/g, ''))} />
        </div>
      )}

      {form.method === 'cash_pickup' && (
        <div className="space-y-3 rounded-2xl border border-gray-700 p-4 bg-gray-900">
          <p className="text-sm text-gray-400">El pago en efectivo estará disponible en los puntos autorizados por la plataforma.</p>
          <Field label="Punto de retiro preferido" name="pickupPoint" value={form.pickupPoint || ''} onChange={(e) => setValue('pickupPoint', e.target.value)} />
          <Field label="Ciudad" name="city" value={form.city || ''} onChange={(e) => setValue('city', e.target.value)} />
          <label className="inline-flex gap-2 items-start text-sm"><input type="checkbox" checked={!!form.acceptTerms} onChange={(e) => setValue('acceptTerms', e.target.checked)} />Acepto términos y condiciones para pago en efectivo.</label>
        </div>
      )}

      {form.method === 'other' && (
        <label className="block"><span className="text-sm text-gray-300 mb-2 block">Describe el método de pago</span>
          <textarea value={form.otherMethodDescription || ''} onChange={(e) => setValue('otherMethodDescription', e.target.value)} className="w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3" rows={4} />
        </label>
      )}

      <div className="space-y-1">{Object.entries(errors).filter(([k]) => k !== 'global').map(([key, msg]) => <ErrorText key={key} text={msg} />)}</div>
      {state === 'saving' && <p className="text-sm text-gray-300">Guardando configuración…</p>}
      {state === 'success' && <p className="text-sm text-green-400 inline-flex gap-2 items-center"><CheckCircle2 className="w-4 h-4" />Configuración guardada correctamente.</p>}
      {errors.global && <p className="text-sm text-red-400 inline-flex gap-2 items-center"><AlertTriangle className="w-4 h-4" />{errors.global}</p>}

      <button type="button" onClick={save} disabled={!canSubmit || state === 'saving'} className="w-full sm:w-auto bg-[#FFC107] text-gray-900 px-6 py-3 rounded-xl font-bold min-h-[44px] disabled:opacity-50">Guardar método de pago</button>
    </div>
  );
}

function ErrorText({ text }) {
  return <p className="text-sm text-red-400">• {text}</p>;
}

function DashboardView() {
  const [tab, setTab] = useState('inicio');
  const [monthFilter, setMonthFilter] = useState('Todos');
  const payments = [
    { id: 1, month: 'Enero', ads: 8, sales: 2 },
    { id: 2, month: 'Febrero', ads: 10, sales: 3 },
    { id: 3, month: 'Marzo', ads: 12, sales: 2 },
  ].map((row) => ({ ...row, total: row.ads * financeData.pagoPorAnuncio + row.sales * financeData.comisionVenta }));
  const filteredPayments = useMemo(() => payments.filter((p) => monthFilter === 'Todos' || p.month === monthFilter), [monthFilter]);
  const tabs = [{ id: 'inicio', label: 'Inicio', icon: Home }, { id: 'perfil', label: 'Mi Perfil', icon: User }, { id: 'ganancias', label: 'Mis Ganancias', icon: CircleDollarSign }, { id: 'soporte', label: 'Soporte', icon: HelpCircle }];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 pb-24 md:pb-8 md:grid md:grid-cols-[230px_1fr] gap-6">
      <aside className="hidden md:block bg-gray-900 border border-gray-800 rounded-2xl p-3 h-fit sticky top-24">{tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl mb-2 min-h-[44px] ${tab === id ? 'bg-[#FFC107] text-gray-900 font-bold' : 'text-gray-300 hover:bg-gray-800'}`}><Icon className="w-5 h-5" /> {label}</button>)}</aside>
      <section>
        {tab === 'inicio' && <h2 className="text-3xl font-bold">Inicio</h2>}
        {tab === 'perfil' && <div className="space-y-4"><h2 className="text-3xl font-bold">Mi Perfil</h2><PaymentMethodConfigurator /></div>}
        {tab === 'ganancias' && <div className="space-y-4"><h2 className="text-3xl font-bold">Mis Ganancias</h2><div className="rounded-2xl border border-gray-700 bg-gray-900 overflow-hidden"><div className="p-4 border-b border-gray-800 flex items-center justify-between"><h3 className="font-bold">Historial de pagos</h3><select value={monthFilter} onChange={(e) => setMonthFilter(e.target.value)} className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm"><option>Todos</option>{payments.map((p) => <option key={p.id}>{p.month}</option>)}</select></div><div className="hidden md:block overflow-x-auto"><table className="w-full text-sm"><thead className="bg-gray-800/60 text-gray-300"><tr><th className="text-left p-3">Mes</th><th className="text-left p-3">Anuncios</th><th className="text-left p-3">Comisiones</th><th className="text-left p-3">Total</th></tr></thead><tbody>{filteredPayments.map((row) => <tr key={row.id} className="border-t border-gray-800"><td className="p-3">{row.month}</td><td className="p-3">RD${row.ads * financeData.pagoPorAnuncio}</td><td className="p-3">RD${row.sales * financeData.comisionVenta}</td><td className="p-3 text-[#FFC107] font-bold">RD${row.total.toLocaleString('es-DO')}</td></tr>)}</tbody></table></div><div className="md:hidden p-4 space-y-3">{filteredPayments.map((row) => <article key={row.id} className="rounded-xl border border-gray-700 p-3 bg-gray-800/40"><p className="font-bold">{row.month}</p><p className="text-sm text-gray-300">Anuncios: RD${row.ads * financeData.pagoPorAnuncio}</p><p className="text-sm text-gray-300">Comisiones: RD${row.sales * financeData.comisionVenta}</p><p className="text-sm text-[#FFC107] font-bold">Total: RD${row.total.toLocaleString('es-DO')}</p></article>)}</div></div></div>}
        {tab === 'soporte' && <a href="https://wa.me/18495043872" className="inline-flex items-center gap-2 bg-[#FFC107] text-gray-900 px-6 py-3 rounded-xl font-bold min-h-[44px]"><Phone className="w-5 h-5" /> WhatsApp</a>}
      </section>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 grid grid-cols-4">{tabs.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setTab(id)} className={`py-3 text-[11px] flex flex-col items-center gap-1 min-h-[44px] ${tab === id ? 'text-[#FFC107]' : 'text-gray-400'}`}><Icon className="w-4 h-4" /> {label}</button>)}</nav>
    </div>
  );
}
