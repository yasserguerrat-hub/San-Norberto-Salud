import { DemoDataBadge } from '@/components/shared/badges/DemoDataBadge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCurrentProfile } from '@/features/auth/store/session.store'
import { CommunePopulationTab } from '../components/CommunePopulationTab'
import { DemographicPopulationTab } from '../components/DemographicPopulationTab'
import { SectorPopulationTab } from '../components/SectorPopulationTab'

export function PopulationPage() {
  const profile = useCurrentProfile()
  const canManage = profile?.rol === 'admin_general'

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Denominadores poblacionales usados para calcular tasas por 100.000 habitantes (RF-13).
        </p>
        <DemoDataBadge />
      </div>

      <Tabs defaultValue="comuna">
        <TabsList>
          <TabsTrigger value="comuna">Comuna</TabsTrigger>
          <TabsTrigger value="sector">Por sector</TabsTrigger>
          <TabsTrigger value="demografica">Demográfica</TabsTrigger>
        </TabsList>
        <TabsContent value="comuna">
          <CommunePopulationTab canManage={canManage} />
        </TabsContent>
        <TabsContent value="sector">
          <SectorPopulationTab canManage={canManage} />
        </TabsContent>
        <TabsContent value="demografica">
          <DemographicPopulationTab canManage={canManage} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
