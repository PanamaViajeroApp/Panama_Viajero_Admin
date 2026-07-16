import boqueteImage from '../assets/drafts/boquete.webp'
import cascoAntiguoImage from '../assets/drafts/casco-antiguo.webp'
import islaBastimentosImage from '../assets/drafts/isla-bastimentos.webp'
import bahiaDelfinesImage from '../assets/sites/bahia-delfines.webp'
import cayosZapatillaImage from '../assets/sites/cayos-zapatilla.webp'
import valleAntonImage from '../assets/sites/valle-anton.webp'

const exampleMapUrl = ''

export const provinces = [
  'Bocas del Toro',
  'Chiriqui',
  'Cocle',
  'Colon',
  'Darien',
  'Guna Yala',
  'Herrera',
  'Los Santos',
  'Panama',
  'Panama Oeste',
  'Veraguas',
]

export const destinationFilters = [
  ...provinces,
  'Riviera Pacifica',
]

export const metrics = [
  {
    label: 'Sitios publicados',
    value: '148',
    detail: '+6 este mes',
    tone: 'blue',
  },
  {
    label: 'Borradores activos',
    value: '3',
    detail: 'Listos para continuar editando',
    tone: 'red',
  },
  {
    label: 'Usuarios activos',
    value: '7',
    detail: '2 co-administradores',
    tone: 'neutral',
  },
]

export const drafts = [
  {
    id: 'isla-bastimentos',
    name: 'Isla Bastimentos',
    province: 'Bocas del Toro',
    location: 'Bastimentos, Bocas del Toro',
    description: 'Naturaleza salvaje, playas virgenes y cultura autentica en el Caribe panameno.',
    author: 'Mariana C.',
    updated: 'Hace 18 min',
    image: islaBastimentosImage,
    gallery: [islaBastimentosImage],
    activities: ['Playas', 'Snorkel', 'Cultura', 'Fotografia'],
    mapUrl: exampleMapUrl,
    isPacificRiviera: false,
  },
  {
    id: 'boquete',
    name: 'Boquete',
    province: 'Chiriqui',
    location: 'Boquete, Chiriqui',
    description: 'Montanas, cafe de altura y senderos rodeados por el clima fresco de Chiriqui.',
    author: 'Carlos M.',
    updated: 'Hace 2 h',
    image: boqueteImage,
    gallery: [boqueteImage],
    activities: ['Cafe', 'Senderismo', 'Fotografia', 'Naturaleza'],
    mapUrl: exampleMapUrl,
    isPacificRiviera: false,
  },
  {
    id: 'casco-antiguo',
    name: 'Casco Antiguo',
    province: 'Panama',
    location: 'Ciudad de Panama, Panama',
    description: 'Historia, arquitectura y cultura reunidas en uno de los barrios mas emblematicos del pais.',
    author: 'Andrea R.',
    updated: 'Ayer',
    image: cascoAntiguoImage,
    gallery: [cascoAntiguoImage],
    activities: ['Museos', 'Gastronomia', 'Fotografia', 'Cultura'],
    mapUrl: exampleMapUrl,
    isPacificRiviera: false,
  },
]

export const publishedSites = [
  {
    id: 'bahia-de-los-delfines',
    name: 'Bahia de los Delfines',
    province: 'Bocas del Toro',
    location: 'Isla Colon, Bocas del Toro',
    description: 'Una bahia tranquila conocida por los recorridos para observar delfines en su entorno natural.',
    updated: 'Hoy, 09:42',
    image: bahiaDelfinesImage,
    gallery: [bahiaDelfinesImage],
    activities: ['Avistamiento de delfines', 'Paseos en lancha', 'Fotografia'],
    mapUrl: exampleMapUrl,
    isPacificRiviera: false,
  },
  {
    id: 'cayos-zapatilla',
    name: 'Cayos Zapatilla',
    province: 'Bocas del Toro',
    location: 'Bastimentos, Bocas del Toro',
    description: 'Playas virgenes, aguas cristalinas y naturaleza intacta en uno de los paraisos del Caribe.',
    updated: '12 jul 2026',
    image: cayosZapatillaImage,
    gallery: [cayosZapatillaImage],
    activities: ['Playas', 'Snorkel', 'Natacion', 'Fotografia'],
    mapUrl: exampleMapUrl,
    isPacificRiviera: false,
  },
  {
    id: 'boquete-centro',
    name: 'Boquete',
    province: 'Chiriqui',
    location: 'Boquete, Chiriqui',
    description: 'Un destino de montana reconocido por su cafe, senderos y clima fresco.',
    updated: 'Ayer, 16:18',
    image: boqueteImage,
    gallery: [boqueteImage],
    activities: ['Cafe', 'Senderismo', 'Ciclismo', 'Fotografia'],
    mapUrl: exampleMapUrl,
    isPacificRiviera: false,
  },
  {
    id: 'el-valle-de-anton',
    name: 'El Valle de Anton',
    province: 'Cocle',
    location: 'Anton, Cocle',
    description: 'Un pueblo rodeado por montanas, naturaleza y experiencias para toda la familia.',
    updated: '10 jul 2026',
    image: valleAntonImage,
    gallery: [valleAntonImage],
    activities: ['Senderismo', 'Aguas termales', 'Compras', 'Naturaleza'],
    mapUrl: exampleMapUrl,
    isPacificRiviera: false,
  },
  {
    id: 'casco-antiguo-publicado',
    name: 'Casco Antiguo',
    province: 'Panama',
    location: 'Ciudad de Panama, Panama',
    description: 'Patrimonio, plazas, iglesias y gastronomia en el centro historico de la capital.',
    updated: '8 jul 2026',
    image: cascoAntiguoImage,
    gallery: [cascoAntiguoImage],
    activities: ['Museos', 'Gastronomia', 'Fotografia', 'Cultura'],
    mapUrl: exampleMapUrl,
    isPacificRiviera: false,
  },
]

export const deletedSites = [
  {
    id: 'cascada-perdida-eliminada',
    name: 'Cascada Perdida',
    province: 'Chiriqui',
    location: 'Tierras Altas, Chiriqui',
    description: 'Registro demostrativo de un sitio enviado al basurero.',
    image: boqueteImage,
    gallery: [boqueteImage],
    activities: ['Senderismo', 'Naturaleza'],
    mapUrl: exampleMapUrl,
    isPacificRiviera: false,
    deletedBy: 'Administrador',
    deletedAt: '2026-07-01T15:30:00.000Z',
    expiresAt: '2026-08-20T15:30:00.000Z',
  },
]

export const provinceCoverage = [
  { name: 'Bocas del Toro', sites: 18 },
  { name: 'Chiriqui', sites: 21 },
  { name: 'Veraguas', sites: 16 },
  { name: 'Panama', sites: 24 },
]

export const users = [
  {
    username: 'Administrador',
    type: 'Administrador',
    lastAccess: 'Ahora',
  },
  {
    username: 'mariana.contenido',
    type: 'Co-administrador',
    lastAccess: 'Hace 18 min',
  },
  {
    username: 'carlos.fotos',
    type: 'Usuario',
    lastAccess: 'Hace 2 h',
  },
  {
    username: 'andrea.editor',
    type: 'Usuario',
    lastAccess: '8 jul 2026',
  },
]

export const permissionLabels = [
  { key: 'createSite', label: 'Crear sitios' },
  { key: 'editPublished', label: 'Editar publicaciones' },
  { key: 'editDraft', label: 'Editar borradores' },
  { key: 'deleteSite', label: 'Eliminar sitios' },
  { key: 'publish', label: 'Publicar' },
]

export const userPermissions = [
  {
    username: 'Administrador',
    createSite: true,
    editPublished: true,
    editDraft: true,
    deleteSite: true,
    publish: true,
  },
  {
    username: 'mariana.contenido',
    createSite: true,
    editPublished: true,
    editDraft: true,
    deleteSite: false,
    publish: true,
  },
  {
    username: 'carlos.fotos',
    createSite: false,
    editPublished: false,
    editDraft: true,
    deleteSite: false,
    publish: false,
  },
  {
    username: 'andrea.editor',
    createSite: true,
    editPublished: true,
    editDraft: true,
    deleteSite: false,
    publish: false,
  },
]
