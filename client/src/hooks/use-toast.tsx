import * as React from "react"
import { useContext } from 'react';

type ToastVariant = "default" | "destructive" | "success"

interface ToastProps {
  id: string
  title: string
  description?: string
  variant?: ToastVariant
  duration?: number
}

type Toast = ToastProps & {
  id: string
  visible: boolean
}

type ToastContextType = {
  toasts: Toast[]
  toast: (props: Omit<ToastProps, "id">) => string
  dismissToast: (id: string) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

// DEPRECATED: Use ToastProvider and useToast from '@/components/ui/use-toast' only. Do not use this file.
throw new Error('Do not import useToast or ToastProvider from hooks/use-toast. Use @/components/ui/use-toast instead.');
// Implementation intentionally removed.
//
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const toast = React.useCallback(({ title, description, variant = "default", duration = 5000 }: Omit<ToastProps, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    
    setToasts((currentToasts) => [
      ...currentToasts,
      { id, title, description, variant, visible: true },
    ])

    if (duration !== 0) {
      setTimeout(() => {
        dismissToast(id)
      }, duration)
    }

    return id
  }, [])

  const dismissToast = React.useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.map((toast) =>
        toast.id === id ? { ...toast, visible: false } : toast
      )
    )
    
    // Remove toast from state after animation
    setTimeout(() => {
      setToasts((currentToasts) =>
        currentToasts.filter((toast) => toast.id !== id)
      )
    }, 300)
  }, [])

  const value = React.useMemo(
    () => ({
      toasts,
      toast,
      dismissToast,
    }),
    [toasts, toast, dismissToast]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastViewport toasts={toasts} dismissToast={dismissToast} />
    </ToastContext.Provider>
  )
}

const ToastViewport: React.FC<{ toasts: Toast[]; dismissToast: (id: string) => void }> = ({ toasts, dismissToast }) => {
  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col gap-2 p-4 max-h-screen overflow-hidden">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  )
}

const ToastItem: React.FC<{ toast: Toast; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  const { title, description, variant = 'default', id } = toast
  
  const variantStyles = {
    default: "bg-background border",
    destructive: "bg-destructive text-destructive-foreground border-destructive/50",
    success: "bg-green-500 text-white border-green-600/50",
  }

  return (
    <div
      className={`relative flex flex-col gap-1 p-4 rounded-lg shadow-lg border transition-all duration-300 ${
        toast.visible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
      } ${variantStyles[variant] || variantStyles.default}`}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <button
          onClick={() => onDismiss(id)}
          className="ml-4 text-current opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <span className="sr-only">Dismiss</span>
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      {description && <p className="text-sm opacity-90">{description}</p>}
    </div>
  )
}

import { useContext } from 'react';

const useToast = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export { ToastProvider, useToast }
