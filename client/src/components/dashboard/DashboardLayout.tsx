import React, { ReactNode } from 'react';
import { DashboardNav } from './DashboardNav';
import { DashboardHeader } from './DashboardHeader';
import { SkipLink } from '../ui/skip-link';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../../components/ui/resizable';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  // Simple responsive layout without using ResizablePanelGroup to avoid accessibility issues
  return (
    <div className="dashboard-layout h-screen flex flex-col">
      {/* Skip link for keyboard users to bypass navigation */}
      <SkipLink href="#main-content" />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - using standard div instead of ResizablePanel */}
        <div className="dashboard-sidebar hidden md:block w-64 border-r border-border bg-card">
          <nav aria-label="Main Navigation">
            <DashboardNav />
          </nav>
        </div>
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col">
          <header>
            <DashboardHeader />
          </header>
          <main 
            id="main-content" 
            tabIndex={-1} 
            className="dashboard-content overflow-auto outline-none flex-1 p-4 md:p-6 bg-background"
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
