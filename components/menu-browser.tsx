"use client"

import { useState } from "react"
import type { Restaurant, MenuItem, Order, OrderItem } from "@/lib/app-context"
import { useAppContext } from "@/lib/app-context"

interface Props {
  restaurant: Restaurant
  menuItems: MenuItem[]
  onBack: () => void
  onOrderPlaced?: (orderId: string) => void
}

export default function MenuBrowser({ restaurant, menuItems, onBack, onOrderPlaced }: Props) {
  const [cart, setCart] = useState<{ itemId: string; quantity: number }[]>([])
  const [showCheckout, setShowCheckout] = useState(false)

  const addToCart = (itemId: string) => {
    const existing = cart.find((item) => item.itemId === itemId)
    if (existing) {
      setCart(cart.map((item) => (item.itemId === itemId ? { ...item, quantity: item.quantity + 1 } : item)))
    } else {
      setCart([...cart, { itemId, quantity: 1 }])
    }
  }

  const removeFromCart = (itemId: string) => {
    setCart(cart.filter((item) => item.itemId !== itemId))
  }

  const cartTotal = cart.reduce((total, cartItem) => {
    const item = menuItems.find((m) => m.id === cartItem.itemId)
    return total + (item?.price || 0) * cartItem.quantity
  }, 0)

  if (showCheckout) {
    return (
      <CheckoutPage
        restaurant={restaurant}
        cart={cart}
        menuItems={menuItems}
        onBack={() => setShowCheckout(false)}
        onOrderPlaced={onOrderPlaced}
      />
    )
  }

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-primary font-semibold hover:underline">
        ← Volver a Restaurantes
      </button>

      <div className="bg-card rounded-lg p-6 shadow-md">
        <img
          src={restaurant.image || "/placeholder.svg"}
          alt={restaurant.name}
          className="w-full h-60 object-cover rounded-lg mb-4"
        />
        <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
        <p className="text-muted-foreground mb-4">{restaurant.description}</p>
        <div className="flex gap-6 text-sm">
          <span>⭐ {restaurant.rating}</span>
          <span>{restaurant.deliveryTime} min entrega</span>
          <span>${restaurant.deliveryFee} envío</span>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950 border-2 border-blue-400 rounded-lg p-4">
        <p className="text-sm font-bold text-blue-700 dark:text-blue-200 mb-1">💳 PROMOCIÓN: PayPal</p>
        <p className="text-xs text-blue-600 dark:text-blue-300">
          Paga con PayPal y obtén 15% extra de cashback • Mínimo $15
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold mb-4">Menú</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems.map((item) => (
              <div key={item.id} className="bg-card rounded-lg p-4 shadow-md">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className="font-bold mb-1">{item.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg text-primary">${item.price}</span>
                  <button
                    onClick={() => addToCart(item.id)}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90"
                  >
                    Añadir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="bg-card rounded-lg p-4 shadow-md sticky top-4">
            <h3 className="font-bold text-lg mb-4">Tu Carrito</h3>
            {cart.length === 0 ? (
              <p className="text-muted-foreground">Tu carrito está vacío</p>
            ) : (
              <div className="space-y-3">
                {cart.map((cartItem) => {
                  const item = menuItems.find((m) => m.id === cartItem.itemId)
                  return (
                    <div key={cartItem.itemId} className="flex justify-between items-center text-sm">
                      <div>
                        <p className="font-semibold">{item?.name}</p>
                        <p className="text-muted-foreground">x{cartItem.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>${(item?.price || 0) * cartItem.quantity}</span>
                        <button
                          onClick={() => removeFromCart(cartItem.itemId)}
                          className="text-destructive hover:underline"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  )
                })}
                <div className="border-t border-border pt-3 font-bold">
                  <p className="flex justify-between mb-4">
                    <span>Total:</span>
                    <span>${(cartTotal + restaurant.deliveryFee).toFixed(2)}</span>
                  </p>
                  <button
                    onClick={() => setShowCheckout(true)}
                    className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90"
                  >
                    Ir a Pagar
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckoutPage({
  restaurant,
  cart,
  menuItems,
  onBack,
  onOrderPlaced,
}: {
  restaurant: Restaurant
  cart: any[]
  menuItems: MenuItem[]
  onBack: () => void
  onOrderPlaced?: (orderId: string) => void
}) {
  const { user, addOrder } = useAppContext()
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [address, setAddress] = useState({ street: "", city: "", zip: "" })
  const [errors, setErrors] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const cartTotal = cart.reduce((total, cartItem) => {
    const item = menuItems.find((m) => m.id === cartItem.itemId)
    return total + (item?.price || 0) * cartItem.quantity
  }, 0)

  const finalTotal = cartTotal + restaurant.deliveryFee

  const handlePlaceOrder = () => {
    const newErrors: string[] = []

    if (!address.street.trim()) newErrors.push("Se requiere dirección de calle")
    if (!address.city.trim()) newErrors.push("Se requiere ciudad")
    if (!address.zip.trim()) newErrors.push("Se requiere código postal")
    if (cart.length === 0) newErrors.push("El carrito está vacío")

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors([])
    setLoading(true)

    setTimeout(() => {
      const orderId = `ORD_${Date.now()}`

      const orderItems: OrderItem[] = cart.map((cartItem) => {
        const item = menuItems.find((m) => m.id === cartItem.itemId)
        return {
          menuItemId: cartItem.itemId,
          name: item?.name || "Artículo Desconocido",
          quantity: cartItem.quantity,
          price: item?.price || 0,
        }
      })

      const order: Order = {
        id: orderId,
        customerId: user?.id || "unknown",
        restaurantId: restaurant.id,
        restaurantName: restaurant.name,
        items: orderItems,
        totalAmount: finalTotal,
        status: "confirmed",
        createdAt: new Date(),
        estimatedDeliveryTime: new Date(Date.now() + restaurant.deliveryTime * 60000),
      }

      addOrder(order)

      setLoading(false)
      setSuccess(true)

      if (onOrderPlaced) {
        onOrderPlaced(orderId)
      }

      setTimeout(() => {
        setSuccess(false)
        onBack()
      }, 2000)
    }, 1000)
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-card rounded-lg p-8 shadow-lg text-center max-w-md">
          <div className="text-5xl mb-4">✓</div>
          <h2 className="text-2xl font-bold mb-2 text-primary">¡Pedido Confirmado!</h2>
          <p className="text-muted-foreground mb-4">Tu pedido ha sido confirmado y será entregado pronto.</p>
          <p className="text-sm text-muted-foreground">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-primary font-semibold hover:underline">
        ← Volver al Menú
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
          <div className="space-y-2 mb-4">
            {cart.map((cartItem) => {
              const item = menuItems.find((m) => m.id === cartItem.itemId)
              return (
                <div key={cartItem.itemId} className="flex justify-between text-sm">
                  <span>
                    {item?.name} x{cartItem.quantity}
                  </span>
                  <span>${(item?.price || 0) * cartItem.quantity}</span>
                </div>
              )
            })}
          </div>
          <div className="border-t border-border pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tarifa de Envío:</span>
              <span>${restaurant.deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {errors.length > 0 && (
            <div className="bg-destructive/10 border border-destructive rounded-lg p-4">
              <p className="font-semibold text-destructive mb-2">Por favor corrige los siguientes errores:</p>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, idx) => (
                  <li key={idx} className="text-sm text-destructive">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-card rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4">Dirección de Envío</h2>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Dirección de Calle"
                value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg"
              />
              <input
                type="text"
                placeholder="Ciudad"
                value={address.city}
                onChange={(e) => setAddress({ ...address, city: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg"
              />
              <input
                type="text"
                placeholder="Código Postal"
                value={address.zip}
                onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg"
              />
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold mb-4">Método de Pago</h2>
            <div className="space-y-2">
              {["card", "wallet", "cash"].map((method) => (
                <label key={method} className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" checked={paymentMethod === method} onChange={() => setPaymentMethod(method)} />
                  <span className="capitalize">
                    {method === "card" ? "Tarjeta de Crédito" : method === "wallet" ? "Billetera Digital" : "Efectivo"}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {loading ? "Confirmando Pedido..." : "Confirmar Pedido"}
          </button>
        </div>
      </div>
    </div>
  )
}
