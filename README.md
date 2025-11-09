# Justo y Bueno — Prototipo (Frontend Next.js + Datos Mock)

Este repositorio contiene un prototipo de una aplicación de pedidos y gestión para un servicio de delivery, construido con Next.js (app dir) y TypeScript. Está pensado como demo/prototipo: no necesita una base de datos real para ejecutar las funcionalidades principales (login demo, navegación, añadir pedidos en memoria).

## Estado del proyecto
- Frontend: Next.js 16 (Turbopack), React 19, TypeScript.
- Backend: existe una carpeta `backend/` con un servidor Express (opcional). El prototipo puede correr solo con el frontend usando datos mock en `lib/mock-data.ts`.
- Contexto de la app: `lib/app-context.tsx` provee `useAppContext()` con estado in-memory (usuarios mock, `orders`, `addOrder`, `updateOrderStatus`, `updateOrderRating`, etc.).

> Nota: En una sesión previa se reparó un error runtime "TypeError: addOrder is not a function" añadiendo `orders` y `addOrder` al provider en `lib/app-context.tsx`. Si ves ese error, asegúrate de estar usando la versión más reciente del archivo.

## Requisitos
- Node.js (recomendado >= 18)
- pnpm (recomendado) — también funcionan npm/yarn pero los comandos del README usan `pnpm`.

## Instalación
1. Desde la raíz del proyecto instala dependencias:

```bash
pnpm install
```

## Scripts útiles (en `package.json`)
- `pnpm dev` — inicia concurrentemente Next.js (frontend) y el backend dev (si existe). El backend usa `ts-node-dev`.
- `pnpm exec next dev` — inicia solo el frontend (útil para prototipo sin backend).
- `pnpm build` — compila la aplicación Next.js.
- `pnpm start` — sirve la versión construida (producción).

### Ejecutar solo el frontend (recomendado para prototipo)
Si quieres evitar problemas con el backend (por ejemplo si no tienes configurado `backend/src/config/config.ts`), inicia solo el frontend:

```bash
pnpm exec next dev
```

Luego abre: http://localhost:3000

### Ejecutar frontend + backend (opcional)
El script `pnpm dev` intenta arrancar ambos. Si el backend no está configurado correctamente, puede fallar con un error tipo "Cannot find module 'backend/src/config/config'". En ese caso:
- Asegúrate de que `backend/src/config/config.ts` exista y/o que las variables de entorno estén definidas.
- O ejecuta solo el frontend como alternativa (ver sección anterior).

```bash
pnpm dev
# o, si prefieres solo frontend
pnpm exec next dev
```

## Login y roles (mock)
El prototipo usa usuarios mock definidos en `lib/mock-data.ts`. En la pantalla de login puedes introducir un email y elegir rol (customer, restaurant, admin, operator). Si el email no coincide con ninguno de los mocks, el sistema generará un usuario temporal basado en el email.

Roles disponibles (demo):
- customer — cliente final que hace pedidos
- restaurant — gestión del establecimiento (turnos, pedidos)
- delivery — repartidor (en algunas vistas)
- admin — panel administrativo

## Pedidos (prototype flow)
- La lógica de pedidos funciona en memoria en `lib/app-context.tsx`.
- `addOrder(order)` añade un pedido a la lista `orders` en memoria y asigna un `queueNumber` por restaurante.
- `updateOrderStatus(orderId, status)` y `updateOrderRating(orderId, rating, feedback)` existen para simular flujo de cambios de estado y valoraciones.

Esto permite probar:
- El flujo de creación de pedidos desde el navegador.
- Vistas de establecimiento que muestran la cola electrónica (`queueNumber`).

## Problemas conocidos y debugging
- Error: "TypeError: addOrder is not a function"
  - Causa: el provider de contexto no exporta `addOrder` (o no está envuelto). Solución:
    - Verifica que `lib/app-context.tsx` exporta `AppProvider` y que su `value` incluye `orders` y `addOrder`.
    - Verifica que `AppProvider` envuelve la app en `app/layout.tsx` (ya lo hace en este proyecto).

- Error en backend al correr `pnpm dev`:
  - Mensaje frecuente: "Cannot find module 'backend/src/config/config'"
  - Solución: Si no quieres usar el backend, ejecuta solo frontend. Si quieres arrancar el backend, crea/configura `backend/src/config/config.ts` o define las variables de entorno requeridas (p.ej. `BACKEND_PORT`, `MONGODB_URI`).

## Estructura relevante
- `app/` — rutas y layout de Next.js (app dir).
- `components/` — componentes React (dashboards, login, browser, etc.).
- `lib/` — utilidades y provider de app (`app-context.tsx`, `mock-data.ts`, `utils.ts`).
- `backend/` — servidor Express + modelos (opcional en prototipo).

## Contribuir / desarrollo
- Para cambios rápidos en UI: editar componentes en `components/` y usar el hot-reload de Next.
- Para cambiar datos mock: editar `lib/mock-data.ts`.

## Contacto
Si necesitas ayuda con la puesta en marcha o quieres que revise algo concreto del backend/prototipo, dime qué prefieres (ejecutar frontend solo, arreglar backend o añadir persistencia) y lo hago.

---
*README generado automáticamente en español por el desarrollador/prototipo. Fecha: 2025-11-09.*
