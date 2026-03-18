import { useMemo, useState } from 'react';

export default function EarningsCalculator() {
  const [ads, setAds] = useState(4);
  const monthlyIncome = ads * 500;
  const roiMonths = monthlyIncome > 0 ? Math.ceil(6000 / monthlyIncome) : 0;

  const helper = useMemo(() => `Si tienes ${ads} anuncio${ads === 1 ? '' : 's'}, ganas RD$${monthlyIncome.toLocaleString()} al mes.`, [ads, monthlyIncome]);

  return (
    <section id="calculadora" className="border-b border-white/10 bg-[#10131b] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-white/10 bg-[#151923] p-5 shadow-[0_30px_90px_rgba(0,0,0,0.35)] sm:p-8">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#FFD400]">Calculadora táctil</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Calcula cuánto puedes ganar</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
            Mueve el control con el dedo. Mientras más anuncios tengas, más cobras cada mes.
          </p>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-[#0d1118] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4 text-sm font-black text-white">
              <span>Anuncios activos</span>
              <span className="rounded-full bg-[#FFD400]/10 px-4 py-2 text-[#FFD400]">{ads}</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              value={ads}
              onChange={(event) => setAds(Number(event.target.value))}
              className="mt-6 h-4 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#FFD400]"
            />
            <div className="mt-3 flex justify-between text-xs font-black uppercase tracking-[0.16em] text-zinc-500">
              <span>0</span>
              <span>Máximo 15</span>
            </div>
            <p className="mt-5 text-base font-semibold text-white">{helper}</p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[24px] border border-white/10 bg-[#0d1118] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">Ganancia mensual</p>
              <p className="mt-3 text-4xl font-black text-[#FFD400]">RD$ {monthlyIncome.toLocaleString()}</p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-[#0d1118] p-5">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">Retorno de inversión</p>
              <p className="mt-3 text-4xl font-black text-white">{roiMonths > 0 ? `En ${roiMonths} mes${roiMonths > 1 ? 'es' : ''}` : '—'}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
