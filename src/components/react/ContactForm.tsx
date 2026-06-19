import { useState } from 'react';

interface FormState {
  nombre: string;
  empresa: string;
  telefono: string;
  email: string;
  mensaje: string;
}

const initial: FormState = { nombre: '', empresa: '', telefono: '', email: '', mensaje: '' };

export default function ContactForm() {
  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const validate = (): boolean => {
    const e: Partial<FormState> = {};
    if (!form.nombre.trim()) e.nombre = 'Requerido';
    if (!form.empresa.trim()) e.empresa = 'Requerido';
    if (!form.telefono.trim()) e.telefono = 'Requerido';
    if (!form.email.trim()) e.email = 'Requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSending(true);
    setSendError(null);
    try {
      const res = await fetch('/enviar.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Request failed');
      setSubmitted(true);
    } catch {
      setSendError('No pudimos enviar tu mensaje. Inténtalo nuevamente en unos minutos.');
    } finally {
      setSending(false);
    }
  };

  const field = (key: keyof FormState) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value })),
  });

  if (submitted) {
    return (
      <div className="bg-rexeco-dark text-white p-8 text-center">
        <div className="w-16 h-16 bg-rexeco-red flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
        <h3 className="font-heading font-bold text-2xl uppercase tracking-wide mb-3">¡Mensaje recibido!</h3>
        <p className="text-white/70 text-sm mb-6">
          Gracias por contactarnos. Nos comunicaremos contigo a la brevedad.
        </p>
        <button
          onClick={() => { setForm(initial); setSubmitted(false); setSendError(null); }}
          className="font-heading font-semibold text-sm uppercase tracking-wide text-rexeco-red hover:text-white transition-colors"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  const inputClass = (key: keyof FormState) =>
    `w-full bg-white border-b-2 ${errors[key] ? 'border-rexeco-red' : 'border-gray-200'} focus:border-rexeco-dark px-0 py-3 text-rexeco-text text-sm outline-none transition-colors placeholder:text-gray-400`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block font-heading font-semibold text-rexeco-dark text-xs uppercase tracking-widest mb-2">
            Nombre y Apellido *
          </label>
          <input
            type="text"
            placeholder="Juan Pérez"
            className={inputClass('nombre')}
            {...field('nombre')}
          />
          {errors.nombre && <p className="text-rexeco-red text-xs mt-1">{errors.nombre}</p>}
        </div>
        <div>
          <label className="block font-heading font-semibold text-rexeco-dark text-xs uppercase tracking-widest mb-2">
            Empresa *
          </label>
          <input
            type="text"
            placeholder="Nombre de empresa"
            className={inputClass('empresa')}
            {...field('empresa')}
          />
          {errors.empresa && <p className="text-rexeco-red text-xs mt-1">{errors.empresa}</p>}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-6">
        <div>
          <label className="block font-heading font-semibold text-rexeco-dark text-xs uppercase tracking-widest mb-2">
            Teléfono *
          </label>
          <input
            type="tel"
            placeholder="+56 9 1234 5678"
            className={inputClass('telefono')}
            {...field('telefono')}
          />
          {errors.telefono && <p className="text-rexeco-red text-xs mt-1">{errors.telefono}</p>}
        </div>
        <div>
          <label className="block font-heading font-semibold text-rexeco-dark text-xs uppercase tracking-widest mb-2">
            Email *
          </label>
          <input
            type="email"
            placeholder="contacto@empresa.com"
            className={inputClass('email')}
            {...field('email')}
          />
          {errors.email && <p className="text-rexeco-red text-xs mt-1">{errors.email}</p>}
        </div>
      </div>

      <div>
        <label className="block font-heading font-semibold text-rexeco-dark text-xs uppercase tracking-widest mb-2">
          Producto a cotizar
        </label>
        <textarea
          placeholder="Describa el material o servicio que necesita..."
          rows={4}
          className={`${inputClass('mensaje')} resize-none`}
          {...field('mensaje')}
        />
      </div>

      {sendError && (
        <p className="text-rexeco-red text-sm" role="alert">{sendError}</p>
      )}

      <button
        type="submit"
        disabled={sending}
        className="w-full sm:w-auto bg-rexeco-red hover:bg-red-700 text-white font-heading font-bold uppercase tracking-widest px-10 py-4 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {sending ? 'Enviando…' : 'Enviar mensaje'}
      </button>
    </form>
  );
}
