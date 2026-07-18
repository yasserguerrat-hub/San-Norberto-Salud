export const APP_NAME = 'San Norberto Salud'
export const COMUNA = 'Melipilla'

// Se apaga con VITE_USE_SUPABASE=true (app/.env.local), sin tocar cada componente
// individualmente (ver hook useIsDemoMode). Por defecto sigue en modo demo.
export const IS_DEMO_DATA = import.meta.env.VITE_USE_SUPABASE !== 'true'
