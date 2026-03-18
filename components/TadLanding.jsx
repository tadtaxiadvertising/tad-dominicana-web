'use client';

import React, { useMemo, useState, useEffect } from 'react';
import {
  Play,
  ChevronRight,
  Monitor,
  Wrench,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  LogOut,
  User,
  Car,
  FileText,
  Share2,
  TrendingUp,
  Smartphone,
  ShieldCheck,
  Menu,
  X,
  HelpCircle,
  BadgeCheck,
  CreditCard,
  ChevronDown,
} from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';

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
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #FFD400; border-radius: 4px; }
`;

const faqItems = [
  {
    question: '¿Cuánto cuesta afiliarme a TAD?',
    answer: 'La suscripción a la plataforma tiene un costo anual de RD$6,000.',
  },
  {
    question: '¿Cuánto dinero gano por usar la tablet?',
    answer: 'Generas ingresos mediante pagos mensuales de RD$500 por cada anuncio activo en tu pantalla.',
  },
  {
    question: '¿Qué pasa si entro a un túnel o pierdo la señal de internet?',
    answer: 'No te preocupes. Los videos se descargan localmente en la tablet y continúan reproduciendo offline sin consumir tus datos.',
  },
  {
    question: '¿Cómo activo mi tablet después de registrarme?',
    answer: 'Una vez llenes el formulario y pagues tu suscripción, nuestro sistema validará el pago y un administrador activará tu dispositivo de forma remota.',
  },
];

const activationSteps = [
  {
    title: 'Paso 1',
    text: 'Completa tus datos.',
    icon: User,
  },
  {
    title: 'Paso 2',
    text: 'Realiza el pago de RD$6,000 vía enlace de WhatsApp.',
    icon: CreditCard,
  },
  {
    title: 'Paso 3',
    text: 'Un administrador te activará remotamente.',
    icon: BadgeCheck,
  },
];

const formatPhoneInput = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  const p1 = digits.slice(0, 3);
  const p2 = digits.slice(3, 6);
  const p3 = digits.slice(6, 10);

  if (digits.length <= 3) return p1;
  if (digits.length <= 6) return `${p1}-${p2}`;
  return `${p1}-${p2}-${p3}`;
};

const validators = {
  nombreCompleto: (value) => {
    const trimmed = value.trim().replace(/\s+/g, ' ');
    if (!trimmed) return 'Escribe tu nombre y apellido para continuar.';
    const parts = trimmed.split(' ');
    if (parts.length < 2) return 'Ingresa al menos un nombre y un apellido.';
    if (parts.some((part) => part.length < 2)) return 'Cada parte del nombre debe tener al menos 2 letras.';
    return '';
  },
  cedula: (value) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return 'Ingresa tu cédula para validar tu registro.';
    if (digits.length !== 11) return 'La cédula debe tener 11 dígitos.';
    return '';
  },
  telefono: (value) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return 'Ingresa tu número de WhatsApp.';
    if (digits.length !== 10) return 'El teléfono debe tener 10 dígitos.';
    if (!/^(809|829|849)/.test(digits)) return 'El teléfono debe iniciar con 809, 829 o 849.';
    return '';
  },
  ficha: (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 'Ingresa tu número de ficha asignado por tu base.';
    if (!/^\d{1,6}$/.test(trimmed)) return 'La ficha debe contener solo números.';
    return '';
  },
  marca: (value) => (!value.trim() ? 'Indica la marca o modelo de tu vehículo.' : ''),
  ano: (value) => {
    if (!value) return 'Ingresa el año de tu vehículo.';
    const year = Number(value);
    const currentYear = new Date().getFullYear() + 1;
    if (!Number.isInteger(year) || year < 1990 || year > currentYear) return `Ingresa un año válido entre 1990 y ${currentYear}.`;
    return '';
  },
  placa: (value) => {
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (!cleaned) return 'Ingresa la placa del vehículo.';
    if (!/^[A-Z]\d{6}$/.test(cleaned)) return 'La placa debe empezar con una letra seguida de 6 números.';
    return '';
  },
  aplicacion: (value) => (!value ? 'Selecciona tu modalidad principal de trabajo.' : ''),
};

const fieldLabels = {
  nombreCompleto: 'Nombre completo',
  cedula: 'Cédula',
  telefono: 'Teléfono (WhatsApp)',
  ficha: 'Número de ficha / taxi',
  marca: 'Marca / modelo',
  ano: 'Año',
  placa: 'Placa del vehículo',
  aplicacion: 'Aplicación principal',
};

const LogoTAD = ({ className = 'w-32 h-auto' }) => (
  <svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M40 15H80C82.7614 15 85 17.2386 85 20V40C85 42.7614 82.7614 45 80 45H40C37.2386 45 35 42.7614 35 40V20C35 17.2386 37.2386 15 40 15Z" stroke="#FFD400" strokeWidth="4"/>
    <path d="M55 22L68 30L55 38V22Z" fill="#FFD400"/>
    <path d="M15 22H30" stroke="#FFD400" strokeWidth="4" strokeLinecap="round"/>
    <path d="M25 30H30" stroke="#FFD400" strokeWidth="4" strokeLinecap="round"/>
    <path d="M10 30H15" stroke="#FFD400" strokeWidth="4" strokeLinecap="round"/>
    <path d="M20 38H30" stroke="#FFD400" strokeWidth="4" strokeLinecap="round"/>
    <text x="95" y="40" fill="#FFFFFF" fontFamily="sans-serif" fontSize="32" fontWeight="bold" letterSpacing="2">TAD</text>
  </svg>
);

function ProgressTracker() {
  return (
    <section className="py-10 md:py-14 border-t border-[#23232b] bg-[#0b0c10]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#FFD400]">Actívate en 3 pasos</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">Proceso simple para estar online en TAD</h2>
          </div>
          <p className="text-sm md:text-base text-gray-400 max-w-xl">
            Diseñado para choferes que se registran desde el celular, con claridad en cada paso antes del pago y la activación.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {activationSteps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="relative rounded-[30px] border border-[#25252d] bg-[#121318] p-5 md:p-6 shadow-lg shadow-black/20">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-[#FFD400] text-gray-900 shadow-[0_0_22px_rgba(255,215,0,0.28)]">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#FFD400]">{item.title}</p>
                    <p className="mt-1 text-base font-semibold text-white">{item.text}</p>
                  </div>
                </div>
                <div className="mt-4 h-2 w-full rounded-full bg-[#1e2027] overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#FFD400] to-yellow-300" style={{ width: `${(index + 1) * 33.33}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [openItem, setOpenItem] = useState(0);

  return (
    <section className="py-20 bg-[#0d0e12] border-t border-[#23232b]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD400]/20 bg-[#FFD400]/10 px-4 py-2 text-sm text-[#FFD400]">
            <HelpCircle className="w-4 h-4" />
            Preguntas frecuentes para choferes
          </div>
          <h2 className="mt-4 text-3xl font-bold text-white">Aclara tus dudas antes de escribir a soporte</h2>
          <p className="mt-3 text-gray-400">
            Respuestas directas sobre afiliación, pagos, conectividad y activación de tu tablet.
          </p>
        </div>

        <div className="space-y-4">
          {faqItems.map((item, index) => {
            const isOpen = openItem === index;
            return (
              <div key={item.question} className="rounded-[28px] border border-[#25252d] bg-[#121318] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenItem(isOpen ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6"
                >
                  <span className="text-base md:text-lg font-semibold text-white">{item.question}</span>
                  <ChevronDown className={`w-5 h-5 text-[#FFD400] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className="border-t border-gray-800 px-5 py-4 md:px-6 animate-fade-in">
                    <p className="text-sm md:text-base leading-7 text-gray-300">{item.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function TadLandingApp() {
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
    <div className="min-h-screen bg-[#09090c] text-gray-200 font-sans selection:bg-[#FFD400] selection:text-gray-900 flex flex-col relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,215,0,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(255,255,255,0.04),transparent_22%),linear-gradient(180deg,#111114_0%,#09090c_100%)]" />
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden xl:block w-[320px] border-r border-white/5 bg-[linear-gradient(180deg,rgba(255,215,0,0.08),rgba(255,215,0,0.02)_18%,rgba(255,255,255,0.01))]" />
      <nav className="sticky top-0 z-50 bg-[#121216]/88 backdrop-blur-xl border-b border-[#2a2a31]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => navigateTo('landing')}>
              <LogoTAD />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              {currentView === 'landing' && (
                <>
                  <a href="#como-funciona" className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500 hover:text-[#FFD400] transition-colors">Cómo Funciona</a>
                  <a href="#ganancias" className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500 hover:text-[#FFD400] transition-colors">Calculadora</a>
                  <a href="#faq" className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500 hover:text-[#FFD400] transition-colors">FAQ</a>
                </>
              )}
              {currentView === 'dashboard' ? (
                <button onClick={() => navigateTo('landing')} className="flex items-center text-sm font-medium text-[#FFD400] hover:text-red-300 transition-colors">
                  <LogOut className="w-4 h-4 mr-2" /> Cerrar Sesión
                </button>
              ) : (
                <button onClick={() => navigateTo('login')} className="border border-[#2e2e36] bg-[#17171c] text-[#FFD400] px-6 py-3 rounded-[22px] font-black text-xs uppercase tracking-[0.25em] hover:border-[#FFD400]/40 hover:bg-[#1b1b22] transition-all shadow-[0_0_30px_rgba(255,215,0,0.08)]">
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
          <div className="md:hidden bg-[#111114] border-b border-[#26262d] animate-fade-in">
            <div className="px-2 pt-2 pb-4 space-y-1 sm:px-3">
              {currentView === 'landing' && (
                <>
                  <a href="#como-funciona" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300">Cómo funciona</a>
                  <a href="#ganancias" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300">Calculadora</a>
                  <a href="#faq" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-gray-300">FAQ</a>
                </>
              )}
              {currentView === 'dashboard' ? (
                <button onClick={() => navigateTo('landing')} className="block w-full text-left px-3 py-2 text-[#FFD400] font-medium">Cerrar Sesión</button>
              ) : (
                <button onClick={() => navigateTo('login')} className="block w-full text-center mt-4 bg-[#FFD400] text-gray-900 px-4 py-3 rounded-md font-bold">
                  Área del Conductor
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {currentView === 'landing' && <LandingView navigateTo={navigateTo} />}
        {currentView === 'login' && <LoginView navigateTo={navigateTo} />}
        {currentView === 'register' && <RegisterView navigateTo={navigateTo} />}
        {currentView === 'dashboard' && <DashboardView />}
      </main>

      <footer className="bg-[#101014] border-t border-[#23232b] py-8 mt-auto relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <LogoTAD className="w-24 h-auto mx-auto mb-4 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all" />
          <p className="text-zinc-500 text-sm">
            TAD © 2026. Todos los derechos reservados.<br/>
            Contratos regidos por el Código Civil de la República Dominicana.<br/>
            Modelo de Colaboración Independiente.
          </p>
        </div>
      </footer>

      <a href="https://wa.me/18495043872?text=Hola,%20quiero%20más%20información%20sobre%20cómo%20ser%20conductor%20TAD." target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-400 hover:scale-110 transition-all animate-bounce z-50 flex items-center justify-center">
        <Smartphone className="w-6 h-6" />
      </a>
      <SpeedInsights />
    </div>
  );
}

function LandingView({ navigateTo }) {
  return (
    <div className="animate-fade-in">
      <section className="relative py-20 lg:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,215,0,0.12),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-8 items-center">
            <div className="text-center xl:text-left">
              <div className="inline-flex items-center gap-3 rounded-full border border-[#2e2e36] bg-[#141419] px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-gray-400">
                <span className="h-2.5 w-2.5 rounded-full bg-[#FFD400] shadow-[0_0_16px_rgba(255,215,0,0.85)]" />
                Plataforma TAD Driver Node
              </div>
              <h1 className="mt-6 text-4xl md:text-6xl font-black italic uppercase leading-[0.95] tracking-tight text-white">
                Tu Vehículo,<br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ffffff] via-[#FFD400] to-[#FFD400]">Tu Valla Digital</span>
              </h1>
              <p className="mt-5 text-lg md:text-xl text-gray-400 max-w-2xl xl:max-w-xl mx-auto xl:mx-0 mb-10">
            Gana dinero extra mientras conduces. Instalamos tablets de 10" para entretener a tus pasajeros y generar ingresos por publicidad. El ecosistema más rentable para choferes en RD.
              </p>
              <div className="flex flex-col sm:flex-row justify-center xl:justify-start items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button onClick={() => navigateTo('register')} className="w-full sm:w-auto bg-[#FFD400] text-gray-900 px-8 py-4 rounded-[24px] font-black text-sm uppercase tracking-[0.2em] hover:bg-yellow-400 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,215,0,0.35)] flex items-center justify-center">
                  Comenzar Ahora <ChevronRight className="ml-2 w-5 h-5" />
                </button>
                <a href="#faq" className="w-full sm:w-auto border border-[#2d2d35] bg-[#131318] px-8 py-4 rounded-[24px] text-sm font-black uppercase tracking-[0.2em] text-gray-300 hover:border-[#FFD400]/30 hover:text-white transition-all text-center">
                  Ver FAQ
                </a>
              </div>
            </div>
            <div className="rounded-[32px] border border-[#2a2a31] bg-[#101014]/90 p-6 md:p-8 shadow-[0_40px_80px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between gap-4 border-b border-white/5 pb-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">Estado del sistema</p>
                  <h3 className="mt-2 text-3xl font-black italic uppercase text-white">Driver Telemetry</h3>
                </div>
                <div className="rounded-2xl bg-[#FFD400] p-4 shadow-[0_0_24px_rgba(255,215,0,0.35)]">
                  <Smartphone className="w-8 h-8 text-gray-900" />
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {[
                  ['Pago anual', 'RD$6,000', 'Nominal'],
                  ['Ganancia por anuncio', 'RD$500', 'Activo'],
                  ['Activación', 'Remota', 'Online'],
                  ['Soporte', 'WhatsApp', 'Directo'],
                ].map(([label, value, chip]) => (
                  <div key={label} className="rounded-[28px] border border-[#24242b] bg-[#0d0d12] p-5">
                    <div className="inline-flex rounded-full border border-[#3a3100] bg-[#2a2200]/40 px-3 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-[#FFD400]">
                      {chip}
                    </div>
                    <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-zinc-500">{label}</p>
                    <p className="mt-2 text-2xl font-black italic text-white">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ProgressTracker />

      <section id="como-funciona" className="py-20 bg-[#0f1014] border-y border-[#23232b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">El Modelo de Negocio</h2>
            <p className="mt-4 text-gray-400">Transparente, rentable y diseñado para tu beneficio.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-[#131318] p-8 rounded-[30px] border border-[#25252d] hover:border-[#FFD400]/40 transition-all hover:-translate-y-2">
              <div className="bg-[#0b0b0f] w-14 h-14 rounded-[20px] flex items-center justify-center mb-6 border border-[#26262d]">
                <ShieldCheck className="w-7 h-7 text-[#FFD400]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">1. Suscripción Anual</h3>
              <p className="text-gray-400">
                Inversión única de <span className="text-[#FFD400] font-bold">RD$6,000</span>. Cubre tu Kit Tecnológico (Tablet 10", Soporte, Cargador) y mantenimiento por 12 meses.
              </p>
            </div>
            <div className="bg-[#131318] p-8 rounded-[30px] border border-[#25252d] hover:border-[#FFD400]/40 transition-all hover:-translate-y-2 delay-100">
              <div className="bg-[#0b0b0f] w-14 h-14 rounded-[20px] flex items-center justify-center mb-6 border border-[#26262d]">
                <Wrench className="w-7 h-7 text-[#FFD400]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">2. Instalación Pro</h3>
              <p className="text-gray-400">
                Técnico a domicilio o en punto de encuentro. Instalación rápida, sin cables a la vista y lista para operar con FullyKiosk.
              </p>
            </div>
            <div className="bg-[#131318] p-8 rounded-[30px] border border-[#25252d] hover:border-[#FFD400]/40 transition-all hover:-translate-y-2 delay-200">
              <div className="bg-[#0b0b0f] w-14 h-14 rounded-[20px] flex items-center justify-center mb-6 border border-[#26262d]">
                <TrendingUp className="w-7 h-7 text-[#FFD400]" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">3. Ingresos Pasivos</h3>
              <p className="text-gray-400">
                Ganas por cada anuncio que se reproduce en tu vehículo y comisiones infinitas por referir marcas.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="ganancias" className="py-20 bg-[#111827]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 md:p-12 border border-gray-700 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
              <DollarSign className="w-64 h-64 text-[#FFD400]" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2 relative z-10">Calculadora de Ganancias</h2>
            <p className="text-gray-400 mb-8 relative z-10">Simula tus ingresos mensuales. (Máximo 15 anuncios simultáneos por vehículo).</p>
            <Calculator />
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-[#111827] to-gray-900 border-t border-gray-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-[#FFD400]/20 bg-[#FFD400]/10 p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-[#FFD400] font-semibold">Registro guiado</p>
              <h3 className="text-2xl font-bold text-white mt-2">Evita errores antes de enviar tus datos</h3>
              <p className="text-gray-300 mt-2 max-w-2xl">
                El formulario ahora incluye ejemplos, validaciones en tiempo real y avisos claros para que completes el pago sin fricciones.
              </p>
            </div>
            <button onClick={() => navigateTo('register')} className="w-full md:w-auto bg-[#FFD400] text-gray-900 px-6 py-4 rounded-2xl font-bold hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(255,215,0,0.2)]">
              Ir al registro optimizado
            </button>
          </div>
        </div>
      </section>

      <div id="faq">
        <FAQSection />
      </div>
    </div>
  );
}

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
            <span className="text-[#FFD400] font-bold">{ads}</span>
          </label>
          <input type="range" min="0" max="15" value={ads} onChange={(e) => setAds(Number(e.target.value))} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#FFD400]" />
          <div className="flex justify-between text-xs text-zinc-500">
            <span>0</span>
            <span>Máx 15</span>
          </div>
        </div>
        <div className="space-y-4">
          <label className="flex justify-between text-sm font-medium text-gray-300">
            <span>Ventas Propias (RD$500 c/u)</span>
            <span className="text-[#FFD400] font-bold">{sales}</span>
          </label>
          <input type="number" min="0" value={sales} onChange={(e) => setSales(Math.max(0, Number(e.target.value)))} className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-[#FFD400] transition-colors" placeholder="Ej: 2" />
          <p className="text-xs text-zinc-500">Comisiones ilimitadas si tú traes al cliente.</p>
        </div>
      </div>
      <div className="bg-gray-900/80 rounded-2xl p-6 border border-gray-700/50 flex flex-col md:flex-row items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">Ganancia Mensual Proyectada</p>
          <p className="text-4xl font-extrabold text-[#FFD400]"> RD$ {totalIncome.toLocaleString()} </p>
        </div>
        <div className="mt-4 md:mt-0 text-right md:border-l border-gray-700 md:pl-8">
          <p className="text-gray-400 text-sm mb-1">Retorno de Inversión (RD$6,000)</p>
          <p className="text-xl font-bold text-white"> {roiMonths === '---' ? '---' : `En ${roiMonths} mes${roiMonths > 1 ? 'es' : ''}`} </p>
        </div>
      </div>
      <div className="bg-[#FFD400]/10 border border-[#FFD400]/20 rounded-lg p-4 flex items-start">
        <CheckCircle2 className="w-5 h-5 text-[#FFD400] mt-0.5 mr-3 flex-shrink-0" />
        <p className="text-sm text-white/80"> Recuperas tu inversión de suscripción rápidamente. El resto del año es 100% ganancia pura para ti. </p>
      </div>
    </div>
  );
}

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
            <input type="email" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FFD400] transition-colors" placeholder="chofer@ejemplo.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Contraseña</label>
            <input type="password" required className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FFD400] transition-colors" placeholder="••••••••" />
          </div>
          <button type="submit" className="w-full bg-[#FFD400] text-gray-900 font-bold py-3 rounded-lg hover:bg-yellow-400 transition-colors shadow-lg mt-4">
            Entrar al Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

function RegisterView({ navigateTo }) {
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const [submissionAttempted, setSubmissionAttempted] = useState(false);
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    cedula: '',
    telefono: '',
    ficha: '',
    marca: '',
    ano: '',
    placa: '',
    aplicacion: 'uber',
  });

  const fieldErrors = useMemo(() => Object.fromEntries(
    Object.entries(formData).map(([key, value]) => [key, validators[key] ? validators[key](value) : ''])
  ), [formData]);

  const stepFields = {
    1: ['nombreCompleto', 'cedula', 'telefono', 'ficha'],
    2: ['marca', 'ano', 'placa', 'aplicacion'],
  };

  const getVisibleError = (name) => (touched[name] || submissionAttempted ? fieldErrors[name] : '');
  const isStepValid = (stepNumber) => stepFields[stepNumber].every((field) => !fieldErrors[field]);

  const touchStepFields = (stepNumber) => {
    setTouched((prev) => ({
      ...prev,
      ...Object.fromEntries(stepFields[stepNumber].map((field) => [field, true])),
    }));
  };

  const nextStep = () => {
    touchStepFields(step);
    if (!isStepValid(step)) return;
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let nextValue = value;

    if (name === 'telefono') nextValue = formatPhoneInput(value);
    if (name === 'placa') nextValue = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
    if (name === 'cedula') nextValue = value.replace(/[^0-9-]/g, '').slice(0, 13);
    if (name === 'ficha') nextValue = value.replace(/\D/g, '').slice(0, 6);
    if (name === 'ano') nextValue = value.replace(/\D/g, '').slice(0, 4);

    setFormData((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleBlur = (name) => setTouched((prev) => ({ ...prev, [name]: true }));

  const handleComplete = async () => {
    setSubmissionAttempted(true);
    setTouched((prev) => ({
      ...prev,
      ...Object.fromEntries(Object.keys(formData).map((field) => [field, true])),
    }));

    if (Object.values(fieldErrors).some(Boolean) || !agreed) return;

    setIsSubmitting(true);
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyF5Sk3R51l0J3bP5lgM2_MV6Qs47Wo-a8wQFme5cBpaNUnlH85h5Z37P6_2fXZRDVh/exec';

    try {
      const formPayload = new FormData();
      formPayload.append('nombre', formData.nombreCompleto);
      formPayload.append('apellido', '');
      formPayload.append('cedula', formData.cedula);
      formPayload.append('telefono', formData.telefono);
      formPayload.append('marca', formData.marca);
      formPayload.append('ano', formData.ano);
      formPayload.append('placa', formData.placa);
      formPayload.append('aplicacion', formData.aplicacion);
      formPayload.append('ficha', formData.ficha);

      await fetch(scriptURL, { method: 'POST', body: formPayload, mode: 'no-cors' });

      const message = `Hola, he completado mi registro en el portal TAD a nombre de ${formData.nombreCompleto}, ficha ${formData.ficha}, y deseo proceder con el pago de mi suscripción anual de RD$6,000 para recibir mi Kit Tecnológico.`;
      window.open(`https://wa.me/18495043872?text=${encodeURIComponent(message)}`, '_blank');
      navigateTo('landing');
    } catch (error) {
      console.error('Error al guardar los datos:', error);
      alert('Hubo un error al conectar con la base de datos, pero te redirigiremos a WhatsApp para continuar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const completionRatio = step === 1 ? 33 : step === 2 ? 66 : 100;

  const renderField = ({ name, label, placeholder, helper, type = 'text' }) => {
    const error = getVisibleError(name);
    return (
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">{label}</label>
        <input
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          onBlur={() => handleBlur(name)}
          type={type}
          placeholder={placeholder}
          className={`w-full rounded-2xl border px-4 py-3 text-white placeholder:text-zinc-500 bg-gray-950/80 focus:outline-none transition-colors ${error ? 'border-[#FFD400] focus:border-[#FFD400]' : 'border-gray-700 focus:border-[#FFD400]'}`}
        />
        <p className={`mt-2 text-sm ${error ? 'text-[#FFD400]' : 'text-zinc-500'}`}>{error || helper}</p>
      </div>
    );
  };

  return (
    <div className="min-h-[80vh] px-4 py-8 md:py-12 animate-fade-in">
      <div className="max-w-6xl mx-auto grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6 items-start">
        <div className="bg-[#111216] border border-[#26262d] rounded-[32px] shadow-[0_40px_80px_rgba(0,0,0,0.45)] overflow-hidden">
          <div className="bg-gradient-to-r from-[#0f1014] via-[#111216] to-[#18181f] px-5 py-6 md:px-8 border-b border-[#27272f]">
            <div className="flex flex-col gap-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-[#FFD400] font-semibold">Registro de choferes</p>
                  <h2 className="text-2xl md:text-3xl font-bold text-white mt-2">Completa tu afiliación sin errores</h2>
                  <p className="text-gray-400 mt-2 max-w-2xl">
                    Usa los ejemplos y avisos debajo de cada campo para avanzar rápido desde tu celular y recibir tu enlace de pago por WhatsApp.
                  </p>
                </div>
                <button onClick={() => navigateTo('landing')} className="hidden md:inline-flex text-sm text-gray-400 hover:text-white transition-colors">Volver</button>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                  <span>Formulario guiado</span>
                  <span>{completionRatio}% completado</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-700 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#FFD400] to-yellow-300 transition-all" style={{ width: `${completionRatio}%` }} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {activationSteps.map((item, index) => {
                  const active = step >= index + 1;
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className={`rounded-[24px] border p-4 ${active ? 'border-[#FFD400]/40 bg-[#2d2500]/30' : 'border-[#2a2a31] bg-[#0e0f13]'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${active ? 'bg-[#FFD400] text-gray-900' : 'bg-gray-700 text-gray-300'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">{item.title}</p>
                          <p className="text-sm text-white leading-5">{item.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="p-5 md:p-8">
            {step === 1 && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center"><User className="mr-2 text-[#FFD400]" /> Datos personales y contacto</h3>
                <p className="text-gray-400 text-sm mb-6">Validamos esta información para enviarte el link de pago y confirmar tu activación.</p>
              <div className="space-y-5">
                  {renderField({
                    name: 'nombreCompleto',
                    label: fieldLabels.nombreCompleto,
                    placeholder: 'Ej: Juan Pérez',
                    helper: 'Escribe tu nombre tal como lo usas en tu base o app de taxi.',
                  })}
                  {renderField({
                    name: 'cedula',
                    label: fieldLabels.cedula,
                    placeholder: '000-0000000-0',
                    helper: 'Usa tu cédula dominicana de 11 dígitos.',
                  })}
                  {renderField({
                    name: 'telefono',
                    label: fieldLabels.telefono,
                    type: 'tel',
                    placeholder: '809-555-1234',
                    helper: 'Asegúrate de colocar un número con WhatsApp activo para recibir el link de pago.',
                  })}
                  {renderField({
                    name: 'ficha',
                    label: fieldLabels.ficha,
                    placeholder: 'Ej: 145',
                    helper: 'Ingresa el número de ficha asignado por tu base.',
                  })}
                </div>
                <div className="mt-8 flex justify-end">
                  <button onClick={nextStep} className="w-full md:w-auto bg-[#FFD400] text-gray-900 px-6 py-3 rounded-2xl font-bold hover:bg-yellow-400 transition-colors">Continuar con datos del vehículo</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center"><Car className="mr-2 text-[#FFD400]" /> Datos del vehículo</h3>
                <p className="text-gray-400 text-sm mb-6">Completa la información del carro para validar compatibilidad y activar la tablet correctamente.</p>
                <div className="space-y-5">
                  {renderField({
                    name: 'marca',
                    label: fieldLabels.marca,
                    placeholder: 'Ej: Hyundai Sonata Y20',
                    helper: 'Incluye marca y modelo para identificar tu unidad.',
                  })}
                  {renderField({
                    name: 'ano',
                    label: fieldLabels.ano,
                    type: 'text',
                    placeholder: 'Ej: 2015',
                    helper: 'Indica el año de fabricación del vehículo.',
                  })}
                  {renderField({
                    name: 'placa',
                    label: fieldLabels.placa,
                    placeholder: 'Ej: A123456',
                    helper: 'Debe empezar con una letra seguida de 6 números.',
                  })}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">{fieldLabels.aplicacion}</label>
                    <select
                      name="aplicacion"
                      value={formData.aplicacion}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('aplicacion')}
                      className="w-full rounded-2xl border border-gray-700 px-4 py-3 text-white bg-gray-950/80 focus:outline-none focus:border-[#FFD400]"
                    >
                      <option value="uber">Uber</option>
                      <option value="didi">DiDi</option>
                      <option value="indrive">inDrive</option>
                      <option value="privado">Taxi Privado / Base</option>
                    </select>
                    <p className="mt-2 text-sm text-zinc-500">Selecciona la modalidad con la que trabajas la mayor parte del tiempo.</p>
                  </div>
                </div>
                <div className="mt-8 flex flex-col-reverse md:flex-row md:justify-between gap-3">
                  <button onClick={prevStep} className="text-gray-400 hover:text-white px-4 py-2 font-medium">Atrás</button>
                  <button onClick={nextStep} className="w-full md:w-auto bg-[#FFD400] text-gray-900 px-6 py-3 rounded-2xl font-bold hover:bg-yellow-400 transition-colors">Revisar y confirmar</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-fade-in">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center"><FileText className="mr-2 text-[#FFD400]" /> Confirmación y contrato</h3>
                <p className="text-gray-400 text-sm mb-6">Revisa tu resumen, acepta los términos y te enviaremos a WhatsApp para completar el pago.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {Object.entries(formData).map(([key, value]) => (
                    <div key={key} className="rounded-2xl border border-gray-700 bg-gray-900/60 p-4">
                      <p className="text-xs uppercase tracking-[0.15em] text-zinc-500">{fieldLabels[key]}</p>
                      <p className="mt-2 text-white font-medium">{value || 'Pendiente'}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-[#FFD400] mt-0.5" />
                  <p className="text-sm text-white">
                    Al confirmar, recibirás por WhatsApp el enlace para pagar tu suscripción anual de <strong>RD$6,000</strong>. Luego un administrador activará tu tablet de forma remota.
                  </p>
                </div>

                <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 h-64 overflow-y-auto custom-scrollbar mb-6 text-sm text-gray-400 space-y-4">
                  <h4 className="font-bold text-white text-center">CONTRATO DE COLABORACIÓN MERCANTIL INDEPENDIENTE</h4>
                  <p><strong>ENTRE:</strong> Por una parte, <strong>TAD</strong>, y por la otra parte, EL COLABORADOR INDEPENDIENTE.</p>
                  <p><strong>PRIMERO:</strong> TAD autoriza a EL COLABORADOR a instalar un Kit Tecnológico en su vehículo.</p>
                  <p><strong>SEGUNDO:</strong> ESTE ACUERDO NO CONSTITUYE UN CONTRATO DE TRABAJO. Se utilizan equipos para generar ingresos suplementarios.</p>
                  <p><strong>TERCERO:</strong> Suscripción anual de RD$6,000.00 que cubre uso del Kit, software y mantenimiento.</p>
                  <p><strong>CUARTO:</strong> Compensación de RD$500.00 mensuales por anuncio activo (máx 15) y RD$500 de comisión por referidos.</p>
                </div>

                <div className="flex items-start mb-4">
                  <div className="flex items-center h-5">
                    <input id="terms" type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-5 h-5 bg-gray-900 border-gray-700 rounded accent-[#FFD400] cursor-pointer" />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-medium text-white cursor-pointer">
                      Acepto términos de colaboración mercantil no-laboral.
                    </label>
                    <p className="text-zinc-500">Reconozco que este registro guardará mis datos y me redirigirá para el pago.</p>
                    {submissionAttempted && !agreed && <p className="text-[#FFD400] mt-2">Debes aceptar los términos para continuar.</p>}
                  </div>
                </div>

                <div className="flex flex-col-reverse md:flex-row md:justify-between gap-3">
                  <button onClick={prevStep} disabled={isSubmitting} className="text-gray-400 hover:text-white px-4 py-2 font-medium disabled:opacity-50">Atrás</button>
                  <button onClick={handleComplete} disabled={isSubmitting} className="w-full md:w-auto px-6 py-3 rounded-2xl font-bold flex items-center justify-center transition-all bg-[#FFD400] text-gray-900 hover:bg-yellow-400 hover:scale-[1.01] shadow-[0_0_15px_rgba(255,215,0,0.3)] disabled:opacity-60 disabled:hover:scale-100">
                    {isSubmitting ? 'Guardando datos...' : 'Confirmar y recibir link de pago'} {!isSubmitting && <ChevronRight className="ml-2 w-5 h-5" />}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-24">
          <div className="rounded-[30px] border border-[#26262d] bg-[#111216] p-6 shadow-xl">
            <h3 className="text-lg font-bold text-white">Consejos rápidos para completar el registro</h3>
            <ul className="mt-4 space-y-4 text-sm text-gray-300">
              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#FFD400] mt-0.5" /> Revisa que tu nombre esté completo y sin abreviaturas.</li>
              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#FFD400] mt-0.5" /> Usa un WhatsApp activo porque por ahí recibirás el enlace de pago.</li>
              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#FFD400] mt-0.5" /> Escribe la placa exactamente como aparece en tu vehículo: 1 letra + 6 números.</li>
              <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-[#FFD400] mt-0.5" /> Ten a mano tu número de ficha asignado por la base.</li>
            </ul>
          </div>

          <div className="rounded-[30px] border border-[#3b3200] bg-[#1b1704] p-6">
            <h3 className="text-lg font-bold text-white">Antes de contactar soporte</h3>
            <div className="mt-4 space-y-3">
              {faqItems.map((item) => (
                <div key={item.question} className="rounded-2xl bg-black/20 border border-white/5 p-4">
                  <p className="text-sm font-semibold text-white">{item.question}</p>
                  <p className="mt-2 text-sm text-gray-300">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function DashboardView() {
  const [activeTab, setActiveTab] = useState('resumen');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Portal del Conductor</h1>
        <p className="text-gray-400">Bienvenido al sistema de gestión TAD</p>
      </div>

      <div className="flex space-x-4 mb-8 border-b border-gray-700">
        <button onClick={() => setActiveTab('resumen')} className={`px-4 py-2 font-medium transition-colors ${activeTab === 'resumen' ? 'text-[#FFD400] border-b-2 border-[#FFD400]' : 'text-gray-400 hover:text-white'}`}>
          Resumen
        </button>
        <button onClick={() => setActiveTab('anuncios')} className={`px-4 py-2 font-medium transition-colors ${activeTab === 'anuncios' ? 'text-[#FFD400] border-b-2 border-[#FFD400]' : 'text-gray-400 hover:text-white'}`}>
          Anuncios
        </button>
      </div>

      {activeTab === 'resumen' && (
        <div className="animate-fade-in space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <p className="text-gray-400 text-sm font-bold">Anuncios Activos</p>
              <h3 className="text-3xl font-black text-white mt-2">9 / 15</h3>
              <p className="text-xs text-[#FFD400] mt-1">RD$4,500 este mes</p>
            </div>
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-6">
              <p className="text-gray-400 text-sm font-bold">Referidos</p>
              <h3 className="text-3xl font-black text-white mt-2">3</h3>
              <p className="text-xs text-[#FFD400] mt-1">RD$1,500 este mes</p>
            </div>
            <div className="bg-[#FFD400] rounded-xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform"><DollarSign className="w-20 h-20 text-gray-900" /></div>
              <p className="text-gray-900 text-sm font-bold">Ganancias Acumuladas</p>
              <h3 className="text-4xl font-black text-gray-900 mt-2">RD$ 6,000</h3>
              <p className="text-xs text-gray-800 mt-1 font-medium">Ciclo: Marzo 2026</p>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h3 className="text-xl font-bold text-white mb-2">Programa de Referidos (Sin Límite)</h3>
                <p className="text-gray-400 text-sm max-w-md">
                  Por cada marca o negocio que refieras y pague pauta en TAD, ganas <strong className="text-[#FFD400]">RD$500 mensuales</strong> mientras su anuncio esté activo. No hay límite de comisiones.
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

      {activeTab === 'anuncios' && (
        <div className="animate-fade-in">
          <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-700 flex justify-between items-center bg-gray-800/50">
              <h3 className="font-bold text-white">Proyectándose en tu vehículo</h3>
              <span className="bg-gray-900 text-[#FFD400] text-xs font-bold px-3 py-1 rounded-full border border-gray-700">9 / 15 Máximo</span>
            </div>
            <div className="divide-y divide-gray-700">
              {[
                { id: 1, marca: 'Supermercados Nacional', tipo: 'Video 15s', estado: 'Activo' },
                { id: 2, marca: 'Banco Popular (AutoPréstamo)', tipo: 'Imagen estática', estado: 'Activo' },
                { id: 3, marca: 'Claro (Internet Fibra)', tipo: 'Video 10s', estado: 'Activo' },
                { id: 4, marca: 'Restaurante El Pelícano', tipo: 'Referido Tuyo', estado: 'Activo', referido: true },
                { id: 5, marca: 'Seguros Universal', tipo: 'Video 15s', estado: 'Activo' },
              ].map((ad) => (
                <div key={ad.id} className="p-6 flex items-center justify-between hover:bg-gray-750 transition-colors">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-700 mr-4">
                      {ad.tipo.includes('Video') ? <Play className="w-6 h-6 text-zinc-500" /> : <Monitor className="w-6 h-6 text-zinc-500" />}
                    </div>
                    <div>
                      <h4 className="text-white font-medium flex items-center">
                        {ad.marca}
                        {ad.referido && <span className="ml-2 bg-[#FFD400]/20 text-[#FFD400] text-[10px] font-bold px-2 py-0.5 rounded uppercase">Venta Propia</span>}
                      </h4>
                      <p className="text-sm text-zinc-500">{ad.tipo}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#FFD400] font-bold">+RD$500</p>
                    <p className="text-xs text-[#FFD400]">{ad.estado}</p>
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
