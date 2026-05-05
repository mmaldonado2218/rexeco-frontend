import { useState, useEffect } from 'react';

type NavItem =
  | { label: string; href: string }
  | { label: string; dropdown: { label: string; href: string }[] };

interface Props {
  nav: readonly NavItem[];
  whatsapp: { numero: string; url: string };
}

export default function MobileMenu({ nav, whatsapp }: Props) {
  const [open, setOpen] = useState(false);
  const [empresasOpen, setEmpresasOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const close = () => { setOpen(false); setEmpresasOpen(false); };

  return (
    <div className="lg:hidden">
      {/* Botón hamburguesa */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={open}
        className="p-2 text-rexeco-navy"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 max-w-full bg-rexeco-navy z-50 flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        {/* Header drawer */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <span className="text-white font-heading font-bold text-lg uppercase tracking-widest">Menú</span>
          <button onClick={close} aria-label="Cerrar menú" className="text-white p-1">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <nav className="flex-1 overflow-y-auto py-4">
          {nav.map((item, i) => {
            if ('dropdown' in item) {
              return (
                <div key={i}>
                  <button
                    onClick={() => setEmpresasOpen(!empresasOpen)}
                    className="flex items-center justify-between w-full px-6 py-4 text-white font-heading font-semibold text-base uppercase tracking-wide hover:text-rexeco-red transition-colors"
                    aria-expanded={empresasOpen}
                  >
                    {item.label}
                    <svg
                      className={`w-4 h-4 transition-transform ${empresasOpen ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {empresasOpen && (
                    <div className="bg-white/5">
                      {item.dropdown.map((sub, j) => (
                        <a
                          key={j}
                          href={sub.href}
                          onClick={close}
                          className="block pl-10 pr-6 py-3 text-white/80 font-heading font-semibold text-sm uppercase tracking-wide hover:text-rexeco-red transition-colors"
                        >
                          {sub.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            }
            return (
              <a
                key={i}
                href={item.href}
                onClick={close}
                className="block px-6 py-4 text-white font-heading font-semibold text-base uppercase tracking-wide hover:text-rexeco-red transition-colors"
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* CTA WhatsApp */}
        <div className="p-5 border-t border-white/10">
          <a
            href={whatsapp.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={close}
            className="flex items-center justify-center gap-2 w-full bg-rexeco-wa hover:bg-green-500 text-rexeco-dark font-heading font-bold text-sm uppercase tracking-wide px-5 py-3 rounded-xl transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Contactar por WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
