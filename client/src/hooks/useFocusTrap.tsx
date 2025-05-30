import { useEffect, useRef } from 'react';

// List of selectors for focusable elements
const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  'details',
  'summary',
].join(', ');

/**
 * Hook to trap focus within a container
 * Useful for modals, dialogs, and other components that need to trap focus
 */
export function useFocusTrap(isActive: boolean = true) {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Find all focusable elements in the container
    const getFocusableElements = () => {
      return Array.from(
        containerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS) || []
      );
    };

    // Get the first and last focusable elements
    const focusableElements = getFocusableElements();
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the first element when trap is activated
    if (firstElement && document.activeElement === document.body) {
      firstElement.focus();
    }

    // Handle keydown events to trap focus
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if modifier keys are pressed
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // If Tab key is pressed
      if (e.key === 'Tab') {
        // If Shift + Tab and focus is on first element, move to last
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } 
        // If Tab and focus is on last element, move to first
        else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Add keydown event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive]);

  return containerRef;
}
