"use client"

import { useState } from "react"
import { useAppContext } from "@/lib/app-context"

type AdminTab = "restaurants" | "orders" | "partners" | "revenue"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<AdminTab>("restaurants")
  const { user, logout } = useAppContext()

  const tabs = [
    { id: "restaurants", label: "Restaurantes" },
    { id: "orders", label: "Pedidos" },
    { id: "partners", label: "Socios Repartidores" },
    { id: "revenue", label: "Ingresos" },
  ] as const

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Panel de Administración E-Food</h1>
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
        <div className="bg-green-100 dark:bg-green-950 border-2 border-green-500 rounded-lg p-4 mb-6">
          <p className="text-sm font-bold text-green-700 dark:text-green-200 mb-1">📊 HERRAMIENTAS PREMIUM</p>
          <p className="text-xs text-green-600 dark:text-green-300">
            Actualiza a Premium Analytics para gráficos avanzados y reportes automáticos • Desde $29/mes
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Pedidos Totales" value="2,453" change="+12% este mes" />
          <StatCard title="Restaurantes Activos" value="48" change="+3 este mes" />
          <StatCard title="Socios Repartidores" value="157" change="+8 este mes" />
          <StatCard title="Ingresos Totales" value="$54,320" change="+18% este mes" />
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

        {activeTab === "restaurants" && <RestaurantsTab />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "partners" && <PartnersTab />}
        {activeTab === "revenue" && <RevenueTab />}
      </div>
    </div>
  )
}

function StatCard({ title, value, change }: { title: string; value: string; change: string }) {
  return (
    <div className="bg-card rounded-lg p-6 shadow-md">
      <p className="text-muted-foreground text-sm mb-2">{title}</p>
      <h3 className="text-3xl font-bold mb-2">{value}</h3>
      <p className="text-sm text-green-600">{change}</p>
    </div>
  )
}

function RestaurantsTab() {
  const restaurants = [
    { id: 1, name: "Palacio de Pizza", status: "active", orders: 245, rating: 4.8 },
    { id: 2, name: "Dicha de Hamburguesas", status: "active", orders: 198, rating: 4.6 },
    { id: 3, name: "Sushi Supremo", status: "active", orders: 167, rating: 4.9 },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Gestionar Restaurantes</h2>
        <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90">
          Añadir Restaurante
        </button>
      </div>
      <div className="bg-card rounded-lg overflow-hidden shadow-md">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Nombre</th>
              <th className="px-6 py-3 text-left font-semibold">Estado</th>
              <th className="px-6 py-3 text-left font-semibold">Pedidos</th>
              <th className="px-6 py-3 text-left font-semibold">Calificación</th>
              <th className="px-6 py-3 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {restaurants.map((restaurant) => (
              <tr key={restaurant.id} className="border-t border-border hover:bg-muted/50">
                <td className="px-6 py-4">{restaurant.name}</td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-full text-sm font-semibold">
                    {restaurant.status === "active" ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td className="px-6 py-4">{restaurant.orders}</td>
                <td className="px-6 py-4">⭐ {restaurant.rating}</td>
                <td className="px-6 py-4">
                  <button className="text-primary hover:underline">Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function OrdersTab() {
  const orders = [
    { id: "ORD001", customer: "Juan Pérez", restaurant: "Palacio de Pizza", amount: "$28.97", status: "delivered" },
    {
      id: "ORD002",
      customer: "María García",
      restaurant: "Dicha de Hamburguesas",
      amount: "$14.98",
      status: "in-progress",
    },
    { id: "ORD003", customer: "Carlos López", restaurant: "Sushi Supremo", amount: "$45.50", status: "pending" },
  ]

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-md">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="px-6 py-3 text-left font-semibold">ID del Pedido</th>
            <th className="px-6 py-3 text-left font-semibold">Cliente</th>
            <th className="px-6 py-3 text-left font-semibold">Restaurante</th>
            <th className="px-6 py-3 text-left font-semibold">Monto</th>
            <th className="px-6 py-3 text-left font-semibold">Estado</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id} className="border-t border-border hover:bg-muted/50">
              <td className="px-6 py-4 font-semibold">{order.id}</td>
              <td className="px-6 py-4">{order.customer}</td>
              <td className="px-6 py-4">{order.restaurant}</td>
              <td className="px-6 py-4 font-semibold">{order.amount}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : order.status === "in-progress"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
                  }`}
                >
                  {order.status === "delivered"
                    ? "Entregado"
                    : order.status === "in-progress"
                      ? "En Progreso"
                      : "Pendiente"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PartnersTab() {
  const partners = [
    { id: 1, name: "Alejandro Moreno", status: "active", deliveries: 156, rating: 4.9 },
    { id: 2, name: "María Rodríguez", status: "active", deliveries: 142, rating: 4.8 },
    { id: 3, name: "David Chen", status: "offline", deliveries: 98, rating: 4.7 },
  ]

  return (
    <div className="bg-card rounded-lg overflow-hidden shadow-md">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="px-6 py-3 text-left font-semibold">Nombre</th>
            <th className="px-6 py-3 text-left font-semibold">Estado</th>
            <th className="px-6 py-3 text-left font-semibold">Entregas</th>
            <th className="px-6 py-3 text-left font-semibold">Calificación</th>
          </tr>
        </thead>
        <tbody>
          {partners.map((partner) => (
            <tr key={partner.id} className="border-t border-border hover:bg-muted/50">
              <td className="px-6 py-4">{partner.name}</td>
              <td className="px-6 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    partner.status === "active"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
                  }`}
                >
                  {partner.status === "active" ? "Activo" : "Desconectado"}
                </span>
              </td>
              <td className="px-6 py-4">{partner.deliveries}</td>
              <td className="px-6 py-4">⭐ {partner.rating}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function RevenueTab() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-card rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-bold mb-4">Desglose de Ingresos</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Comisión (15%)</span>
            <span className="font-bold">$8,148</span>
          </div>
          <div className="flex justify-between">
            <span>Tarifas de Entrega</span>
            <span className="font-bold">$3,200</span>
          </div>
          <div className="flex justify-between">
            <span>Costo de Promociones</span>
            <span className="font-bold text-destructive">-$500</span>
          </div>
          <div className="border-t border-border pt-3 flex justify-between font-bold text-lg">
            <span>Ingresos Netos</span>
            <span>$10,848</span>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg p-6 shadow-md">
        <h3 className="text-lg font-bold mb-4">Métricas de Desempeño</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span>Valor Promedio del Pedido</span>
            <span className="font-bold">$22.15</span>
          </div>
          <div className="flex justify-between">
            <span>Tasa de Éxito de Entrega</span>
            <span className="font-bold">98.5%</span>
          </div>
          <div className="flex justify-between">
            <span>Satisfacción del Cliente</span>
            <span className="font-bold">4.7/5.0</span>
          </div>
          <div className="flex justify-between">
            <span>Usuarios Activos (30d)</span>
            <span className="font-bold">1,245</span>
          </div>
        </div>
      </div>
    </div>
  )
}
