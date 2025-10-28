// Sistema de dados globais para gerenciar informações centralizadas
// Usado para referências entre diferentes seções do admin

export interface GlobalTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  fontFamily: string;
}

export interface GlobalContacts {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  addressComplement: string;
  addressReference: string;
  gpsCoordinates: string; // Changed from mapLink to gpsCoordinates for compatibility
  weekdayHours: string;
  saturdayHours: string;
  sundayHours: string;
  responseTime: string;
  instagram: string;
  facebook: string;
  linkedin: string;
  twitter: string;
}

export interface GlobalCadastros {
  endereco_principal: string;
  complemento: string;
}

export interface GalleryImage {
  id: number;
  url: string;
  alt: string;
  caption: string;
}

export interface GalleryCategory {
  id: string;
  title: string;
  images: GalleryImage[];
}

export interface GlobalGallery {
  categorias: GalleryCategory[];
}

// Estado global (simula persistência)
let globalData = {
  theme: {
    primary: '#4a5d23',
    secondary: '#f4f1e8', 
    accent: '#e8e0d0',
    background: '#fefcf7',
    fontFamily: 'Inter'
  } as GlobalTheme,
  
  contatos: {
    phone: '(11) 99999-9999',
    whatsapp: '11999999999', // Formato limpo para WhatsApp
    email: 'contato@recantomoriah.com.br',
    address: 'Estrada Rural KM 15',
    addressComplement: 'Zona Rural',
    addressReference: 'Próximo ao posto de gasolina central',
    gpsCoordinates: 'https://maps.google.com/...',
    weekdayHours: '8h às 18h',
    saturdayHours: '8h às 16h', 
    sundayHours: '9h às 15h',
    responseTime: 'Respondemos todas as mensagens em até 2 horas durante o horário comercial.',
    instagram: 'https://instagram.com/recantomoriah',
    facebook: 'https://facebook.com/recantomoriah',
    linkedin: '',
    twitter: ''
  } as GlobalContacts,
  
  cadastros: {
    endereco_principal: 'Estrada Rural KM 15',
    complemento: 'Zona Rural'
  } as GlobalCadastros,
  
  galeria: {
    categorias: [
      {
        id: 'area-externa',
        title: 'Área Externa',
        images: []
      },
      {
        id: 'cerimonias', 
        title: 'Cerimônias',
        images: []
      },
      {
        id: 'acomodacoes',
        title: 'Acomodações', 
        images: []
      }
    ]
  } as GlobalGallery
};

// Funções para gerenciar os dados globais
export const getGlobalData = () => globalData;

export const updateGlobalTheme = (theme: Partial<GlobalTheme>) => {
  globalData.theme = { ...globalData.theme, ...theme };
  applyThemeToDOM(globalData.theme);
};

export const updateGlobalContacts = (contacts: Partial<GlobalContacts>) => {
  globalData.contatos = { ...globalData.contatos, ...contacts };
};

export const updateGlobalCadastros = (cadastros: Partial<GlobalCadastros>) => {
  globalData.cadastros = { ...globalData.cadastros, ...cadastros };
};

export const updateGlobalGallery = (gallery: Partial<GlobalGallery>) => {
  globalData.galeria = { ...globalData.galeria, ...gallery };
};

// Função para aplicar tema ao DOM (atualização em tempo real)
const applyThemeToDOM = (theme: GlobalTheme) => {
  const root = document.documentElement;
  
  // Converter cores hex para HSL
  const hexToHsl = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h! /= 6;
    }

    return `${Math.round(h! * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
  };

  // Aplicar cores CSS customizadas
  root.style.setProperty('--primary', hexToHsl(theme.primary));
  root.style.setProperty('--secondary', hexToHsl(theme.secondary));
  root.style.setProperty('--accent', hexToHsl(theme.accent));
  root.style.setProperty('--background', hexToHsl(theme.background));
  
  // Aplicar fonte
  root.style.setProperty('--font-family', theme.fontFamily);
  document.body.style.fontFamily = theme.fontFamily;
};

// Função para obter endereço completo formatado
export const getFullAddress = () => {
  const { cadastros, contatos } = globalData;
  return `${cadastros.endereco_principal}${cadastros.complemento ? ', ' + cadastros.complemento : ''}`;
};

// Função para obter número WhatsApp formatado
export const getWhatsAppNumber = () => {
  const { contatos } = globalData;
  // Remove todos os caracteres não numéricos
  return contatos.whatsapp.replace(/\D/g, '');
};

// Função para gerar link do WhatsApp com mensagem
export const generateWhatsAppLink = (message: string) => {
  const number = getWhatsAppNumber();
  if (!number) return null;
  
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
};

// Inicializar tema no carregamento
if (typeof window !== 'undefined') {
  applyThemeToDOM(globalData.theme);
}