import React, { createContext, useContext, useState, useCallback, ReactNode, useMemo } from 'react';

export type ToastVariant = 'default' | 'destructive' | 'success';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration: number;
}

type ToastOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

interface ToastContextType {
  toasts: Toast[];
  toast: (options: ToastOptions) => string;
  success: (title: string, description?: string, duration?: number) => string;
  error: (title: string, description?: string, duration?: number) => string;
  dismissToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// DEPRECATED: Use ToastProvider and useToast from '@/components/ui/use-toast' only. Do not use this file.
// Implementation intentionally removed.
//
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  const addToast = useCallback((options: ToastOptions): string => {
    const id = Math.random().toString(36).substr(2, 9);
    const toast = { 
      ...options, 
      id,
      variant: options.variant || 'default',
      duration: options.duration ?? 5000
    };
    
    setToasts((currentToasts) => [...currentToasts, toast as Toast]);

    if (toast.duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, toast.duration);
    }
    
    return id;
  }, [dismissToast]);

  const success = useCallback((title: string, description?: string, duration?: number) => {
    return addToast({ title, description, variant: 'success', duration });
  }, [addToast]);

  const error = useCallback((title: string, description?: string, duration?: number) => {
    return addToast({ title, description, variant: 'destructive', duration });
  }, [addToast]);

  const toast = useCallback((options: ToastOptions) => {
    return addToast(options);
  }, [addToast]);

  const value = useMemo(() => ({
    toasts,
    toast,
    success,
    error,
    dismissToast,
  }), [toasts, toast, success, error, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
}
