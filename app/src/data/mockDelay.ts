// Simula la latencia de red de un backend real para que los estados de "cargando" (RNF-15)
// sean visibles durante el desarrollo con datos demo. Se elimina naturalmente al migrar a Supabase.
export function mockDelay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms)
  })
}
