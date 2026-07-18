import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useConfirmStore } from '@/stores/confirm.store'

/** Host único de confirmaciones imperativas — se monta una vez en AppProviders. Ver useConfirm(). */
export function ConfirmDialogHost() {
  const isOpen = useConfirmStore((s) => s.isOpen)
  const options = useConfirmStore((s) => s.options)
  const handleConfirm = useConfirmStore((s) => s.handleConfirm)
  const handleCancel = useConfirmStore((s) => s.handleCancel)

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleCancel()
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{options?.title}</AlertDialogTitle>
          {options?.description ? <AlertDialogDescription>{options.description}</AlertDialogDescription> : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>{options?.cancelLabel ?? 'Cancelar'}</AlertDialogCancel>
          <AlertDialogAction variant={options?.variant === 'destructive' ? 'destructive' : 'default'} onClick={handleConfirm}>
            {options?.confirmLabel ?? 'Confirmar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
