export const SITE = {
  nombre: 'Grupo Rexeco',
  descripcion:
    'Grupo de empresas especializadas en reciclaje y gestión integral de residuos, comprometidos con la economía circular y el cuidado del medio ambiente.',
  email: 'contacto@rexeco.cl',
  whatsapp: {
    numero: '+56 9 3438 4860',
    url: 'https://api.whatsapp.com/send?phone=56934384860&text=Hola!%20Quiero%20Contactarme',
  },
  direccion: 'Santa Margarita 01821, San Bernardo, Santiago',
  copyright: 'Grupo Rexeco © 2026',
  redes: {
    linkedin: 'https://www.linkedin.com/company/rexeco-cl/',
    facebook: 'https://www.facebook.com/profile.php?id=61578924792549&locale=es_LA',
    instagram: 'https://www.instagram.com/rexeco.cl/',
  },
  nav: [
    { label: 'Inicio', href: '/' },
    {
      label: 'Nuestras Empresas',
      dropdown: [
        { label: 'Exxan', href: '/exxan' },
        { label: 'Resimex', href: '/resimex' },
        { label: 'EcoNorte', href: '/econorte' },
      ],
    },
    { label: 'Sobre Nosotros', href: '/#nosotros' },
    { label: 'Compromiso', href: '/#eligenos' },
    { label: 'Canal de Denuncias', href: '/canal-de-denuncias' },
  ],
} as const;
