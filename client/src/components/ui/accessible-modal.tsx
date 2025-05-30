import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function AccessibleModal({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: ModalProps) {
  const modalRef = useFocusTrap(isOpen);
  
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    
    // Prevent body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Store previously focused element to restore focus when modal closes
  useEffect(() => {
    const previouslyFocusedElement = document.activeElement as HTMLElement;
    
    return () => {
      if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
      }
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby={description ? "modal-description" : undefined}
      onClick={(e) => {
        // Close when clicking the overlay
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div 
        ref={modalRef}
        className={cn(
          "relative max-h-[90vh] w-full max-w-md overflow-auto rounded-lg border bg-background p-6 shadow-lg",
          className
        )}
      >
        <div className="flex items-start justify-between">
          <div>
            <h2 id="modal-title" className="text-lg font-medium">{title}</h2>
            {description && (
              <p id="modal-description" className="mt-1 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-4">
          {children}
        </div>
      </div>
    </div>
  );
}
