import { useCallback, useState } from 'react';

type ToastVariant = 'default' | 'destructive' | 'success';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ 
    title, 
    description, 
    variant = 'default', 
    duration = 5000 
  }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    setToasts((currentToasts) => [
      ...currentToasts,
      { id, title, description, variant, duration },
    ]);

    if (duration > 0) {
      setTimeout(() => {
        dismissToast(id);
      }, duration);
    }

    return id;
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );
  }, []);

  return {
    toasts,
    toast,
    dismissToast,
  };
}
