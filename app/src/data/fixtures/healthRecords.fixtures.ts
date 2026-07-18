import type { HealthRecord } from '@/types/database.types'
import type { AlcanceRegistro, OrigenRegistro } from '@/types/enums'
import { ageRangesFixture } from './ageRanges.fixtures'
import { GENDER_DEMO_WEIGHTS, genderCategoriesFixture } from './genderCategories.fixtures'
import { sectorsFixture } from './sectors.fixtures'
import { getSectorPopulation } from './sectorPopulation.fixtures'

// Genera registros demo coherentes (RF-08) para 6 meses de 2026, respetando exactamente los
// totales mensuales de Hipertensión/Diabetes/IRA/Obesidad/Depresión/ERC del prototipo visual
// de referencia para mayo y junio, y extendiendo la tendencia hacia enero-abril.

interface PeriodoDemo {
  mes: number
  anio: number
}

const PERIODOS: PeriodoDemo[] = [1, 2, 3, 4, 5, 6].map((mes) => ({ mes, anio: 2026 }))

const TOTALES_POR_ENFERMEDAD_Y_MES: Record<string, number[]> = {
  'disease-hta': [120, 126, 130, 133, 138, 145],
  'disease-dm2': [80, 84, 87, 89, 92, 98],
  'disease-ira': [60, 65, 80, 110, 150, 176],
  'disease-obesidad': [50, 52, 54, 56, 58, 62],
  'disease-depresion': [58, 57, 59, 60, 61, 54],
  'disease-erc': [29, 30, 31, 32, 33, 31],
  'disease-cardiovascular': [40, 42, 44, 45, 47, 49],
  'disease-artrosis': [35, 36, 37, 38, 39, 41],
}

// Pesos de distribución etaria por enfermedad (deben sumar 1), solo para generar datos demo
// clínicamente plausibles — no son una fuente epidemiológica real.
const AGE_WEIGHTS_BY_DISEASE: Record<string, Record<string, number>> = {
  'disease-hta': { 'age-infancia': 0.01, 'age-adolescencia': 0.02, 'age-juventud': 0.05, 'age-adultez-media': 0.4, 'age-tercera-edad': 0.35, 'age-cuarta-edad': 0.17 },
  'disease-dm2': { 'age-infancia': 0.01, 'age-adolescencia': 0.02, 'age-juventud': 0.07, 'age-adultez-media': 0.45, 'age-tercera-edad': 0.3, 'age-cuarta-edad': 0.15 },
  'disease-ira': { 'age-infancia': 0.35, 'age-adolescencia': 0.1, 'age-juventud': 0.1, 'age-adultez-media': 0.2, 'age-tercera-edad': 0.15, 'age-cuarta-edad': 0.1 },
  'disease-obesidad': { 'age-infancia': 0.2, 'age-adolescencia': 0.15, 'age-juventud': 0.15, 'age-adultez-media': 0.35, 'age-tercera-edad': 0.1, 'age-cuarta-edad': 0.05 },
  'disease-depresion': { 'age-infancia': 0.02, 'age-adolescencia': 0.13, 'age-juventud': 0.25, 'age-adultez-media': 0.4, 'age-tercera-edad': 0.15, 'age-cuarta-edad': 0.05 },
  'disease-erc': { 'age-infancia': 0.01, 'age-adolescencia': 0.02, 'age-juventud': 0.05, 'age-adultez-media': 0.32, 'age-tercera-edad': 0.35, 'age-cuarta-edad': 0.25 },
  'disease-cardiovascular': { 'age-infancia': 0.01, 'age-adolescencia': 0.02, 'age-juventud': 0.05, 'age-adultez-media': 0.32, 'age-tercera-edad': 0.38, 'age-cuarta-edad': 0.22 },
  'disease-artrosis': { 'age-infancia': 0, 'age-adolescencia': 0.01, 'age-juventud': 0.04, 'age-adultez-media': 0.3, 'age-tercera-edad': 0.4, 'age-cuarta-edad': 0.25 },
}

const CLINIC_BY_SECTOR: Record<string, string | null> = {
  'sector-centro': 'clinic-cesfam-centro',
  'sector-hospital': 'clinic-hospital',
  'sector-elprado': 'clinic-cesfam-elprado',
  'sector-lasmercedes': 'clinic-posta-lasmercedes',
  'sector-sanmanuel': 'clinic-posta-sanmanuel',
  'sector-ruralnorte': null,
  'sector-ruralsur': null,
  'sector-pomaire': 'clinic-posta-pomaire',
}

const PROFILE_BY_CLINIC: Record<string, string> = {
  'clinic-hospital': 'profile-hospital',
  'clinic-cesfam-centro': 'profile-cesfam-centro',
  'clinic-cesfam-elprado': 'profile-cesfam-elprado',
  'clinic-posta-lasmercedes': 'profile-posta-lasmercedes',
  'clinic-posta-sanmanuel': 'profile-posta-sanmanuel',
  'clinic-posta-pomaire': 'profile-posta-pomaire',
}

/** Reparte `total` entre `weights` (deben sumar ~1) preservando la suma exacta (método del mayor resto). */
function distributeInteger(total: number, weights: number[]): number[] {
  if (total <= 0) return weights.map(() => 0)

  const raw = weights.map((weight) => total * weight)
  const floors = raw.map(Math.floor)
  let remainder = total - floors.reduce((sum, value) => sum + value, 0)

  const order = raw
    .map((value, index) => ({ index, frac: value - Math.floor(value) }))
    .sort((a, b) => b.frac - a.frac)

  const result = [...floors]
  for (let i = 0; i < order.length && remainder > 0; i += 1) {
    result[order[i].index] += 1
    remainder -= 1
  }
  return result
}

function isoDate(anio: number, mes: number, dia: number): string {
  return new Date(Date.UTC(anio, mes - 1, dia, 12, 0, 0)).toISOString()
}

// Multiplicador de incidencia por sector: sin esto, repartir casos en proporción exacta a la
// población produce una tasa por 100.000 hab. casi idéntica en todos los sectores (los casos
// y el denominador escalan juntos), lo que anula el propósito del mapa de riesgo. Estos valores
// son solo para generar variación demo plausible (sectores urbanos densos y el entorno del
// hospital con mayor incidencia relativa; El Prado y Las Mercedes con menor incidencia).
const SECTOR_RISK_MULTIPLIER: Record<string, number> = {
  'sector-centro': 1.3,
  'sector-hospital': 1.7,
  'sector-elprado': 0.2,
  'sector-lasmercedes': 0.35,
  'sector-sanmanuel': 0.7,
  'sector-ruralnorte': 1.0,
  'sector-ruralsur': 0.85,
  'sector-pomaire': 0.55,
}

function buildHealthRecordsFixture(): HealthRecord[] {
  const rows: HealthRecord[] = []
  const sectorShares = (() => {
    const anio = 2026
    const populations = sectorsFixture.map((sector) => getSectorPopulation(sector.id, anio) ?? 0)
    const total = populations.reduce((sum, value) => sum + value, 0)
    const weighted = sectorsFixture.map((sector, index) => (populations[index] / total) * (SECTOR_RISK_MULTIPLIER[sector.id] ?? 1))
    const weightedTotal = weighted.reduce((sum, value) => sum + value, 0)
    return sectorsFixture.map((sector, index) => ({ sectorId: sector.id, share: weighted[index] / weightedTotal }))
  })()

  const pendientesObjetivoPorMes: Record<number, number> = { 5: 3, 6: 5 }
  let recordIndex = 0

  for (const periodo of PERIODOS) {
    const monthIndex = periodo.mes - 1
    const filasDelMes: HealthRecord[] = []

    for (const [diseaseId, totales] of Object.entries(TOTALES_POR_ENFERMEDAD_Y_MES)) {
      const totalMes = totales[monthIndex]
      const porSector = distributeInteger(totalMes, sectorShares.map((s) => s.share))

      sectorShares.forEach(({ sectorId }, sectorIdx) => {
        const totalSector = porSector[sectorIdx]
        if (totalSector <= 0) return

        const ageWeights = AGE_WEIGHTS_BY_DISEASE[diseaseId]
        const ageIds = ageRangesFixture.map((a) => a.id)
        const porEdad = distributeInteger(totalSector, ageIds.map((id) => ageWeights[id] ?? 0))

        ageIds.forEach((ageRangeId, ageIdx) => {
          const totalEdad = porEdad[ageIdx]
          if (totalEdad <= 0) return

          const genderIds = genderCategoriesFixture.map((g) => g.id)
          const porGenero = distributeInteger(totalEdad, genderIds.map((id) => GENDER_DEMO_WEIGHTS[id] ?? 0))

          genderIds.forEach((genderId, genderIdx) => {
            const cantidadCasos = porGenero[genderIdx]
            if (cantidadCasos <= 0) return

            const clinicId = CLINIC_BY_SECTOR[sectorId]
            const alcance: AlcanceRegistro = clinicId ? 'clinica' : 'sector'
            const creadoPor = clinicId ? PROFILE_BY_CLINIC[clinicId] : 'profile-admin'

            let origen: OrigenRegistro = 'manual'
            if (recordIndex % 13 === 0) origen = 'importado'
            else if (recordIndex % 29 === 0) origen = 'ia'

            const diaCreacion = 3 + (recordIndex % 24)
            const creadoEn = isoDate(periodo.anio, periodo.mes, diaCreacion)

            filasDelMes.push({
              id: `hr-${diseaseId}-${sectorId}-${ageRangeId}-${genderId}-${periodo.anio}-${String(periodo.mes).padStart(2, '0')}`,
              alcance,
              clinic_id: clinicId,
              sector_id: sectorId,
              disease_id: diseaseId,
              age_range_id: ageRangeId,
              gender_id: genderId,
              mes: periodo.mes,
              anio: periodo.anio,
              cantidad_casos: cantidadCasos,
              estado: 'aprobado',
              origen,
              fuente: origen === 'importado' ? 'Importación Excel/CSV' : null,
              observacion_revision: null,
              creado_por: creadoPor,
              aprobado_por: 'profile-admin',
              fecha_aprobacion: isoDate(periodo.anio, periodo.mes, Math.min(diaCreacion + 2, 28)),
              creado_en: creadoEn,
              actualizado_en: creadoEn,
            })

            recordIndex += 1
          })
        })
      })
    }

    // Deja algunos registros del período más reciente sin revisar, para poblar
    // el Centro de Aprobaciones (RF-11/RF-12) con la misma cantidad que el prototipo.
    const objetivoPendientes = pendientesObjetivoPorMes[periodo.mes] ?? 0
    for (let i = 0; i < objetivoPendientes && i < filasDelMes.length; i += 1) {
      const row = filasDelMes[filasDelMes.length - 1 - i]
      row.estado = 'pendiente'
      row.aprobado_por = null
      row.fecha_aprobacion = null
    }
    if (periodo.mes === 6 && filasDelMes.length > 0) {
      const rechazo = filasDelMes[0]
      rechazo.estado = 'rechazado'
      rechazo.observacion_revision =
        'La cantidad informada no coincide con el respaldo adjunto; se solicita reingresar con la planilla corregida.'
    }

    rows.push(...filasDelMes)
  }

  return rows
}

export const healthRecordsFixture = buildHealthRecordsFixture()
