import { create } from 'zustand'

export interface ConfirmOptions {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  /** "destructive" para eliminar/rechazar; "default" para aprobar/confirmar acciones sensibles no destructivas. */
  variant?: 'default' | 'destructive'
}

interface ConfirmState {
  isOpen: boolean
  options: ConfirmOptions | null
  resolve: ((value: boolean) => void) | null
  request: (options: ConfirmOptions) => Promise<boolean>
  handleConfirm: () => void
  handleCancel: () => void
}

// Toda acción sensible (crear, modificar, eliminar, importar, aprobar) requiere confirmación
// visible antes de ejecutarse (principio rector del PRD). Este store respalda useConfirm().
export const useConfirmStore = create<ConfirmState>((set, get) => ({
  isOpen: false,
  options: null,
  resolve: null,
  request(options) {
    return new Promise<boolean>((resolve) => {
      set({ isOpen: true, options, resolve })
    })
  },
  handleConfirm() {
    get().resolve?.(true)
    set({ isOpen: false, options: null, resolve: null })
  },
  handleCancel() {
    get().resolve?.(false)
    set({ isOpen: false, options: null, resolve: null })
  },
}))
