"use client"

import { useState } from "react"
import { useAppContext } from "@/lib/app-context"
import { mockRestaurants } from "@/lib/mock-data"
import RestaurantBrowser from "./restaurant-browser"
import OrderHistory from "./order-history"
import SupportPage from "./support-page"

type TabType = "browse" | "orders" | "support" | "ratings"

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState<TabType>("browse")
  const { user, logout, orders } = useAppContext()

  const tabs = [
    { id: "browse", label: "Explorar Restaurantes" },
    { id: "orders", label: "Mis Pedidos" },
    { id: "support", label: "Soporte" },
    { id: "ratings", label: "Calificaciones" },
  ] as const

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">E-Food</h1>
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

        {activeTab === "browse" && <RestaurantBrowser restaurants={mockRestaurants} />}
        {activeTab === "orders" && <OrderHistory />}
        {activeTab === "support" && <SupportPage />}
        {activeTab === "ratings" && <RatingsPage orders={orders} />}
      </div>
    </div>
  )
}

function RatingsPage({ orders }: { orders: any[] }) {
  const ratedOrders = orders.filter((order) => order.rating)

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">Tus Calificaciones y Reseñas</h2>

      <div className="bg-purple-100 dark:bg-purple-950 border-2 border-purple-400 rounded-lg p-4">
        <p className="text-sm font-bold text-purple-700 dark:text-purple-200 mb-1">⭐ APLICACIÓN MOBILE</p>
        <p className="text-xs text-purple-600 dark:text-purple-300">
          Descarga nuestra app y obtén $5 de crédito inicial. ¡Disponible en iOS y Android!
        </p>
      </div>

      {ratedOrders.length === 0 ? (
        <div className="bg-card rounded-lg p-6 shadow-md text-center">
          <p className="text-muted-foreground">
            Aún no has calificado ningún pedido. ¡Completa y califica tus entregas!
          </p>
        </div>
      ) : (
        ratedOrders.map((order) => (
          <div key={order.id} className="bg-card rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold">{order.restaurantName}</h3>
                <p className="text-sm text-muted-foreground">{order.createdAt.toLocaleDateString()}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-yellow-400 mb-1">
                  {"★".repeat(order.rating)}
                  {"☆".repeat(5 - order.rating)}
                </p>
                <p className="text-sm font-semibold">{order.rating}/5</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm font-semibold mb-2">Artículos Pedidos:</p>
              <ul className="space-y-1">
                {order.items.map((item: any, idx: number) => (
                  <li key={idx} className="text-sm text-muted-foreground">
                    {item.name} x{item.quantity}
                  </li>
                ))}
              </ul>
            </div>

            {order.feedback && (
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm font-semibold mb-2">Tu Reseña:</p>
                <p className="text-sm text-foreground">{order.feedback}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  )
}
