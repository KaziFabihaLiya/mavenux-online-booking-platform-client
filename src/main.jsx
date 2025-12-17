import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast';
import AuthProvider from './context/AuthProvider.jsx';
import { RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from './routes/Routes.jsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, 
      retry: 1, 
      staleTime: 5 * 60 * 1000, 
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" reverseOrder={false} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);
