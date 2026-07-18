import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Download, Upload } from 'lucide-react'
import Papa from 'papaparse'
import { useState } from 'react'
import { StatusBadge } from '@/components/shared/badges/StatusBadge'
import { toastError, toastSuccess } from '@/components/shared/feedback/ToastHelpers'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ageRangesRepository } from '@/data/repositories/ageRanges.repository'
import { clinicsRepository } from '@/data/repositories/clinics.repository'
import { diseasesRepository } from '@/data/repositories/diseases.repository'
import { genderCategoriesRepository } from '@/data/repositories/genderCategories.repository'
import { healthRecordsRepository } from '@/data/repositories/healthRecords.repository'
import { sectorsRepository } from '@/data/repositories/sectors.repository'
import { useCurrentProfile } from '@/features/auth/store/session.store'
import { queryKeys } from '@/lib/query/queryKeys'
import { downloadImportTemplate } from '../lib/importTemplate'
import { type ParsedImportRow, parseImportRows } from '../lib/parseImportRows'

interface ImportRecordsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ImportRecordsDialog({ open, onOpenChange }: ImportRecordsDialogProps) {
  const profile = useCurrentProfile()
  const queryClient = useQueryClient()
  const [rows, setRows] = useState<ParsedImportRow[] | null>(null)
  const [fileName, setFileName] = useState('')
  const [isImporting, setIsImporting] = useState(false)

  const diseasesQuery = useQuery({ queryKey: queryKeys.diseases.list(), queryFn: () => diseasesRepository.list() })
  const ageRangesQuery = useQuery({ queryKey: queryKeys.ageRanges.list(), queryFn: () => ageRangesRepository.list() })
  const gendersQuery = useQuery({ queryKey: queryKeys.genderCategories.list(), queryFn: () => genderCategoriesRepository.list() })
  const sectorsQuery = useQuery({ queryKey: queryKeys.sectors.list(), queryFn: () => sectorsRepository.list() })
  const clinicsQuery = useQuery({ queryKey: queryKeys.clinics.list(), queryFn: () => clinicsRepository.list() })

  const catalogsReady = diseasesQuery.data && ageRangesQuery.data && gendersQuery.data && sectorsQuery.data && clinicsQuery.data

  const handleFile = (file: File) => {
    setFileName(file.name)
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        if (!catalogsReady) return
        const existingRecords = await healthRecordsRepository.list()
        const parsed = parseImportRows(results.data, {
          diseases: diseasesQuery.data!,
          ageRanges: ageRangesQuery.data!,
          genders: gendersQuery.data!,
          sectors: sectorsQuery.data!,
          clinics: clinicsQuery.data!,
          existingRecords,
        })
        setRows(parsed)
      },
      error: () => toastError('No se pudo leer el archivo', 'Verifica que sea un CSV válido con codificación UTF-8.'),
    })
  }

  const toggleRow = (index: number, incluida: boolean) => {
    setRows((current) => current?.map((row, i) => (i === index ? { ...row, incluida } : row)) ?? null)
  }

  const resetState = () => {
    setRows(null)
    setFileName('')
  }

  const confirmarImportacion = async () => {
    if (!rows || !profile) return
    const aImportar = rows.filter((row) => row.incluida && row.resuelto)
    if (aImportar.length === 0) {
      toastError('No hay filas seleccionadas para importar')
      return
    }

    setIsImporting(true)
    try {
      await Promise.all(
        aImportar.map((row) =>
          healthRecordsRepository.create({
            alcance: row.resuelto!.clinic_id ? 'clinica' : 'sector',
            clinic_id: row.resuelto!.clinic_id,
            sector_id: row.resuelto!.sector_id,
            disease_id: row.resuelto!.disease_id,
            age_range_id: row.resuelto!.age_range_id,
            gender_id: row.resuelto!.gender_id,
            mes: row.resuelto!.mes,
            anio: row.resuelto!.anio,
            cantidad_casos: row.resuelto!.cantidad_casos,
            estado: 'pendiente',
            origen: 'importado',
            fuente: fileName,
            observacion_revision: null,
            creado_por: profile.id,
            aprobado_por: null,
            fecha_aprobacion: null,
            creado_en: new Date().toISOString(),
            actualizado_en: new Date().toISOString(),
          }),
        ),
      )
      await queryClient.invalidateQueries({ queryKey: queryKeys.healthRecords.all })
      toastSuccess(`${aImportar.length} registro(s) importado(s)`, 'Quedaron pendientes de aprobación.')
      resetState()
      onOpenChange(false)
    } catch (error) {
      toastError('Ocurrió un error al importar', error instanceof Error ? error.message : undefined)
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) resetState()
      }}
    >
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Importar registros desde Excel/CSV</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={downloadImportTemplate}>
              <Download className="size-3.5" aria-hidden="true" />
              Descargar plantilla
            </Button>
            <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-input bg-transparent px-2.5 py-1.5 text-sm font-medium hover:bg-muted">
              <Upload className="size-3.5" aria-hidden="true" />
              {fileName || 'Seleccionar archivo CSV'}
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFile(file)
                }}
              />
            </label>
          </div>

          {rows ? (
            <>
              <div className="max-h-[360px] overflow-auto rounded-lg border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Incluir</TableHead>
                      <TableHead>Fila</TableHead>
                      <TableHead>Enfermedad</TableHead>
                      <TableHead>Clínica/Sector</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Casos</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Detalle</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Checkbox
                            checked={row.incluida}
                            disabled={row.estado === 'error'}
                            onCheckedChange={(checked) => toggleRow(index, checked === true)}
                          />
                        </TableCell>
                        <TableCell>{row.numero_fila}</TableCell>
                        <TableCell>{row.datosOriginales.enfermedad}</TableCell>
                        <TableCell>{row.datosOriginales.clinica || row.datosOriginales.sector}</TableCell>
                        <TableCell>
                          {row.datosOriginales.mes}/{row.datosOriginales.anio}
                        </TableCell>
                        <TableCell>{row.datosOriginales.casos}</TableCell>
                        <TableCell>
                          <StatusBadge status={row.estado === 'valida' ? 'aprobado' : row.estado === 'advertencia' ? 'pendiente' : 'rechazado'} />
                        </TableCell>
                        <TableCell className="max-w-[220px] text-xs text-muted-foreground">
                          {row.errores.length > 0
                            ? row.errores.join('; ')
                            : row.esPosibleDuplicado
                              ? `Posible duplicado (registro existente con ${row.duplicadoDe?.cantidad_casos} casos)`
                              : 'Lista para importar'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="text-xs text-muted-foreground">
                {rows.filter((r) => r.estado === 'error').length} fila(s) con error (no se pueden importar) ·{' '}
                {rows.filter((r) => r.estado === 'advertencia').length} posible(s) duplicado(s) · quedarán como "pendiente de revisión".
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Descarga la plantilla, complétala con tus registros y súbela para previsualizar los datos antes de confirmar la importación.
            </p>
          )}

          <div className="flex justify-end gap-2 border-t border-border pt-3.5">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="button" disabled={!rows || isImporting} onClick={confirmarImportacion}>
              {isImporting ? 'Importando…' : 'Confirmar importación'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
