"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { mockRestaurants, mockUsers } from "./mock-data"

export interface User {
  id: string
  name: string
  email: string
  role: "customer" | "restaurant" | "admin" | "operator"
  phone?: string
  restaurantId?: string
}

export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  rating: number
  restaurantId: string
  available?: boolean
}

export interface Restaurant {
  id: string
  name: string
  image?: string
  description: string
  rating: number
  deliveryTime: number
  deliveryFee: number
  cuisine: string[]
  isOpen: boolean
}

interface AppContextType {
  user: User | null
  restaurants: Restaurant[]
  menuItems: MenuItem[]
  login: (email: string, role: User["role"]) => void
  logout: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [restaurants] = useState<Restaurant[]>(mockRestaurants)
  const [menuItems] = useState<MenuItem[]>([])

  const login = (email: string, role: User["role"]) => {
    const mockUser = mockUsers.find(u => u.email === email && u.role === role)
    if (mockUser) {
      setUser(mockUser)
    }
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AppContext.Provider
      value={{
        user,
        restaurants,
        menuItems,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}