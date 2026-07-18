import { useConfirmStore } from '@/stores/confirm.store'
import type { ConfirmOptions } from '@/stores/confirm.store'

/** `const confirm = useConfirm(); if (await confirm({ title, variant: 'destructive' })) { ... }` */
export function useConfirm(): (options: ConfirmOptions) => Promise<boolean> {
  return useConfirmStore((state) => state.request)
}
