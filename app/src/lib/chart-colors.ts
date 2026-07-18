// Recharts recibe colores como strings (props `fill`/`stroke`), no puede consumir clases
// Tailwind. Estos valores deben mantenerse en sincronía con los tokens de src/index.css.
// Es la única fuente de verdad de color que se referencia desde código JS/TS en vez de CSS.

export const RISK_COLORS = {
  bajo: '#2E9D68',
  medio: '#E5B73B',
  alto: '#E98132',
  extremo: '#D84A4A',
} as const

export const RISK_LABELS = {
  bajo: 'Bajo',
  medio: 'Medio',
  alto: 'Alto',
  extremo: 'Extremo',
} as const

// Único hue de la serie de "casos por enfermedad": el prototipo no usa color categórico ahí
// (todas las barras son azul principal; la enfermedad filtrada se atenúa con CHART_NEUTRAL_COLOR).
export const CHART_PRIMARY_COLOR = '#176B87'

// Paleta categórica institucional para el donut de sexo/género (4 categorías fijas).
// Nota (skill dataviz): validate_palette.js marca FAIL en piso de croma/luminancia para
// #176B87 y #647784 al tratarse de colores de marca poco saturados; la mitigación exigida
// por el propio skill para ese caso ("legal solo con etiquetado directo") ya está aplicada:
// ChartLegend siempre muestra categoría + porcentaje como texto visible, nunca solo el color.
// Se mantiene la paleta institucional exacta del prototipo por mandato del PRD (no alterar
// la identidad visual aprobada) en vez de sustituir por colores no ligados a la marca.
export const GENDER_CHART_COLORS = ['#176B87', '#2FAE82', '#E5B73B', '#647784'] as const

export const STATUS_COLORS = {
  pendiente: '#E5B73B',
  aprobado: '#2FAE82',
  rechazado: '#D84A4A',
  requiere_correccion: '#E98132',
} as const

export const CHART_NEUTRAL_COLOR = 'rgba(23, 107, 135, 0.25)'
export const CHART_TOOLTIP_BG = '#123B52'
export const CHART_GRID_COLOR = '#F0F3F4'
export const CHART_AXIS_TEXT_COLOR = '#647784'
