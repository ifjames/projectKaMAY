import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Auth from "@/pages/auth";
import Dashboard from "@/pages/dashboard";
import Lessons from "@/pages/lessons";
import Profile from "@/pages/profile";
import Settings from "@/pages/settings";
import GlassNavbar from "@/components/glass-navbar";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

function Router() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 cultural-pattern flex items-center justify-center">
        <div className="glass-effect rounded-3xl p-8">
          <div className="animate-spin w-8 h-8 border-4 border-filipino-blue border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading KaMAY...</p>
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
    <div className="min-h-screen bg-gray-50 cultural-pattern">
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
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
