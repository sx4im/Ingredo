import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/error-boundary";
import { AppShell } from "@/components/app-shell";
import { AuthProvider } from "@/lib/auth-context";

// Pages
import Home from "@/pages/home";
import Search from "@/pages/search";
import Recipe from "@/pages/recipe";
import Profile from "@/pages/profile";
import Admin from "@/pages/admin";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Pantry from "@/pages/pantry";
import Shopping from "@/pages/shopping";
import Favorites from "@/pages/favorites";
import Settings from "@/pages/settings";

// Auth Pages
import Login from "@/pages/auth/login";
import Signup from "@/pages/auth/signup";

function AppRouter() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/" component={Home} />
      <Route path="/search" component={Search} />
      <Route path="/recipe/:slug" component={Recipe} />
      
      {/* Auth Routes */}
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/signup" component={Signup} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/pantry" component={Pantry} />
      <Route path="/shopping" component={Shopping} />
      <Route path="/favorites" component={Favorites} />
      <Route path="/settings" component={Settings} />
      <Route path="/profile" component={Profile} />
      <Route path="/admin" component={Admin} />
      
      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Router>
              <AppShell>
                <AppRouter />
              </AppShell>
              <Toaster />
            </Router>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;