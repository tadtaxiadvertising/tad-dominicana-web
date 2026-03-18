import { BadgeDollarSign, CreditCard, MonitorSmartphone } from 'lucide-react';
import { processSteps } from './constants';

const icons = [CreditCard, MonitorSmartphone, BadgeDollarSign];

export default function ProcessSection() {
  return (
    <section id="como-funciona" className="border-b border-white/10 bg-[#0c0d12] py-16 sm:py-20">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#FFD400]">Actívate en 3 pasos</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Proceso simple para estar online en TAD</h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-zinc-400 sm:text-base">
            Todo está pensado para que el chofer entienda rápido qué paga, qué recibe y cuándo empieza a cobrar.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {processSteps.map((step, index) => {
            const Icon = icons[index];
            return (
              <article key={step.step} className="rounded-[28px] border border-white/10 bg-[#121318] p-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFD400] text-black">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="mt-4 text-[11px] font-black uppercase tracking-[0.18em] text-[#FFD400]">{step.step}</p>
                <h3 className="mt-2 text-lg font-black text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-400">{step.description}</p>
                <div className="mt-5 h-1.5 rounded-full bg-white/5">
                  <div className="h-full rounded-full bg-[#FFD400]" style={{ width: `${(index + 1) * 33.33}%` }} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
