"use client"

import { useState } from "react"
import { useAppContext } from "@/lib/app-context"

type DeliveryTab = "available" | "active" | "completed" | "earnings"

export default function DeliveryDashboard() {
  const [activeTab, setActiveTab] = useState<DeliveryTab>("available")
  const { user, logout } = useAppContext()

  const tabs = [
    { id: "available", label: "Pedidos Disponibles" },
    { id: "active", label: "Entregas Activas" },
    { id: "completed", label: "Completadas" },
    { id: "earnings", label: "Ganancias" },
  ] as const

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Socio Repartidor E-Food</h1>
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
        <div className="bg-yellow-100 dark:bg-yellow-950 border-2 border-yellow-500 rounded-lg p-4 mb-6">
          <p className="text-sm font-bold text-yellow-700 dark:text-yellow-200 mb-1">🚗 VEHÍCULO GRATIS</p>
          <p className="text-xs text-yellow-600 dark:text-yellow-300">
            Comparte un scooter eléctrico por solo $15/mes • Carga y uso ilimitado • ¡Regístrate ahora!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Ganancias Hoy" value="$125.50" change="5 entregas" />
          <StatCard title="Calificación" value="4.8/5.0" change="Basado en 156 entregas" />
          <StatCard title="Estado Activo" value="En Línea" change="Disponible para pedidos" />
          <StatCard title="Esta Semana" value="$675.25" change="28 entregas" />
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

        {activeTab === "available" && <AvailableOrdersTab />}
        {activeTab === "active" && <ActiveDeliveriesTab />}
        {activeTab === "completed" && <CompletedTab />}
        {activeTab === "earnings" && <EarningsTab />}
      </div>
    </div>
  )
}

function StatCard({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-md">
      <p className="text-muted-foreground text-sm mb-2">{title}</p>
      <h3 className="text-3xl font-bold mb-2">{value}</h3>
      <p className="text-sm text-muted-foreground">{change}</p>
    </div>
  )
}

function AvailableOrdersTab() {
  const orders = [
    {
      id: "ORD001",
      from: "Palacio de Pizza",
      to: "Calle Principal 123",
      distance: "2.3 km",
      earning: "$5.50",
      estimatedTime: "12 min",
    },
    {
      id: "ORD002",
      from: "Dicha de Hamburguesas",
      to: "Avenida Roble 456",
      distance: "3.1 km",
      earning: "$6.75",
      estimatedTime: "15 min",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-card rounded-lg p-6 shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold">{order.from}</h3>
              <p className="text-sm text-muted-foreground">→ {order.to}</p>
            </div>
            <span className="text-2xl font-bold text-primary">{order.earning}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground mb-4">
            <span>{order.distance}</span>
            <span>{order.estimatedTime}</span>
          </div>
          <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90">
            Aceptar Pedido
          </button>
        </div>
      ))}
    </div>
  )
}

function ActiveDeliveriesTab() {
  const deliveries = [
    {
      id: "ORD001",
      restaurant: "Palacio de Pizza",
      customer: "Juan Pérez",
      location: "Calle Principal 123",
      status: "picked-up",
      earning: "$5.50",
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4">
      {deliveries.map((delivery) => (
        <div key={delivery.id} className="bg-card rounded-lg p-6 shadow-md">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-bold">{delivery.restaurant}</h3>
              <p className="text-sm text-muted-foreground">Entregando a: {delivery.customer}</p>
              <p className="text-sm text-muted-foreground">{delivery.location}</p>
            </div>
            <span className="text-2xl font-bold text-primary">{delivery.earning}</span>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-full text-sm font-semibold">
              {delivery.status === "picked-up" ? "Recogido" : "En Ruta"}
            </span>
          </div>
          <div className="mt-4">
            <button className="w-full bg-accent text-accent-foreground py-3 rounded-lg font-bold hover:opacity-90">
              Marcar como Entregado
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function CompletedTab() {
  const completed = [
    { id: "ORD123", restaurant: "Palacio de Pizza", earning: "$5.50", rating: 5 },
    { id: "ORD124", restaurant: "Dicha de Hamburguesas", earning: "$6.75", rating: 4 },
  ]

  return (
    <div className="grid grid-cols-1 gap-4">
      {completed.map((delivery) => (
        <div key={delivery.id} className="bg-card rounded-lg p-6 shadow-md">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold">{delivery.restaurant}</h3>
              <p className="text-sm text-muted-foreground">{delivery.id}</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary">{delivery.earning}</p>
              <p className="text-sm">⭐ {delivery.rating}/5</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

function EarningsTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-card rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-bold mb-4">Resumen de Ganancias</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Hoy</span>
            <span className="font-bold">$125.50</span>
          </div>
          <div className="flex justify-between">
            <span>Esta Semana</span>
            <span className="font-bold">$675.25</span>
          </div>
          <div className="flex justify-between">
            <span>Este Mes</span>
            <span className="font-bold">$2,485.00</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-primary">$3,285.75</span>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-bold mb-4">Desempeño</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Entregas Totales</span>
            <span className="font-bold">156</span>
          </div>
          <div className="flex justify-between">
            <span>Tasa de Aceptación</span>
            <span className="font-bold">95%</span>
          </div>
          <div className="flex justify-between">
            <span>Tasa de Cancelación</span>
            <span className="font-bold">2%</span>
          </div>
          <div className="flex justify-between">
            <span>Calificación Promedio</span>
            <span className="font-bold">4.8/5.0</span>
          </div>
        </div>
      </div>
    </div>
  )
}
