import { mockDelay } from '../mockDelay'

interface WithId {
  id: string
}

/**
 * Fábrica de repositorio en memoria sobre un array de fixtures. Cada repositorio de entidad
 * envuelve esto y agrega su propio `list(filters)` tipado; `create/getById/update/remove` se
 * heredan tal cual. Reemplazar por Supabase en el futuro significa reescribir este archivo,
 * no los hooks ni los componentes que lo consumen.
 */
export function createInMemoryRepository<T extends WithId>(store: T[]) {
  return {
    async list(filterFn?: (item: T) => boolean): Promise<T[]> {
      const items = filterFn ? store.filter(filterFn) : [...store]
      return mockDelay(items)
    },

    async getById(id: string): Promise<T | null> {
      return mockDelay(store.find((item) => item.id === id) ?? null)
    },

    async create(input: Partial<T> & Record<string, unknown>): Promise<T> {
      const item = { ...input, id: (input.id as string | undefined) ?? crypto.randomUUID() } as T
      store.push(item)
      return mockDelay(item)
    },

    async update(id: string, patch: Partial<T>): Promise<T> {
      const index = store.findIndex((item) => item.id === id)
      if (index === -1) {
        throw new Error(`No se encontró el registro con id "${id}"`)
      }
      const updated = { ...store[index], ...patch, id } as T
      store[index] = updated
      return mockDelay(updated)
    },

    async remove(id: string): Promise<void> {
      const index = store.findIndex((item) => item.id === id)
      if (index === -1) return
      store.splice(index, 1)
      await mockDelay(undefined)
    },
  }
}
