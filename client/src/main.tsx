import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './index.css';
import { AuthProvider } from '@/hooks/useAuth';
import { Toaster, ToastProvider } from '@/components/ui/use-toast';
import { ThemeProvider } from './components/providers/theme-provider';

const queryClient = new QueryClient();

function Root() {
  return (
    <React.StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme="light">
            {/* Only one ToastProvider at the root */}
            <ToastProvider>
              <AuthProvider>
                <App />
                <Toaster />
              </AuthProvider>
            </ToastProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
}

// Ensure only one root is created
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

// Check if a root already exists to prevent duplicate rendering
let appRoot: ReactDOM.Root;
try {
  appRoot = ReactDOM.createRoot(rootElement);
} catch (error) {
  console.error('Error creating root, may already be initialized:', error);
  // This will still throw, but we've logged the error
  appRoot = ReactDOM.createRoot(rootElement);
}

appRoot.render(<Root />);
