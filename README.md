# San Norberto Salud

Plataforma privada de análisis estadístico sanitario para SOCIEDAD DE SERVICIOS SOCIALES Y DE SALUD SAN NORBERTO Ltda. (comuna de Melipilla, Chile). Ver el [PRD completo](docs/PRD_San_Norberto_Salud.md) para alcance, requisitos y arquitectura de datos.

## Estructura del repositorio

- [`app/`](app) — SPA en React 18 + TypeScript + Vite (ShadCN/Radix, TanStack Query/Table, Zustand, MapLibre). Por defecto usa repositorios en memoria (`app/src/data`) que reflejan 1:1 el esquema Postgres definido en el PRD; con `VITE_USE_SUPABASE=true` los repositorios de catálogos, perfiles y registros de salud pasan a consultar Supabase real (ver abajo).
- [`supabase/`](supabase) — proyecto Supabase (CLI) con migraciones SQL del esquema de datos, para desarrollo local vía Docker.
- [`docs/`](docs) — PRD y documentación de producto.
- [`design/`](design) — logotipos fuente y prototipo visual de referencia (no modificar el lenguaje visual sin justificar el ajuste, según PRD §13.1).

## Desarrollo local

### Frontend

```bash
cd app
npm install
npm run dev
```

### Backend (Supabase local, requiere Docker Desktop corriendo)

```bash
npx supabase start
```

Esto levanta Postgres, Auth, Storage, Realtime y Studio en contenedores locales y aplica las migraciones de `supabase/migrations`. Al finalizar, copia la `anon key` y la URL que imprime el comando a `app/.env.local` (ver `app/.env.example`).

Para detener los contenedores: `npx supabase stop`.

### Conectar el frontend a Supabase local

1. En `app/.env.local`, agrega `VITE_USE_SUPABASE=true` (además de `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY`).
2. Crea los usuarios de prueba (Supabase Auth + su `profiles`): `cd app && npm run seed:auth`.
3. `npm run dev` e inicia sesión con:

   | Rol | Correo | Contraseña |
   |---|---|---|
   | Administrador general | `admin@sannorbertosalud.cl` | `SanNorberto2026!` |
   | Usuario de clínica (Hospital San José) | `hospital@sannorbertosalud.cl` | `SanNorberto2026!` |

   Credenciales solo válidas contra la instancia local — `npm run seed:auth` se niega a correr contra cualquier URL que no sea `localhost`/`127.0.0.1`.

Sin `VITE_USE_SUPABASE=true`, la app sigue funcionando 100% con datos demo en memoria, sin depender de Docker.

### Investigación asistida por IA (RF-21/26)

La Edge Function `supabase/functions/ai-research` resuelve el proveedor por variable de entorno (`AI_PROVIDER`), agnóstico del frontend y del modelo de datos (RNF-19/20):

- Sin configurar nada, usa un proveedor **mock** determinístico — permite probar todo el flujo (solicitud → propuesta → aprobación) sin ninguna API key.
- Para usar Anthropic real: `npx supabase secrets set AI_PROVIDER=anthropic ANTHROPIC_API_KEY=sk-...` y reinicia con `npx supabase stop && npx supabase start`. Agregar otro proveedor implica sumar un `AiProvider` más en `resolveProvider()` — la Edge Function, el frontend y el modelo de datos no cambian (RNF-19).

## Producción

El proyecto de Supabase de producción se crea por separado en [supabase.com](https://supabase.com); las migraciones de `supabase/migrations` se aplican allí con `npx supabase link` + `npx supabase db push` cuando corresponda.
