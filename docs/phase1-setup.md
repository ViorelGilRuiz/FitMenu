# FitMenu AI - Fase 1 (Base Escalable)

## Objetivo
Dejar operativa la base tecnica con:
- Monorepo npm workspaces
- Backend NestJS modular con auth JWT + refresh
- Swagger y validacion DTO
- Prisma + PostgreSQL
- AI module separado con BullMQ + Redis
- Frontend Angular 18 standalone con lazy routes, guard y estado con signals

## Comandos

### 1) Instalar dependencias
```bash
npm install
```

### 2) Infra local (PostgreSQL + Redis)
```bash
docker compose up -d postgres redis
```

### 3) Variables de entorno
```bash
cp .env.example apps/api/.env
```

### 4) Prisma
```bash
npm --workspace apps/api run prisma:generate
npm --workspace apps/api run prisma:migrate
```

### 5) Ejecutar backend
```bash
npm run dev:api
```

### 6) Ejecutar frontend
```bash
npm run dev:web
```

### 7) Tests y build
```bash
npm --workspace apps/api run test
npm --workspace apps/api run build
npm --workspace apps/web run build
```

## Criterios de aceptacion
- `GET /api/health` responde `{ "status": "ok" }`.
- `http://localhost:3000/docs` muestra Swagger.
- Registro y login devuelven `accessToken` y `refreshToken`.
- `GET /api/users/me` requiere Bearer token valido.
- `POST /api/ai/generate-menu` encola trabajo y devuelve `jobId`.
- `GET /api/ai/jobs/:id` muestra estado `queued|processing|done|failed`.
- Frontend Angular carga login, protege `/dashboard` con guard y consume API.

## Nota de entorno
En esta maquina no hay Docker CLI disponible, por lo que la verificacion runtime contra PostgreSQL/Redis queda pendiente hasta instalar Docker Desktop o usar servicios remotos equivalentes.
