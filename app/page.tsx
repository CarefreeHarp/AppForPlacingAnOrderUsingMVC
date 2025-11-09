"use client"

import { useAppContext } from "@/lib/app-context"
import LoginPage from "@/components/login-page"
import CustomerDashboard from "@/components/customer-dashboard"
import AdminDashboard from "@/components/admin-dashboard"
import EstablecimientoDashboard from "@/components/establecimiento-dashboard"

export default function Home() {
  const { user } = useAppContext()

  if (!user) {
    return <LoginPage />
  }

  switch (user.role) {
    case "customer":
      return <CustomerDashboard />
    case "admin":
      return <AdminDashboard />
    case "restaurant":
      return <EstablecimientoDashboard />
    case "operator":
      return <AdminDashboard />
    default:
      return <LoginPage />
  }
}

function RestaurantDashboard() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Restaurant Dashboard</h1>
      <p className="text-muted-foreground">Coming soon</p>
    </div>
  )
}
