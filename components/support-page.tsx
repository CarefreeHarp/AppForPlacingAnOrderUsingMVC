"use client"

import { useState } from "react"

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState<"pqr" | "faq">("pqr")
  const [formData, setFormData] = useState({ title: "", description: "", category: "delivery" })

  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-border">
        {[
          { id: "pqr", label: "Crear Ticket de Soporte" },
          { id: "faq", label: "Preguntas Frecuentes" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 font-semibold transition ${
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "pqr" && (
        <div className="bg-card rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-bold mb-4">Crear un Ticket de Soporte</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Categoría</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg"
              >
                <option value="delivery">Entrega</option>
                <option value="payment">Pago</option>
                <option value="order">Pedido</option>
                <option value="account">Cuenta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Asunto</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Describe brevemente tu problema"
                className="w-full px-4 py-2 border border-border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Descripción</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Proporciona información detallada"
                rows={5}
                className="w-full px-4 py-2 border border-border rounded-lg"
              />
            </div>
            <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:opacity-90">
              Enviar Ticket
            </button>
          </div>
        </div>
      )}

      {activeTab === "faq" && (
        <div className="space-y-4">
          {[
            {
              q: "¿Cómo rastreo mi pedido?",
              a: "Puedes rastrear tu pedido en tiempo real desde la página de Pedidos.",
            },
            { q: "¿Cuál es tu política de reembolso?", a: "Los reembolsos se procesan dentro de 5-7 días hábiles." },
            { q: "¿Puedo cancelar un pedido?", a: "Los pedidos se pueden cancelar si aún no están siendo preparados." },
          ].map((faq, idx) => (
            <div key={idx} className="bg-card rounded-lg p-4 shadow-md">
              <h3 className="font-bold mb-2">{faq.q}</h3>
              <p className="text-muted-foreground">{faq.a}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
