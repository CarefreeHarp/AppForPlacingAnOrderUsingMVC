"use client"

import { useState } from "react"
import { useAppContext } from "@/lib/app-context"

export default function LoginPage() {
  const [email, setEmail] = useState("customer@example.com")
  const [role, setRole] = useState<"customer" | "restaurant" | "admin">("customer")
  const [restaurantId, setRestaurantId] = useState("")
  const { login } = useAppContext()

  const restaurants = [
    { id: "rest_1", name: "Andrés Carne de Res" },
    { id: "rest_2", name: "Harry's Pizza" },
    { id: "rest_3", name: "Rostipollo" },
    { id: "rest_4", name: "Frisby" },
    { id: "rest_5", name: "Carrefour Food Court" },
    { id: "rest_6", name: "Justo & Bueno" },
  ]

  const handleLogin = () => {
    if (role === "restaurant" && !restaurantId) {
      alert("Por favor selecciona un establecimiento")
      return
    }
    login(email, role, role === "restaurant" ? restaurantId : undefined)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center p-4">
      <div className="bg-white dark:bg-card rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-center mb-2 text-primary">E-Food</h1>
        <p className="text-center text-muted-foreground mb-8">Plataforma de Comida para Centros Comerciales</p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ingresa tu correo"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Inicia Sesión Como</label>
            <div className="grid grid-cols-3 gap-2">
              {(["customer", "restaurant", "admin"] as const).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`py-2 px-3 rounded-lg font-semibold transition text-sm ${
                    role === r
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground border border-border hover:bg-muted/80"
                  }`}
                >
                  {r === "customer" ? "Cliente" : r === "restaurant" ? "Establecimiento" : "Administrador"}
                </button>
              ))}
            </div>
          </div>

          {role === "restaurant" && (
            <div>
              <label className="block text-sm font-semibold mb-2">Selecciona tu Establecimiento</label>
              <select
                value={restaurantId}
                onChange={(e) => setRestaurantId(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">-- Elige un establecimiento --</option>
                {restaurants.map((rest) => (
                  <option key={rest.id} value={rest.id}>
                    {rest.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={handleLogin}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-lg font-bold text-lg transition"
          >
            Iniciar Sesión
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Cuenta de demostración. Prueba diferentes roles para explorar la aplicación.
        </p>
      </div>
    </div>
  )
}
