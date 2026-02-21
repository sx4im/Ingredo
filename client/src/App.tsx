import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/error-boundary";
import { AppShell } from "@/components/app-shell";
import { AuthProvider } from "@/lib/auth-context";
import { Analytics } from "@vercel/analytics/react";

import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";

// Lazy-loaded Pages
const Home = lazy(() => import("@/pages/home"));
const Search = lazy(() => import("@/pages/search"));
const Recipe = lazy(() => import("@/pages/recipe"));
const Profile = lazy(() => import("@/pages/profile"));
const Admin = lazy(() => import("@/pages/admin"));
const NotFound = lazy(() => import("@/pages/not-found"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Pantry = lazy(() => import("@/pages/pantry"));
const Shopping = lazy(() => import("@/pages/shopping"));
const Favorites = lazy(() => import("@/pages/favorites"));
const Settings = lazy(() => import("@/pages/settings"));

// Lazy-loaded Auth Pages
const Login = lazy(() => import("@/pages/auth/login"));
const Signup = lazy(() => import("@/pages/auth/signup"));

function AppRouter() {
  return (
    <Suspense 
      fallback={
        <div className="flex h-[50vh] w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
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
    </Suspense>
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
              <Analytics />
            </Router>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;