"use client"

import { createContext, useContext, useState, useCallback, type ReactNode } from "react"

export type CartItem = {
  priceId: string
  productId: string
  name: string
  image: string
  price: number
  currency: string
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (priceId: string) => void
  updateQuantity: (priceId: string, quantity: number) => void
  clear: () => void
  total: number
  count: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback((item: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const i = prev.findIndex((x) => x.priceId === item.priceId)
      if (i >= 0) {
        const next = [...prev]
        next[i] = { ...next[i], quantity: next[i].quantity + 1 }
        return next
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }, [])

  const removeItem = useCallback((priceId: string) => {
    setItems((prev) => prev.filter((x) => x.priceId !== priceId))
  }, [])

  const updateQuantity = useCallback((priceId: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((x) => x.priceId !== priceId))
      return
    }
    setItems((prev) =>
      prev.map((x) => (x.priceId === priceId ? { ...x, quantity } : x))
    )
  }, [])

  const clear = useCallback(() => {
    setItems([])
  }, [])

  const total = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const count = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clear, total, count }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
