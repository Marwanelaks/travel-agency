import React, { ReactNode, useState } from 'react';
import { DashboardNav } from './DashboardNav';
import { DashboardHeader } from './DashboardHeader';
import { SkipLink } from '../ui/skip-link';
import { Button } from '../ui/button';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../../components/ui/resizable';
import { Menu, X } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="dashboard-layout h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Skip link for keyboard users to bypass navigation */}
      <SkipLink href="#main-content" />
      
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <Button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          variant="default"
          size="icon"
          className="h-12 w-12 rounded-full shadow-lg bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0"
        >
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - with enhanced styling */}
        <div 
          className={`fixed inset-y-0 left-0 z-50 transform md:relative md:translate-x-0 transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
            md:w-72 border-r border-indigo-100 dark:border-gray-800 bg-white dark:bg-gray-800 shadow-sm`}>
          <nav aria-label="Main Navigation" className="h-full">
            <DashboardNav />
          </nav>
        </div>
        
        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden" 
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <header className="z-10">
            <DashboardHeader />
          </header>
          <main 
            id="main-content" 
            tabIndex={-1} 
            className="dashboard-content overflow-auto outline-none flex-1 p-4 md:p-6 bg-gray-50 dark:bg-gray-900"
            // Using inert attribute instead of aria-hidden for better accessibility
            // This ensures elements inside the main tag can receive focus properly
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
