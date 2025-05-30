import React from 'react';

interface SkipLinkProps {
  href: string;
  className?: string;
}

/**
 * A skip link component that allows keyboard users to bypass navigation
 * and jump directly to the main content
 */
export function SkipLink({ href, className = '' }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={`sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:p-4 focus:bg-background focus:border focus:border-primary focus:text-foreground focus:shadow-lg focus:rounded-md ${className}`}
    >
      Skip to content
    </a>
  );
}
