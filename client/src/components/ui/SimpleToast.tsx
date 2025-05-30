import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Toast } from '@/lib/toast-context';

interface SimpleToastProps extends Toast {
  onDismiss: (id: string) => void;
}

const variantClasses = {
  default: 'bg-background border',
  destructive: 'bg-destructive text-destructive-foreground border-destructive/50',
  success: 'bg-green-500 text-white border-green-600/50',
};

export function SimpleToast({
  id,
  title,
  description,
  variant = 'default',
  duration = 5000,
  onDismiss,
}: SimpleToastProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger the enter animation
    setIsVisible(true);
    
    // Set up auto-dismiss if duration is not 0
    if (duration !== 0) {
      const timer = setTimeout(() => {
        handleDismiss();
      }, duration || 5000);
      
      return () => clearTimeout(timer);
    }
  }, [id, onDismiss]);

  const handleDismiss = () => {
    setIsVisible(false);
    // Wait for the fade-out animation before removing
    setTimeout(() => onDismiss(id), 300);
  };

  return (
    <div
      className={cn(
        'relative flex flex-col gap-1 p-4 rounded-lg shadow-lg border transition-all duration-300 transform',
        'ease-in-out',
        variantClasses[variant],
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      )}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{title}</h3>
        <button
          onClick={handleDismiss}
          className="ml-4 text-current opacity-50 hover:opacity-100 transition-opacity"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      {description && <p className="text-sm mt-1">{description}</p>}
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-[350px] w-full">
      {toasts.map((toast) => (
        <SimpleToast
          key={toast.id}
          {...toast}
          onDismiss={onDismiss}
        />
      ))}
    </div>
  );
}
