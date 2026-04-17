import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

export type ToastFn = (msg: string, isError?: boolean) => void

interface ToastItem {
  id: number
  msg: string
  isError: boolean
}

const ToastCtx = createContext<ToastFn | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const toast: ToastFn = useCallback((msg, isError = false) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, msg, isError }])
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2200)
  }, [])

  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9998,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="toast"
            style={t.isError ? { background: 'var(--red)', color: '#fff' } : {}}
          >
            {t.msg}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast(): ToastFn {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
