# San Norberto Salud

Plataforma privada de análisis estadístico sanitario para SOCIEDAD DE SERVICIOS SOCIALES Y DE SALUD SAN NORBERTO Ltda. (comuna de Melipilla, Chile). Ver el [PRD completo](docs/PRD_San_Norberto_Salud.md) para alcance, requisitos y arquitectura de datos.

## Estructura del repositorio

- [`app/`](app) — SPA en React 18 + TypeScript + Vite (ShadCN/Radix, TanStack Query/Table, Zustand, MapLibre). Actualmente usa repositorios en memoria (`app/src/data`) que reflejan 1:1 el esquema Postgres definido en el PRD.
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

## Producción

El proyecto de Supabase de producción se crea por separado en [supabase.com](https://supabase.com); las migraciones de `supabase/migrations` se aplican allí con `npx supabase link` + `npx supabase db push` cuando corresponda.
