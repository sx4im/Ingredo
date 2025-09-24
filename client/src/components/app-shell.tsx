import * as React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Leaf, Menu, User, Heart, Settings, LogOut, X, Package, ShoppingCart } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navigation = [
    { name: "Discover", href: "/", current: location === "/" },
    { name: "Search", href: "/search", current: location === "/search" },
    { name: "Dashboard", href: "/dashboard", current: location === "/dashboard" },
    { name: "Pantry", href: "/pantry", current: location === "/pantry" },
    { name: "Shopping", href: "/shopping", current: location === "/shopping" },
    { name: "Favorites", href: "/favorites", current: location === "/favorites" },
  ];


  return (
    <div className="min-h-screen flex flex-col">
      {/* Desktop Header - Hidden on mobile and tablet devices */}
      <div className="w-full px-4 py-2 relative z-50 navbar-container hidden lg:block">
        <header className="compact-navbar rounded-md border border-gray-200 shadow-sm bg-white backdrop-blur-sm relative">
          <div className="px-4 py-3 relative z-10">
            <div className="flex h-14 items-center justify-center gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center" data-testid="logo-link">
              <img 
                src="/logo2.png" 
                alt="Ingredo Logo" 
                className="app-logo rounded-xl"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="flex items-center gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "nav-button",
                    item.current ? "active" : ""
                  )}
                  data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center">
              {/* Profile Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" data-testid="profile-menu" className="h-12 w-12 rounded-full p-0 hover:bg-transparent">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-orange-500 text-white text-sm rounded-full">
                        <User className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" data-testid="menu-profile">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/favorites" data-testid="menu-favorites">
                      <Heart className="mr-2 h-4 w-4" />
                      Favorites
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings" data-testid="menu-settings">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/pantry" data-testid="menu-pantry">
                      <Package className="mr-2 h-4 w-4" />
                      Pantry
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/shopping" data-testid="menu-shopping">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Shopping List
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem data-testid="menu-logout">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          </div>
        </header>
      </div>

      {/* Mobile Logo - Only visible on discover page for mobile and tablet devices */}
      {location === "/" && (
        <div className="lg:hidden fixed top-4 left-4 z-50 h-16 flex items-center">
          <Link href="/" className="flex items-center">
            <img 
              src="/logo2.png" 
              alt="Ingredo Logo" 
              className="app-logo-mobile-large rounded-xl"
            />
          </Link>
        </div>
      )}

      {/* Mobile Menu Button - Only visible on mobile and tablet devices */}
      <div className={`lg:hidden fixed top-4 right-6 z-[9999] h-16 flex items-center transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="mobile-menu-button transition-all duration-200"
              data-testid="mobile-menu-toggle"
            >
              <Menu className="mobile-menu-icon stroke-2" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 [&>button]:hidden">
            <div className="flex flex-col h-full">
              {/* Mobile Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <img 
                    src="/logo2.png" 
                    alt="Ingredo Logo" 
                    className="app-logo-mobile rounded-xl"
                  />
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-8 w-8 text-gray-600" />
                </button>
              </div>


              {/* Mobile Navigation */}
              <div className="flex-1">
                <nav className="space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center px-4 py-3 text-lg font-medium transition-colors rounded-full",
                        item.current ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"
                      )}
                      data-testid={`mobile-nav-${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                </nav>

                {/* Mobile Profile Section */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      className="flex items-center px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <User className="mr-3 h-5 w-5" />
                      Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="mr-3 h-5 w-5" />
                      Settings
                    </Link>
                    <button className="flex items-center px-4 py-3 text-lg font-medium text-gray-700 hover:bg-gray-100 rounded-lg w-full text-left">
                      <LogOut className="mr-3 h-5 w-5" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white relative z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            {/* Left side - Crafted by text */}
            <div className="static-text mb-7 lg:mb-0 ">
              CRAFTED BY <a 
                href="https://saimshafique.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="portfolio-link font-bold"
              >
                SAIM SHAFIQUE
              </a>
            </div>
            
            {/* Right side - Social icons */}
            <div className="flex space-x-4 mb-4 lg:mb-0">
              <Link href="https://github.com/sx4im" className="text-white/80 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="https://linkedin.com/in/sx4im" className="text-white/80 hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="mailto:saimshafique.dev@gmail.com" className="text-white/80 hover:text-white transition-colors">
                <span className="sr-only">Email</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </Link>
              <Link href="https://instagram.com/sx4im" className="text-white/80 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.017 0H7.983C3.582 0 0 3.582 0 7.983v4.034C0 16.418 3.582 20 7.983 20h4.034C16.418 20 20 16.418 20 12.017V7.983C20 3.582 16.418 0 12.017 0zM10 13.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7zm6.5-6.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}