// Factory centralizada de query keys por entidad. Toda mutación invalida `entidad.all`
// para refrescar listas y detalle sin tener que recordar la forma exacta de cada key.

function createEntityKeys<TName extends string>(name: TName) {
  return {
    all: [name] as const,
    lists: () => [name, 'list'] as const,
    list: (filters?: unknown) => [name, 'list', filters ?? {}] as const,
    details: () => [name, 'detail'] as const,
    detail: (id: string) => [name, 'detail', id] as const,
  }
}

export const queryKeys = {
  profiles: createEntityKeys('profiles'),
  clinics: createEntityKeys('clinics'),
  sectors: createEntityKeys('sectors'),
  diseases: createEntityKeys('diseases'),
  ageRanges: createEntityKeys('ageRanges'),
  genderCategories: createEntityKeys('genderCategories'),
  communePopulation: createEntityKeys('communePopulation'),
  sectorPopulation: createEntityKeys('sectorPopulation'),
  demographicPopulation: createEntityKeys('demographicPopulation'),
  healthRecords: createEntityKeys('healthRecords'),
  riskThresholds: createEntityKeys('riskThresholds'),
  percentageThresholds: createEntityKeys('percentageThresholds'),
  dataSources: createEntityKeys('dataSources'),
  importBatches: createEntityKeys('importBatches'),
  aiResearchRequests: createEntityKeys('aiResearchRequests'),
  aiDataProposals: createEntityKeys('aiDataProposals'),
}
