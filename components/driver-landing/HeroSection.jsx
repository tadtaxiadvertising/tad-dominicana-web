import { ChevronRight, Smartphone } from 'lucide-react';
import { whatsappHref } from './constants';

const stats = [
  ['Inversión anual', 'RD$6,000'],
  ['Ganancia por anuncio', 'RD$500/mes'],
  ['Máximo mensual', 'RD$7,500'],
  ['Pago', 'Transferencia'],
];

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,212,0,0.18),transparent_28%),linear-gradient(180deg,#111114_0%,#09090c_100%)]" />
      <div className="relative mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 gap-10 px-4 pb-24 pt-28 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:pb-20 lg:pt-32">
        <div className="flex flex-col justify-center">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#FFD400]/20 bg-[#FFD400]/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.2em] text-[#FFD400]">
            <span className="h-2 w-2 rounded-full bg-[#FFD400]" />
            Plataforma TAD para choferes
          </div>
          <h1 className="mt-6 max-w-3xl text-4xl font-black uppercase leading-[0.95] text-white sm:text-5xl lg:text-7xl">
            Convierte tu vehículo en una valla digital.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
            Invierte RD$6,000 al año y genera hasta RD$7,500 mensuales en ingresos pasivos.
            Conduces como siempre. La pantalla hace el resto.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappHref}
              className="flex min-h-11 items-center justify-center rounded-2xl bg-[#FFD400] px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-black transition hover:scale-[1.01] hover:bg-yellow-300"
            >
              Quiero mi pantalla ahora <ChevronRight className="ml-2 h-5 w-5" />
            </a>
            <a
              href="#faqs"
              className="flex min-h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-white transition hover:border-[#FFD400]/40"
            >
              Ver preguntas
            </a>
          </div>
          <div className="mt-6 flex flex-wrap gap-3 text-xs font-black uppercase tracking-[0.16em] text-white/80">
            <span className="rounded-full border border-white/10 bg-[#121217] px-4 py-2">Registro simple</span>
            <span className="rounded-full border border-white/10 bg-[#121217] px-4 py-2">Pago por WhatsApp</span>
            <span className="rounded-full border border-white/10 bg-[#121217] px-4 py-2">Activación remota</span>
          </div>
        </div>

        <div className="flex items-center">
          <div className="w-full rounded-[32px] border border-white/10 bg-[#101116] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.45)] sm:p-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-5">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-500">Estado del sistema</p>
                <h2 className="mt-2 text-3xl font-black uppercase text-white">Pantalla TAD</h2>
              </div>
              <div className="rounded-2xl bg-[#FFD400] p-4 text-black shadow-[0_0_24px_rgba(255,212,0,0.35)]">
                <Smartphone className="h-8 w-8" />
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-4">
              {stats.map(([label, value]) => (
                <div key={label} className="rounded-[24px] border border-white/10 bg-[#0b0c10] p-4">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">{label}</p>
                  <p className="mt-3 text-2xl font-black text-white sm:text-3xl">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
