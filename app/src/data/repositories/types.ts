// Contrato fijo que deben cumplir todos los repositorios, sea cual sea su fuente de datos
// (fixtures en memoria hoy, Supabase mañana). Los hooks de cada feature solo dependen de esta
// forma, nunca de si el dato viene de un array local o de una llamada de red.
export interface Repository<T extends { id: string }> {
  list(filters?: unknown): Promise<T[]>
  getById(id: string): Promise<T | null>
  create(input: Partial<T>): Promise<T>
  update(id: string, input: Partial<T>): Promise<T>
  remove(id: string): Promise<void>
}
