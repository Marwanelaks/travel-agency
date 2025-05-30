'use client';

import * as React from 'react';
import { useToast } from '@/components/ui/use-toast';
// NOTE: This Toaster must only be rendered inside the ToastProvider from '@/components/ui/use-toast'.
// If you see a context error, check for duplicate or mismatched ToastProvider implementations.

import { Toast, ToastTitle, ToastDescription, ToastClose } from './toast';

export function Toaster() {
  let contextError = false;
  let toasts: any[] = [];
  let dismiss = () => {};
  try {
    const toastCtx = useToast();
    toasts = toastCtx.toasts;
    dismiss = toastCtx.dismiss;
  } catch (e: any) {
    contextError = true;
    if (import.meta.env.MODE !== 'production') {
      // eslint-disable-next-line no-console
      console.warn('Toaster rendered outside of ToastProvider. Make sure Toaster is used inside the ToastProvider from \'@/components/ui/use-toast\'.');
    }
  }
  if (contextError) return null;

  return (
    <>
      {toasts.map(({ id, title, description, variant }) => (
        <Toast
          key={id}
          variant={variant}
          className="mb-2"
        >
          <div className="grid gap-1">
            {title && <ToastTitle>{title}</ToastTitle>}
            {description && (
              <ToastDescription>{description}</ToastDescription>
            )}
          </div>
          <ToastClose onClick={() => dismiss(id)} />
        </Toast>
      ))}
    </>
  );
}
