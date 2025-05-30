import * as React from "react";
import {
  Toast,
  ToastAction,
  ToastDescription,
  ToastTitle,
  ToastViewport,
  ToastClose
} from "./toast";
// Locally define ToastActionElement and ToastProps

type ToastActionElement = React.ReactElement | null;
type ToastProps = React.ComponentProps<typeof Toast>;
export type { ToastProps };


// Export Toast and ToastViewport for use in other modules
export { Toast, ToastViewport };
// ToastProvider is exported below as a named export, do not re-export it here.


type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

type ToastContextType = {
  toasts: ToasterToast[];
  toast: (props: Omit<ToasterToast, "id">) => { id: string; dismiss: () => void };
  dismiss: (toastId?: string) => void;
};

// Imperative toast API for compatibility (shadcn/ui style)
let toastHandler: ((props: Omit<ToasterToast, "id">) => { id: string; dismiss: () => void }) | null = null;

export function setToastHandler(fn: typeof toastHandler) {
  toastHandler = fn;
}

export function toast(props: Omit<ToasterToast, "id">) {
  if (!toastHandler) {
    throw new Error("ToastProvider is not mounted");
  }
  return toastHandler(props);
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);
let isProviderMounted = false; // for runtime warning

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (isProviderMounted) {
    if (import.meta.env.MODE !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('Warning: Multiple ToastProviders detected. Only one ToastProvider should be mounted at the root.');
    }
  }
  isProviderMounted = true;
  const [toasts, setToasts] = React.useState<ToasterToast[]>([]);

  const dismiss = React.useCallback((toastId?: string) => {
    if (toastId) {
      setToasts((current) => current.filter((toast) => toast.id !== toastId));
    } else {
      setToasts([]);
    }
  }, []);

  const toast = React.useCallback((props: Omit<ToasterToast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((current) => [...current, { ...props, id }]);
    return {
      id,
      dismiss: () => dismiss(id),
    };
  }, [dismiss]);

  // Set the imperative toast handler for compatibility
  React.useEffect(() => {
    setToastHandler(toast);
    return () => setToastHandler(null);
  }, [toast]);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
};

// Reset isProviderMounted if component unmounts (for hot reload/dev)
if (import.meta && import.meta.hot) {
  import.meta.hot.dispose(() => {
    isProviderMounted = false;
  });
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider (from '@/components/ui/use-toast') at the root of your app.\n\nCheck for duplicate or mismatched ToastProvider implementations, and ensure only this file's ToastProvider is used.");
  }
  return context;
}

// Toaster component for rendering all toasts
export function Toaster() {
  const { toasts, dismiss } = useToast();
  return (
    <>
      {toasts.map(({ id, title, description, action, ...props }) => (
        <Toast key={id} {...props}>
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && <ToastDescription>{description}</ToastDescription>}
          </div>
          {action}
          <ToastClose onClick={() => dismiss(id)} />
        </Toast>
      ))}
    </>
  );
}