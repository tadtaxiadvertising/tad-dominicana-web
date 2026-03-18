import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { faqItems, whatsappHref } from './constants';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faqs" className="bg-[#09090c] py-16 sm:py-20">
      <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#FFD400]">Preguntas rápidas para choferes</p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">Aclara tus dudas antes de escribirnos</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-400 sm:text-base">
            Respuestas cortas para que sepas cuánto inviertes, cuánto ganas y cómo funciona la pantalla.
          </p>
        </div>

        <div className="mt-10 space-y-3">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <article key={item.question} className="overflow-hidden rounded-[24px] border border-white/10 bg-[#111216]">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="flex min-h-11 w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-black text-white sm:text-base">{item.question}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-[#FFD400] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && <p className="border-t border-white/10 px-5 py-4 text-sm leading-7 text-zinc-300">{item.answer}</p>}
              </article>
            );
          })}
        </div>

        <a
          href={whatsappHref}
          className="mt-8 flex min-h-11 w-full items-center justify-center rounded-2xl bg-[#FFD400] px-6 py-4 text-sm font-black uppercase tracking-[0.18em] text-black transition hover:bg-yellow-300"
        >
          Quiero mi pantalla ahora
        </a>
      </div>
    </section>
  );
}
