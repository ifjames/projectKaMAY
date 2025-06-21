import { Suspense, useEffect, Component, ErrorInfo, ReactNode } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Auth from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import Lessons from "@/pages/lessons";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import GlassNavbar from "@/components/glass-navbar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<{children: ReactNode}, ErrorBoundaryState> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn('Error Boundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
    
    // Report error to external service if needed
    // Don't throw or re-raise the error to avoid Vite Internal Server Error
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="glass-effect rounded-3xl p-8 max-w-md text-center">
            <h1 className="text-xl font-bold text-foreground mb-4">Something went wrong</h1>
            <p className="text-muted-foreground mb-4">
              An unexpected error occurred. Please refresh the page to continue.
            </p>
            {this.state.error && (
              <details className="text-left text-sm text-muted-foreground mb-4">
                <summary className="cursor-pointer font-medium">Error Details</summary>
                <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-filipino-blue text-white rounded-lg hover:bg-opacity-90"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function Router() {
  const { currentUser, loading, userData } = useAuth();

  // Initialize theme on app load
  useEffect(() => {
    const initializeTheme = () => {
      // Get theme from user settings or localStorage or default to system
      const savedTheme = (userData?.settings as any)?.theme || localStorage.getItem('theme') || 'system';
      
      console.log('Initializing theme:', savedTheme);
      
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
        console.log('Applied dark theme');
      } else if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
        console.log('Applied light theme');
      } else {
        // System theme
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (mediaQuery.matches) {
          document.documentElement.classList.add('dark');
          console.log('Applied dark theme (system)');
        } else {
          document.documentElement.classList.remove('dark');
          console.log('Applied light theme (system)');
        }
      }
    };

    initializeTheme();
  }, [userData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background cultural-pattern flex items-center justify-center">
        <div className="glass-effect rounded-3xl p-8">
          <div className="animate-spin w-8 h-8 border-4 border-filipino-blue border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading KaMAY...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <Switch>
        <Route path="/" component={Auth} />
        <Route component={Auth} />
      </Switch>
    );
  }

  return (
    <div className="min-h-screen bg-background cultural-pattern">
      <GlassNavbar />
      <main className="pt-20 pb-8">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/lessons" component={Lessons} />
          <Route path="/profile" component={Profile} />
          <Route path="/settings" component={Settings} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  // Ensure Firebase is properly initialized
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={
          <div className="min-h-screen bg-background cultural-pattern flex items-center justify-center">
            <div className="glass-effect rounded-3xl p-8">
              <div className="animate-spin w-8 h-8 border-4 border-filipino-blue border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading KaMAY...</p>
            </div>
          </div>
        }>
          <AuthProvider>
            <Router />
            <Toaster />
          </AuthProvider>
        </Suspense>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
