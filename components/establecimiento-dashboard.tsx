"use client"

import { useState } from "react"
import { useAppContext } from "@/lib/app-context"
import { mockRestaurants } from "@/lib/mock-data"

type EstablecimientoTab = "turno" | "pedidos" | "inventario" | "reportes" | "pagos"

export default function EstablecimientoDashboard() {
  const [activeTab, setActiveTab] = useState<EstablecimientoTab>("turno")
  const { user, logout, orders } = useAppContext()

  const restaurant = mockRestaurants.find((r) => r.id === user?.restaurantId)
  const restaurantOrders = orders.filter((o) => o.restaurantId === user?.restaurantId)

  const tabs = [
    { id: "turno", label: "Turno Electrónico" },
    { id: "pedidos", label: "Gestión de Pedidos" },
    { id: "inventario", label: "Inventario" },
    { id: "reportes", label: "Reportes y Ventas" },
    { id: "pagos", label: "Gestión de Pagos" },
  ] as const

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">E-Food - Panel de Establecimiento</h1>
            <p className="text-sm text-primary-foreground/80">{restaurant?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">{user?.name}</span>
            <button
              onClick={logout}
              className="bg-primary-foreground text-primary px-4 py-2 rounded-lg font-semibold hover:opacity-90"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-blue-100 dark:bg-blue-950 border-2 border-blue-400 rounded-lg p-4 mb-6">
          <p className="text-sm font-bold text-blue-700 dark:text-blue-200 mb-1">💻 IMPRESORA TÉRMICA GRATIS</p>
          <p className="text-xs text-blue-600 dark:text-blue-300">
            Recibe una impresora térmica para tu establecimiento • Conectividad WiFi y Bluetooth • Soporte técnico 24/7
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Pedidos Hoy" value={restaurantOrders.length} change="En progreso" />
          <StatCard title="Ingresos Hoy" value="$1,250.75" change="7 pedidos completados" />
          <StatCard title="Calificación" value="4.7/5.0" change="Basado en 45 reseñas" />
          <StatCard
            title="Estado"
            value={restaurant?.isOpen ? "Abierto" : "Cerrado"}
            change="Centro comercial activo"
          />
        </div>

        <div className="flex gap-2 mb-8 border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 font-semibold whitespace-nowrap transition ${
                activeTab === tab.id
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "turno" && <TurnoElectronicoTab orders={restaurantOrders} />}
        {activeTab === "pedidos" && <GestionPedidosTab orders={restaurantOrders} />}
        {activeTab === "inventario" && <InventarioTab restaurantId={user?.restaurantId} />}
        {activeTab === "reportes" && <ReportesTab orders={restaurantOrders} />}
        {activeTab === "pagos" && <GestionPagosTab orders={restaurantOrders} />}
      </div>
    </div>
  )
}

function StatCard({ title, value, change }: { title: string; value: string | number; change: string }) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-md">
      <p className="text-muted-foreground text-sm mb-2">{title}</p>
      <h3 className="text-3xl font-bold mb-2">{value}</h3>
      <p className="text-sm text-muted-foreground">{change}</p>
    </div>
  )
}

function TurnoElectronicoTab({ orders }: { orders: any[] }) {
  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "confirmed")

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">📱 Turno Electrónico - Cola de Atención</h2>

      {pendingOrders.length === 0 ? (
        <div className="bg-card rounded-lg p-12 shadow-md text-center">
          <p className="text-muted-foreground text-lg">No hay pedidos en espera</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {pendingOrders.map((order) => (
            <div key={order.id} className="bg-card rounded-lg p-6 shadow-md border-2 border-primary">
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">Número en Cola</p>
                <p className="text-5xl font-bold text-primary mb-2">{order.queueNumber}</p>
              </div>

              <div className="mb-4 bg-muted p-3 rounded-lg">
                <p className="text-sm font-semibold mb-2">Pedido: {order.id}</p>
                <p className="text-xs text-muted-foreground mb-2">Cliente: {order.customerId}</p>
                <div className="space-y-1 mb-3">
                  {order.items.map((item: any, idx: number) => (
                    <p key={idx} className="text-xs">
                      {item.quantity}x {item.name}
                    </p>
                  ))}
                </div>
                <p className="text-sm font-bold text-primary">Total: ${order.totalAmount.toFixed(2)}</p>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-bold text-sm">
                  En Preparación
                </button>
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-bold text-sm">
                  Completado
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function GestionPedidosTab({ orders }: { orders: any[] }) {
  const statuses = ["pending", "confirmed", "preparing", "ready", "delivered"]

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Gestión de Pedidos</h2>

      {statuses.map((status) => {
        const statusOrders = orders.filter((o) => o.status === status)
        const statusLabel = {
          pending: "Pendientes",
          confirmed: "Confirmados",
          preparing: "En Preparación",
          ready: "Listos para Entregar",
          delivered: "Entregados",
        }[status]

        return (
          <div key={status}>
            <h3 className="text-lg font-bold mb-3 text-primary">
              {statusLabel} ({statusOrders.length})
            </h3>

            {statusOrders.length === 0 ? (
              <p className="text-muted-foreground text-sm mb-4">Sin pedidos en este estado</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 mb-6">
                {statusOrders.map((order) => (
                  <div key={order.id} className="bg-card rounded-lg p-4 shadow-md border-l-4 border-primary">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-bold">{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.createdAt.toLocaleString()}</p>
                        <p className="text-sm mt-2">
                          <strong>Items:</strong> {order.items.map((i: any) => `${i.quantity}x ${i.name}`).join(", ")}
                        </p>
                      </div>
                      <p className="text-lg font-bold text-primary">${order.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function InventarioTab({ restaurantId }: { restaurantId?: string }) {
  const [items, setItems] = useState([
    { id: "item_1", name: "Carne Asada Especial", quantity: 15, minStock: 5, available: true },
    { id: "item_2", name: "Costillas BBQ", quantity: 8, minStock: 5, available: true },
    { id: "item_3", name: "Pizza Hawaiana", quantity: 0, minStock: 10, available: false },
    { id: "item_4", name: "Arepa con Queso", quantity: 45, minStock: 20, available: true },
  ])

  const toggleAvailability = (id: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, available: !item.available } : item)))
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Gestión de Inventario</h2>

      <div className="grid grid-cols-1 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-card rounded-lg p-4 shadow-md">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-sm text-muted-foreground">Mínimo en stock: {item.minStock} unidades</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-primary">{item.quantity}</p>
                <p className="text-xs text-muted-foreground">unidades</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${Math.min((item.quantity / (item.minStock * 3)) * 100, 100)}%` }}
                />
              </div>

              <button
                onClick={() => toggleAvailability(item.id)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm ${
                  item.available
                    ? "bg-green-500 hover:bg-green-600 text-white"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                {item.available ? "Disponible" : "No Disponible"}
              </button>
            </div>

            {item.quantity <= item.minStock && (
              <p className="text-xs text-red-500 mt-2">⚠️ Stock bajo - considera hacer un pedido</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function ReportesTab({ orders }: { orders: any[] }) {
  const deliveredOrders = orders.filter((o) => o.status === "delivered")
  const totalRevenue = deliveredOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  const totalOrders = deliveredOrders.length

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-6">Reportes y Análisis de Ventas</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg p-6 shadow-md">
          <p className="text-muted-foreground mb-2">Ingresos Totales</p>
          <p className="text-4xl font-bold text-primary">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-card rounded-lg p-6 shadow-md">
          <p className="text-muted-foreground mb-2">Total de Pedidos</p>
          <p className="text-4xl font-bold text-primary">{totalOrders}</p>
        </div>
        <div className="bg-card rounded-lg p-6 shadow-md">
          <p className="text-muted-foreground mb-2">Ingreso Promedio</p>
          <p className="text-4xl font-bold text-primary">
            ${totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : "0.00"}
          </p>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 shadow-md">
        <h3 className="font-bold text-lg mb-4">Top Productos Más Vendidos</h3>
        <div className="space-y-3">
          {[
            { name: "Carne Asada Especial", sales: 12, revenue: "$419.88" },
            { name: "Arepa con Queso", sales: 28, revenue: "$139.72" },
            { name: "Pizza Hawaiana", sales: 15, revenue: "$284.85" },
          ].map((product, idx) => (
            <div key={idx} className="flex justify-between items-center pb-3 border-b border-border last:border-0">
              <div>
                <p className="font-semibold">{product.name}</p>
                <p className="text-sm text-muted-foreground">{product.sales} ventas</p>
              </div>
              <p className="font-bold text-primary">{product.revenue}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function GestionPagosTab({ orders }: { orders: any[] }) {
  const deliveredOrders = orders.filter((o) => o.status === "delivered")

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Gestión de Pagos y Liquidaciones</h2>

      <div className="bg-green-100 dark:bg-green-950 border-2 border-green-400 rounded-lg p-4 mb-6">
        <p className="text-sm font-bold text-green-700 dark:text-green-200 mb-1">💳 NUEVOS MÉTODOS DE PAGO</p>
        <p className="text-xs text-green-600 dark:text-green-300">
          Ahora aceptamos PayPal, Apple Pay y Google Pay • Comisión reducida del 1.5% • ¡Activa hoy!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-card rounded-lg p-6 shadow-md">
          <p className="text-muted-foreground mb-2">Saldo Disponible</p>
          <p className="text-4xl font-bold text-primary">
            ${deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground mt-2">Último pago: Hoy a las 3:00 PM</p>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-md">
          <p className="text-muted-foreground mb-2">Próxima Liquidación</p>
          <p className="text-3xl font-bold">Mañana</p>
          <p className="text-sm text-muted-foreground mt-2">Automatizada a tu cuenta bancaria</p>
          <button className="w-full mt-4 bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:opacity-90">
            Solicitar Liquidación Manual
          </button>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 shadow-md">
        <h3 className="font-bold text-lg mb-4">Historial de Pagos Recibidos</h3>
        <div className="space-y-3">
          {deliveredOrders.slice(0, 5).map((order, idx) => (
            <div key={idx} className="flex justify-between items-center pb-3 border-b border-border last:border-0">
              <div>
                <p className="font-semibold">{order.id}</p>
                <p className="text-sm text-muted-foreground">{order.createdAt.toLocaleDateString()}</p>
              </div>
              <p className="font-bold text-green-500">+${order.totalAmount.toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
