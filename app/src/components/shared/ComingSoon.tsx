import { Construction } from 'lucide-react'
import { EmptyState } from './states/EmptyState'

export function ComingSoon({ title }: { title: string }) {
  return (
    <EmptyState
      icon={Construction}
      title={`${title} — próximamente`}
      description="Este módulo se construye en la siguiente etapa de la implementación."
    />
  )
}
