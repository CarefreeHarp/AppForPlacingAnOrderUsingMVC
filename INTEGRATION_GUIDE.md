# Integration Guide

## 1. Update the Components

### Login Page (`components/login-page.tsx`):
```tsx
"use client"

import { useState } from "react"
import { useAppContext } from "@/lib/app-context"
import { Card } from "./ui/card"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { Label } from "./ui/label"
import { Alert } from "./ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "customer" as const,
    phone: "",
  })
  const { login, register, loading, error } = useAppContext()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (formData.role === 'customer') {
        await login(formData.email, formData.password)
      } else {
        await register(formData)
      }
    } catch (err) {
      console.error('Authentication error:', err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-6">
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Login form fields */}
              <Button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="register">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Registration form fields */}
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Register'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  )
}
```

### Restaurant Browser (`components/restaurant-browser.tsx`):
```tsx
"use client"

import { useEffect } from "react"
import { useAppContext } from "@/lib/app-context"
import { Card } from "./ui/card"

export default function RestaurantBrowser() {
  const { restaurants, fetchRestaurants, loading, error } = useAppContext()

  useEffect(() => {
    fetchRestaurants()
  }, [fetchRestaurants])

  if (loading) return <div>Loading restaurants...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {restaurants.map((restaurant) => (
        <Card key={restaurant.id} className="p-4">
          {restaurant.image && (
            <img 
              src={restaurant.image} 
              alt={restaurant.name} 
              className="w-full h-48 object-cover rounded-md"
            />
          )}
          <h3 className="text-lg font-bold mt-2">{restaurant.name}</h3>
          <p className="text-sm text-gray-600">{restaurant.description}</p>
          <div className="mt-2">
            <span className="text-sm">Rating: {restaurant.rating}⭐</span>
            <span className="text-sm ml-4">Delivery: ${restaurant.deliveryFee}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {restaurant.cuisine.map((type) => (
              <span key={type} className="text-xs bg-gray-100 px-2 py-1 rounded">
                {type}
              </span>
            ))}
          </div>
        </Card>
      ))}
    </div>
  )
}
```

### Menu Browser (`components/menu-browser.tsx`):
```tsx
"use client"

import { useEffect } from "react"
import { useAppContext } from "@/lib/app-context"
import { Card } from "./ui/card"
import { Button } from "./ui/button"

export default function MenuBrowser({ restaurantId }: { restaurantId: string }) {
  const { menuItems, fetchMenuItems, loading, error } = useAppContext()

  useEffect(() => {
    fetchMenuItems(restaurantId)
  }, [fetchMenuItems, restaurantId])

  if (loading) return <div>Loading menu...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {menuItems.map((item) => (
        <Card key={item.id} className="p-4">
          {item.image && (
            <img 
              src={item.image} 
              alt={item.name} 
              className="w-full h-48 object-cover rounded-md"
            />
          )}
          <h3 className="text-lg font-bold mt-2">{item.name}</h3>
          <p className="text-sm text-gray-600">{item.description}</p>
          <div className="mt-2 flex justify-between items-center">
            <span className="text-lg font-bold">${item.price}</span>
            <span className="text-sm">Rating: {item.rating}⭐</span>
          </div>
          <Button 
            className="w-full mt-4"
            variant={item.available ? "default" : "secondary"}
            disabled={!item.available}
          >
            {item.available ? "Add to Cart" : "Not Available"}
          </Button>
        </Card>
      ))}
    </div>
  )
}
```

### Restaurant Dashboard (`components/establecimiento-dashboard.tsx`):
```tsx
"use client"

import { useEffect } from "react"
import { useAppContext } from "@/lib/app-context"
import { Card } from "./ui/card"
import { Button } from "./ui/button"

export default function EstablecimientoDashboard() {
  const { user, menuItems, fetchMenuItems, toggleItemAvailability, loading, error } = useAppContext()

  useEffect(() => {
    if (user?.restaurantId) {
      fetchMenuItems(user.restaurantId)
    }
  }, [fetchMenuItems, user?.restaurantId])

  if (loading) return <div>Loading dashboard...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Restaurant Dashboard</h1>
      <h2 className="text-xl mb-4">Menu Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <Card key={item.id} className="p-4">
            <h3 className="text-lg font-bold">{item.name}</h3>
            <p className="text-sm text-gray-600">{item.description}</p>
            <div className="mt-2">
              <span className="text-lg font-bold">${item.price}</span>
            </div>
            <Button
              className="w-full mt-4"
              variant={item.available ? "default" : "secondary"}
              onClick={() => toggleItemAvailability(item.id)}
            >
              {item.available ? "Mark as Unavailable" : "Mark as Available"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

## 2. MongoDB Connection

Make sure MongoDB is running locally or update the connection URI in `backend/src/config/config.ts`:

```typescript
export const config = {
  port: process.env.BACKEND_PORT || 5000,
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/justo-y-bueno',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key'
};
```

## 3. Environment Variables

Create a `.env.local` file in your project root:

```env
BACKEND_PORT=5000
MONGODB_URI=mongodb://localhost:27017/justo-y-bueno
JWT_SECRET=your-secure-secret-key-here
```

## 4. Start the Application

1. Start MongoDB:
```bash
mongod
```

2. Start the application:
```bash
pnpm dev
```

This will start both the Next.js frontend and the Express backend.