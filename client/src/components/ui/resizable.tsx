import { DragHandleDots2Icon } from "@radix-ui/react-icons"
import React, { useEffect, useRef } from "react"
import * as ResizablePrimitive from "react-resizable-panels"

import { cn } from "@/lib/utils"

const ResizablePanelGroup = ({
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelGroup> & { onLayout?: (sizes: number[]) => void }) => {
  // Use a separate ref to access DOM for accessibility fixes
  const accessibilityRef = React.useRef<HTMLDivElement>(null);

  // Fix accessibility issues with aria-hidden by using inert attribute instead
  // for collapsed panels, which is the proper way to hide content from all users
  React.useEffect(() => {
    // Fix accessibility issues with aria-hidden
    const fixAccessibilityIssues = () => {
      if (!accessibilityRef.current) return;

      try {
        // Find all elements with aria-hidden inside this component
        const elements = accessibilityRef.current.querySelectorAll('[aria-hidden="true"], [data-aria-hidden="true"]');
        
        // Replace aria-hidden with inert attribute where appropriate
        elements.forEach(el => {
          // Remove aria-hidden attributes
          el.removeAttribute('aria-hidden');
          if (el.hasAttribute('data-aria-hidden')) {
            el.removeAttribute('data-aria-hidden');
          }
          
          // Check if this element is actually supposed to be hidden from all users
          // (like a collapsed panel). If so, use inert instead which is the proper attribute
          // that prevents both visual display AND focus/interaction
          const isCollapsed = el.classList.contains('collapsed') || 
                             el.getAttribute('data-state') === 'closed' ||
                             el.getAttribute('data-collapsed') === 'true';
                             
          if (isCollapsed) {
            // Use the inert attribute instead of aria-hidden
            el.setAttribute('inert', '');
          }
        });
      } catch (error) {
        console.error('Error fixing accessibility attributes:', error);
      }
    };

    // Call immediately and set up mutation observer to watch for changes
    fixAccessibilityIssues();
    
    // Set up a mutation observer to detect when attributes change
    const observer = new MutationObserver(fixAccessibilityIssues);
    
    if (accessibilityRef.current) {
      observer.observe(accessibilityRef.current, { 
        attributes: true, 
        attributeFilter: ['aria-hidden', 'data-aria-hidden', 'inert', 'data-state', 'data-collapsed'],
        subtree: true 
      });
    }
    
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={accessibilityRef} className="relative w-full h-full">
      <ResizablePrimitive.PanelGroup
        className={cn(
          "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
          className
        )}
        {...props}
        data-disable-collapsed-panels-aria-hidden="true"
      />
    </div>
  );
}

// Extend the ResizablePanel with accessibility improvements
const ResizablePanel = ({ className, ...props }: React.ComponentProps<typeof ResizablePrimitive.Panel>) => (
  <ResizablePrimitive.Panel
    className={cn("relative", className)}
    {...props}
  />
)

const ResizableHandle = ({
  withHandle,
  className,
  ...props
}: React.ComponentProps<typeof ResizablePrimitive.PanelResizeHandle> & {
  withHandle?: boolean
}) => (
  <ResizablePrimitive.PanelResizeHandle
    className={cn(
      "relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full data-[panel-group-direction=vertical]:after:left-0 data-[panel-group-direction=vertical]:after:h-1 data-[panel-group-direction=vertical]:after:w-full data-[panel-group-direction=vertical]:after:-translate-y-1/2 data-[panel-group-direction=vertical]:after:translate-x-0 [&[data-panel-group-direction=vertical]>div]:rotate-90",
      className
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <DragHandleDots2Icon className="h-2.5 w-2.5" />
      </div>
    )}
  </ResizablePrimitive.PanelResizeHandle>
)

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
