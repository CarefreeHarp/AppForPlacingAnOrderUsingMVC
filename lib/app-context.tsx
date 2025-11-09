"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

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
  available?: boolean // added for inventory management
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

export interface OrderItem {
  menuItemId: string
  name: string
  quantity: number
  price: number
}

export interface Order {
  id: string
  customerId: string
  restaurantId: string
  restaurantName: string
  items: OrderItem[]
  totalAmount: number
  status: "pending" | "confirmed" | "preparing" | "ready" | "picked" | "delivered"
  createdAt: Date
  estimatedDeliveryTime?: Date
  rating?: number
  feedback?: string
  queueNumber?: number // added for electronic queue
  prepTime?: number // minutes
}

export interface AppContextType {
  user: User | null
  setUser: (user: User | null) => void
  login: (email: string, role: User["role"], restaurantId?: string) => void
  logout: () => void
  currentLanguage: "es"
  setLanguage: (lang: "es") => void
  orders: Order[]
  addOrder: (order: Order) => void
  updateOrderRating: (orderId: string, rating: number, feedback: string) => void
  updateOrderStatus: (orderId: string, status: Order["status"]) => void // added
  updateMenuItemAvailability: (itemId: string, available: boolean) => void // added
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [currentLanguage, setLanguage] = useState<"es">("es")
  const [orders, setOrders] = useState<Order[]>([])

  const login = (email: string, role: User["role"], restaurantId?: string) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name: email.split("@")[0],
      email,
      role,
      phone: "+57-301-1234567",
      restaurantId,
    }
    setUser(newUser)
  }

  const logout = () => {
    setUser(null)
  }

  const addOrder = (order: Order) => {
    const queueNumber = orders.filter((o) => o.restaurantId === order.restaurantId).length + 1
    const orderWithQueue = { ...order, queueNumber }
    setOrders([orderWithQueue, ...orders])
  }

  const updateOrderRating = (orderId: string, rating: number, feedback: string) => {
    setOrders(
      orders.map((order) => (order.id === orderId ? { ...order, rating, feedback, status: "delivered" } : order)),
    )
  }

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status } : order)))
  }

  const updateMenuItemAvailability = (itemId: string, available: boolean) => {
    // This would update in a real backend
    console.log(`Item ${itemId} availability updated to ${available}`)
  }

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        currentLanguage,
        setLanguage,
        orders,
        addOrder,
        updateOrderRating,
        updateOrderStatus,
        updateMenuItemAvailability,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider")
  }
  return context
}
