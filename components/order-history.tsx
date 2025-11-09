"use client"

import { useState } from "react"
import { useAppContext } from "@/lib/app-context"

interface RatingModalProps {
  orderId: string
  restaurantName: string
  onClose: () => void
  onSubmit: (rating: number, feedback: string) => void
}

function RatingModal({ orderId, restaurantName, onClose, onSubmit }: RatingModalProps) {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Por favor selecciona una calificación")
      return
    }
    onSubmit(rating, feedback)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card rounded-lg p-6 shadow-lg max-w-md w-full mx-4">
        <h2 className="text-xl font-bold mb-4">Califica Tu Comida</h2>
        <p className="text-muted-foreground mb-4">¿Cómo fue tu pedido de {restaurantName}?</p>

        <div className="mb-4">
          <p className="text-sm font-semibold mb-3">Calificación</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                className={`text-3xl transition ${rating >= star ? "text-yellow-400" : "text-gray-300"}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm font-semibold mb-2">Comentarios (Opcional)</p>
          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Cuéntanos sobre tu experiencia..."
            className="w-full px-3 py-2 border border-border rounded-lg resize-none h-24"
          />
        </div>

        <div className="flex gap-2">
          <button onClick={onClose} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            Enviar Calificación
          </button>
        </div>
      </div>
    </div>
  )
}

export default function OrderHistory() {
  const { orders, updateOrderRating } = useAppContext()
  const [ratingOrderId, setRatingOrderId] = useState<string | null>(null)

  const handleRatingSubmit = (orderId: string, rating: number, feedback: string) => {
    updateOrderRating(orderId, rating, feedback)
    setRatingOrderId(null)
  }

  const currentOrder = orders.find((o) => o.id === ratingOrderId)

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Tus Pedidos</h2>
      {orders.length === 0 ? (
        <div className="bg-card rounded-lg p-6 shadow-md text-center">
          <p className="text-muted-foreground">Aún no tienes pedidos. ¡Comienza a ordenar de restaurantes!</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order.id} className="bg-card rounded-lg p-6 shadow-md">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold">{order.restaurantName}</h3>
                <p className="text-sm text-muted-foreground">{order.createdAt.toLocaleDateString()}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  order.status === "delivered"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                }`}
              >
                {order.status === "delivered" ? "Entregado" : "En Progreso"}
              </span>
            </div>

            <div className="mb-3">
              <p className="text-sm font-semibold mb-2">Artículos:</p>
              <ul className="space-y-1">
                {order.items.map((item, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground">
                    {item.name} x{item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border pt-3 mb-3">
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {order.rating && (
              <div className="bg-muted p-3 rounded-lg mb-3">
                <p className="text-sm font-semibold">
                  Tu Calificación: {"★".repeat(order.rating)}
                  {"☆".repeat(5 - order.rating)}
                </p>
                {order.feedback && <p className="text-sm text-muted-foreground mt-1">{order.feedback}</p>}
              </div>
            )}

            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10">
                Rastrear
              </button>
              <button className="flex-1 px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary/10">
                Pedir de Nuevo
              </button>
              {order.status === "delivered" && !order.rating && (
                <button
                  onClick={() => setRatingOrderId(order.id)}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
                >
                  Calificar Comida
                </button>
              )}
            </div>
          </div>
        ))
      )}

      {ratingOrderId && currentOrder && (
        <RatingModal
          orderId={ratingOrderId}
          restaurantName={currentOrder.restaurantName}
          onClose={() => setRatingOrderId(null)}
          onSubmit={(rating, feedback) => handleRatingSubmit(ratingOrderId, rating, feedback)}
        />
      )}
    </div>
  )
}
