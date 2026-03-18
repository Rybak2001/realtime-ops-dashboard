# Módulo de Monitoreo Operativo en Tiempo Real

Submódulo analítico para supervisar incidencias, productividad y estado de servicio con visualización en tiempo real.

## Tech Stack

- **Frontend:** Next.js 14 (App Router) + Tailwind CSS + Chart.js (react-chartjs-2)
- **Backend:** Next.js API Routes
- **Base de datos:** MongoDB Atlas (Mongoose)
- **Deploy:** Vercel

## Funcionalidades

- Dashboard con gráficas en tiempo real (Chart.js)
- Gestión de incidencias (crear, resolver, cerrar)
- Métricas de productividad y estado de servicio
- Filtros por rango de fechas y área
- Exportación CSV de incidencias
- Indicadores KPI en cards

## Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/Rybak1234/realtime-ops-dashboard.git
cd realtime-ops-dashboard
npm install
```

### 2. Configurar variables de entorno

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Crea un cluster gratuito en [MongoDB Atlas](https://www.mongodb.com/atlas) y pega la URI de conexión.

### 3. Ejecutar en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### 4. Deploy en Vercel

1. Sube el repo a GitHub
2. Importa en [vercel.com](https://vercel.com)
3. Agrega `MONGODB_URI` en Environment Variables
4. Deploy automático

## Estructura

```
src/
├── app/
│   ├── api/
│   │   ├── incidents/     # CRUD incidencias
│   │   ├── metrics/       # Métricas agregadas
│   │   └── export/        # Exportación CSV
│   ├── incidents/         # Gestión de incidencias
│   └── page.tsx           # Dashboard principal
├── components/            # Gráficos y widgets
├── lib/                   # Conexión MongoDB
└── models/                # Modelos Mongoose
```
