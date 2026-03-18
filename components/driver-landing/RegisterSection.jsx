import { useMemo, useState } from 'react';
import { AlertCircle, Car, CheckCircle2, ChevronRight, FileText, User } from 'lucide-react';

const fieldLabels = {
  fullName: 'Nombre completo',
  idNumber: 'Cédula',
  phone: 'Teléfono (WhatsApp)',
  fleetNumber: 'Número de ficha / taxi',
  carModel: 'Marca / modelo',
  carYear: 'Año',
  plate: 'Placa',
  appType: 'Modalidad de trabajo',
};

const formatPhone = (value) => {
  const digits = value.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const validators = {
  fullName: (value) => {
    const clean = value.trim().replace(/\s+/g, ' ');
    if (!clean) return 'Escribe tu nombre y apellido.';
    if (clean.split(' ').length < 2) return 'Pon al menos un nombre y un apellido.';
    return '';
  },
  idNumber: (value) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return 'Escribe tu cédula.';
    if (digits.length !== 11) return 'La cédula debe tener 11 dígitos.';
    return '';
  },
  phone: (value) => {
    const digits = value.replace(/\D/g, '');
    if (!digits) return 'Escribe tu WhatsApp.';
    if (!/^(809|829|849)\d{7}$/.test(digits)) return 'Usa un número válido de RD: 809, 829 o 849.';
    return '';
  },
  fleetNumber: (value) => (!/^\d{1,6}$/.test(value) ? 'Escribe solo números en la ficha.' : ''),
  carModel: (value) => (!value.trim() ? 'Escribe la marca y el modelo.' : ''),
  carYear: (value) => {
    const year = Number(value);
    if (!/^\d{4}$/.test(value)) return 'Escribe un año válido.';
    if (year < 1990 || year > new Date().getFullYear() + 1) return 'Ese año no parece válido.';
    return '';
  },
  plate: (value) => (!/^[A-Z]\d{6}$/.test(value) ? 'La placa debe ser 1 letra y 6 números.' : ''),
  appType: (value) => (!value ? 'Selecciona cómo trabajas.' : ''),
};

const initialData = {
  fullName: '',
  idNumber: '',
  phone: '',
  fleetNumber: '',
  carModel: '',
  carYear: '',
  plate: '',
  appType: 'uber',
};

const stepFields = {
  1: ['fullName', 'idNumber', 'phone', 'fleetNumber'],
  2: ['carModel', 'carYear', 'plate', 'appType'],
};

export default function RegisterSection() {
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [touched, setTouched] = useState({});
  const [formData, setFormData] = useState(initialData);

  const errors = useMemo(
    () => Object.fromEntries(Object.entries(formData).map(([key, value]) => [key, validators[key] ? validators[key](value) : ''])),
    [formData],
  );

  const progress = step === 1 ? 33 : step === 2 ? 66 : 100;

  const showError = (name) => touched[name] && errors[name];
  const canMove = (currentStep) => stepFields[currentStep].every((field) => !errors[field]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let next = value;
    if (name === 'phone') next = formatPhone(value);
    if (name === 'idNumber') next = value.replace(/[^0-9-]/g, '').slice(0, 13);
    if (name === 'fleetNumber') next = value.replace(/\D/g, '').slice(0, 6);
    if (name === 'carYear') next = value.replace(/\D/g, '').slice(0, 4);
    if (name === 'plate') next = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
    setFormData((prev) => ({ ...prev, [name]: next }));
  };

  const touchStep = (currentStep) => {
    setTouched((prev) => ({
      ...prev,
      ...Object.fromEntries(stepFields[currentStep].map((field) => [field, true])),
    }));
  };

  const nextStep = () => {
    touchStep(step);
    if (!canMove(step)) return;
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const submit = async () => {
    setTouched(Object.fromEntries(Object.keys(formData).map((field) => [field, true])));
    if (Object.values(errors).some(Boolean) || !agreed) return;

    setSubmitting(true);
    const formPayload = new FormData();
    formPayload.append('nombre', formData.fullName);
    formPayload.append('apellido', '');
    formPayload.append('cedula', formData.idNumber);
    formPayload.append('telefono', formData.phone);
    formPayload.append('marca', formData.carModel);
    formPayload.append('ano', formData.carYear);
    formPayload.append('placa', formData.plate);
    formPayload.append('aplicacion', formData.appType);
    formPayload.append('ficha', formData.fleetNumber);

    try {
      await fetch('https://script.google.com/macros/s/AKfycbyF5Sk3R51l0J3bP5lgM2_MV6Qs47Wo-a8wQFme5cBpaNUnlH85h5Z37P6_2fXZRDVh/exec', {
        method: 'POST',
        body: formPayload,
        mode: 'no-cors',
      });
    } catch (error) {
      console.error(error);
    } finally {
      const message = `Hola, quiero mi pantalla ahora. Ya completé mi registro en TAD Drive a nombre de ${formData.fullName} y quiero pagar mis RD$6,000.`;
      window.open(`https://wa.me/18495043872?text=${encodeURIComponent(message)}`, '_blank');
      setSubmitting(false);
    }
  };

  const renderField = ({ name, placeholder, helper, type = 'text' }) => (
    <div>
      <label className="mb-2 block text-sm font-black text-white">{fieldLabels[name]}</label>
      <input
        name={name}
        type={type}
        value={formData[name]}
        onChange={handleChange}
        onBlur={() => setTouched((prev) => ({ ...prev, [name]: true }))}
        placeholder={placeholder}
        className={`min-h-11 w-full rounded-2xl border bg-[#09101a] px-4 py-3 text-white outline-none transition ${showError(name) ? 'border-[#FFD400]' : 'border-white/10 focus:border-[#FFD400]'}`}
      />
      <p className={`mt-2 text-sm ${showError(name) ? 'text-[#FFD400]' : 'text-zinc-500'}`}>{showError(name) || helper}</p>
    </div>
  );

  return (
    <section id="registro" className="border-b border-white/10 bg-[#0b0c10] py-16 sm:py-20">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:px-8">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[#121318] shadow-[0_30px_90px_rgba(0,0,0,0.35)]">
          <div className="border-b border-white/10 bg-[#121318] px-5 py-6 sm:px-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#FFD400]">Registro de choferes</p>
                <h2 className="mt-3 text-3xl font-black text-white">Completa tu afiliación sin errores</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                  Sigue los ejemplos debajo de cada campo para llenar todo bien desde tu celular y recibir tu enlace de pago por WhatsApp.
                </p>
              </div>
              <a href="#" className="hidden text-sm text-zinc-400 transition hover:text-white sm:block">Volver</a>
            </div>

            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between text-sm text-zinc-400">
                <span>Formulario guiado</span>
                <span>{progress}% completado</span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div className="h-full rounded-full bg-[#FFD400] transition-all" style={{ width: `${progress}%` }} />
              </div>
            </div>

            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {[
                ['Paso 1', 'Completa tus datos.', User],
                ['Paso 2', 'Realiza el pago de RD$6,000 vía enlace de WhatsApp.', Car],
                ['Paso 3', 'Un administrador activará tu pantalla.', CheckCircle2],
              ].map(([title, text, Icon], index) => {
                const active = step >= index + 1;
                return (
                  <div key={title} className={`rounded-[24px] border p-4 ${active ? 'border-[#FFD400]/40 bg-[#FFD400]/10' : 'border-white/10 bg-[#0f1014]'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${active ? 'bg-[#FFD400] text-black' : 'bg-white/10 text-white'}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[11px] font-black uppercase tracking-[0.18em] text-zinc-500">{title}</p>
                        <p className="text-sm font-semibold text-white">{text}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-5 py-6 sm:px-8">
            {step === 1 && (
              <div>
                <h3 className="mb-2 flex items-center text-2xl font-black text-white"><User className="mr-2 h-5 w-5 text-[#FFD400]" /> Datos personales y contacto</h3>
                <p className="mb-6 text-sm leading-7 text-zinc-400">Estos datos se usan para enviarte el link de pago y dejar tu pantalla lista.</p>
                <div className="space-y-5">
                  {renderField({ name: 'fullName', placeholder: 'Ej: Juan Pérez', helper: 'Escribe tu nombre completo, como te conocen en tu base o en la app.' })}
                  {renderField({ name: 'idNumber', placeholder: '000-0000000-0', helper: 'Escribe tu cédula completa, sin inventar números.' })}
                  {renderField({ name: 'phone', placeholder: '809-555-1234', helper: 'Pon un número que sí uses en WhatsApp para recibir el link de pago.' })}
                  {renderField({ name: 'fleetNumber', placeholder: 'Ej: 145', helper: 'Escribe el número de ficha que te dio tu base.' })}
                </div>
                <div className="mt-8 flex justify-end">
                  <button onClick={nextStep} className="min-h-11 rounded-2xl bg-[#FFD400] px-6 py-4 text-sm font-black text-black">Seguir con datos del vehículo</button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <h3 className="mb-2 flex items-center text-2xl font-black text-white"><Car className="mr-2 h-5 w-5 text-[#FFD400]" /> Datos del vehículo</h3>
                <p className="mb-6 text-sm leading-7 text-zinc-400">Completa los datos del carro para dejar tu pantalla configurada correctamente.</p>
                <div className="space-y-5">
                  {renderField({ name: 'carModel', placeholder: 'Ej: Hyundai Sonata Y20', helper: 'Pon la marca y el modelo para identificar tu vehículo.' })}
                  {renderField({ name: 'carYear', placeholder: 'Ej: 2015', helper: 'Escribe el año del vehículo.' })}
                  {renderField({ name: 'plate', placeholder: 'Ej: A123456', helper: 'La placa debe llevar 1 letra y luego 6 números.' })}
                  <div>
                    <label className="mb-2 block text-sm font-black text-white">{fieldLabels.appType}</label>
                    <select name="appType" value={formData.appType} onChange={handleChange} className="min-h-11 w-full rounded-2xl border border-white/10 bg-[#09101a] px-4 py-3 text-white outline-none focus:border-[#FFD400]">
                      <option value="uber">Uber</option>
                      <option value="didi">DiDi</option>
                      <option value="indrive">inDrive</option>
                      <option value="base">Taxi de base</option>
                    </select>
                    <p className="mt-2 text-sm text-zinc-500">Elige cómo trabajas casi siempre.</p>
                  </div>
                </div>
                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <button onClick={() => setStep(1)} className="min-h-11 px-4 py-3 text-sm font-black text-zinc-400">Atrás</button>
                  <button onClick={nextStep} className="min-h-11 rounded-2xl bg-[#FFD400] px-6 py-4 text-sm font-black text-black">Revisar antes de pagar</button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h3 className="mb-2 flex items-center text-2xl font-black text-white"><FileText className="mr-2 h-5 w-5 text-[#FFD400]" /> Confirmación y pago</h3>
                <p className="mb-6 text-sm leading-7 text-zinc-400">Revisa tus datos. Si todo está bien, te mandamos a WhatsApp para completar el pago.</p>
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(formData).map(([key, value]) => (
                    <div key={key} className="rounded-2xl border border-white/10 bg-[#0f1014] p-4">
                      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-zinc-500">{fieldLabels[key]}</p>
                      <p className="mt-2 text-base font-semibold text-white">{value || 'Pendiente'}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-white">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="mt-1 h-5 w-5 text-[#FFD400]" />
                    <p>Al confirmar, te llegará por WhatsApp el enlace para pagar RD$6,000. Después activamos tu pantalla.</p>
                  </div>
                </div>
                <label className="mt-6 flex items-start gap-3 text-sm text-zinc-400">
                  <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} className="mt-1 h-5 w-5 accent-[#FFD400]" />
                  <span>Acepto los términos de colaboración y entiendo que después del pago se activa mi proceso.</span>
                </label>
                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                  <button onClick={() => setStep(2)} className="min-h-11 px-4 py-3 text-sm font-black text-zinc-400">Atrás</button>
                  <button onClick={submit} disabled={submitting} className="min-h-11 rounded-2xl bg-[#FFD400] px-6 py-4 text-sm font-black text-black disabled:opacity-60">
                    {submitting ? 'Guardando...' : 'Quiero mi pantalla ahora'} <ChevronRight className="ml-2 inline h-5 w-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-[28px] border border-white/10 bg-[#121318] p-5">
            <h3 className="text-xl font-black text-white">Consejos rápidos para llenar el registro</h3>
            <ul className="mt-4 space-y-4 text-sm text-zinc-300">
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 text-[#FFD400]" /> Escribe tu nombre completo, sin apodos.</li>
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 text-[#FFD400]" /> Usa un WhatsApp activo porque por ahí te escribiremos.</li>
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 text-[#FFD400]" /> Copia la placa tal como está: 1 letra y 6 números.</li>
              <li className="flex gap-3"><CheckCircle2 className="mt-0.5 h-5 w-5 text-[#FFD400]" /> Ten cerca tu número de ficha para no detenerte.</li>
            </ul>
          </div>
          <div className="rounded-[28px] border border-[#FFD400]/15 bg-[#1a1808] p-5">
            <h3 className="text-xl font-black text-white">Antes de pagar</h3>
            <p className="mt-3 text-sm leading-7 text-zinc-300">Pagar RD$6,000 activa tu año dentro de TAD Drive y cubre la pantalla. Luego cobras mensual por cada anuncio activo.</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
