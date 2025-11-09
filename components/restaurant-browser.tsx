"use client"

import { useState } from "react"
import type { Restaurant } from "@/lib/app-context"
import { mockMenuItems } from "@/lib/mock-data"
import MenuBrowser from "./menu-browser"

interface Props {
  restaurants: Restaurant[]
}

export default function RestaurantBrowser({ restaurants }: Props) {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cuisine.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  if (selectedRestaurant) {
    const restaurantMenus = mockMenuItems.filter((item) => item.restaurantId === selectedRestaurant.id)
    return (
      <MenuBrowser
        restaurant={selectedRestaurant}
        menuItems={restaurantMenus}
        onBack={() => setSelectedRestaurant(null)}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-2">🎉 ¡OFERTA ESPECIAL!</h2>
        <p className="text-lg mb-3">Obtén 30% de descuento en tu primer pedido • Código: BIENVENIDA30</p>
        <p className="text-sm opacity-90">*Válido para nuevos usuarios. Mínimo de compra $20</p>
      </div>

      <div>
        <input
          type="text"
          placeholder="Buscar restaurantes o cocinas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRestaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            onClick={() => setSelectedRestaurant(restaurant)}
            className="bg-card rounded-lg overflow-hidden shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <img
              src={restaurant.image || "/placeholder.svg"}
              alt={restaurant.name}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold mb-1">{restaurant.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{restaurant.description}</p>
              <div className="flex justify-between items-center text-sm">
                <span className="font-semibold">⭐ {restaurant.rating}</span>
                <span className="text-muted-foreground">{restaurant.deliveryTime} min</span>
                <span className="text-muted-foreground">${restaurant.deliveryFee}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
