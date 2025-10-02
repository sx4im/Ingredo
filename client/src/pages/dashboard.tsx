import * as React from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { 
  ChefHat, 
  Heart, 
  ShoppingCart, 
  Package, 
  Clock, 
  Star,
  TrendingUp,
  Plus,
  ArrowRight,
  Calendar,
  Users,
  Zap,
  Target,
  BookOpen,
  Settings,
  Bell,
} from "lucide-react";

interface QuickStats {
  savedRecipes: number;
  cookedRecipes: number;
  pantryItems: number;
  shoppingItems: number;
}

interface RecentActivity {
  id: string;
  type: 'recipe_saved' | 'recipe_cooked' | 'pantry_added' | 'shopping_added';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
}

interface ExpiringItem {
  id: string;
  name: string;
  expiryDate: string;
  daysLeft: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { 
    favoriteRecipes, 
    pantryItems, 
    shoppingList, 
    getExpiringItems 
  } = useAppStore();
  

  const [quickStats] = React.useState<QuickStats>({
    savedRecipes: favoriteRecipes.length,
    cookedRecipes: 12, // Mock data
    pantryItems: pantryItems.length,
    shoppingItems: shoppingList.length,
  });

  const [recentActivity] = React.useState<RecentActivity[]>([
    {
      id: "1",
      type: "recipe_saved",
      title: "Saved Caprese Salad",
      description: "Added to your favorites",
      timestamp: "2 hours ago",
      icon: <Heart className="h-4 w-4 text-red-500" />
    },
    {
      id: "2",
      type: "pantry_added",
      title: "Added Tomatoes",
      description: "Added to your pantry",
      timestamp: "4 hours ago",
      icon: <Package className="h-4 w-4 text-green-500" />
    },
    {
      id: "3",
      type: "recipe_cooked",
      title: "Cooked Pasta Marinara",
      description: "Marked as completed",
      timestamp: "1 day ago",
      icon: <ChefHat className="h-4 w-4 text-orange-500" />
    },
    {
      id: "4",
      type: "shopping_added",
      title: "Added Basil",
      description: "Added to shopping list",
      timestamp: "2 days ago",
      icon: <ShoppingCart className="h-4 w-4 text-blue-500" />
    }
  ]);

  const expiringItems = getExpiringItems();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        duration: 0.4
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/dashboard.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Blue Overlay */}
      <div 
        className="fixed inset-0 z-10"
        style={{ backgroundColor: 'rgba(30, 64, 175, 0.4)' }}
      />
      
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2 text-left">
                  {getGreeting()}{user?.name?.split(' ')[0] ? `, ${user.name.split(' ')[0]}` : ''}! 
                </h1>
                <p className="text-white text-left">
                  Ready to cook something amazing today?
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Saved Recipes</p>
                      <p className="text-3xl font-bold text-gray-900">{quickStats.savedRecipes}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Recipes Cooked</p>
                      <p className="text-3xl font-bold text-gray-900">{quickStats.cookedRecipes}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg flex items-center justify-center">
                      <ChefHat className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Pantry Items</p>
                      <p className="text-3xl font-bold text-gray-900">{quickStats.pantryItems}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <Package className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Shopping Items</p>
                      <p className="text-3xl font-bold text-gray-900">{quickStats.shoppingItems}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                id="quick-actions-card"
              >
                <Card className="bg-white/95 backdrop-blur-sm h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-500" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link href="/search">
                        <Button className="w-full h-16 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white justify-start shadow-md hover:shadow-lg transition-all duration-300">
                          <ChefHat className="h-5 w-5 mr-3" />
                          <div className="text-left">
                            <div className="font-semibold">Find Recipes</div>
                            <div className="text-sm opacity-90">Discover new meals</div>
                          </div>
                        </Button>
                      </Link>
                      
                      <Link href="/pantry">
                        <Button className="w-full h-16 bg-white hover:bg-gradient-to-r hover:from-orange-500 hover:to-red-500 border-2 border-gray-200 hover:border-transparent text-gray-900 hover:text-white justify-start shadow-md hover:shadow-lg transition-all duration-300">
                          <Package className="h-5 w-5 mr-3" />
                          <div className="text-left">
                            <div className="font-semibold">Manage Pantry</div>
                            <div className="text-sm opacity-90">Track ingredients</div>
                          </div>
                        </Button>
                      </Link>
                      
                      <Link href="/shopping">
                        <Button className="w-full h-16 bg-white hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-500 border-2 border-gray-200 hover:border-transparent text-gray-900 hover:text-white justify-start shadow-md hover:shadow-lg transition-all duration-300 md:col-span-2">
                          <ShoppingCart className="h-5 w-5 mr-3" />
                          <div className="text-left">
                            <div className="font-semibold">Shopping List</div>
                            <div className="text-sm opacity-90">Plan your shopping</div>
                          </div>
                        </Button>
                      </Link>
                      
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Recent Activity */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                id="recent-activity-card"
              >
                <Card className="bg-white/95 backdrop-blur-sm h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                          className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                            {activity.icon}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{activity.title}</p>
                            <p className="text-sm text-gray-600">{activity.description}</p>
                          </div>
                          <span className="text-sm text-gray-500">{activity.timestamp}</span>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Expiring Items - Match Quick Actions height */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-white/95 backdrop-blur-sm h-full flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-orange-500" />
                      Expiring Soon
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {expiringItems.length > 0 ? (
                      <div className="flex flex-col h-full">
                        <div className="space-y-3 overflow-y-auto flex-1 min-h-[200px]">
                          {expiringItems.slice(0, 5).map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-gray-900 truncate text-sm">{item.name}</p>
                                <p className="text-xs text-gray-600">Expires in {item.daysLeft ?? 0} days</p>
                              </div>
                              <Badge variant={(item.daysLeft ?? 0) <= 1 ? "destructive" : "secondary"} className="ml-2 flex-shrink-0 text-xs">
                                {item.daysLeft ?? 0}d
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col justify-center items-center text-center min-h-[145px]">
                        <Package className="h-8 w-8 text-gray-300 mx-auto" />
                        <p className="text-gray-600 text-sm">No items expiring soon</p>
                        <p className="text-xs text-gray-500 mt-1">Great job managing your pantry!</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Cooking Tips - Match Recent Activity height */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="bg-white/95 backdrop-blur-sm h-full">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-green-500" />
                      Cooking Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-medium text-green-700 mb-1 text-2xl">Pro Tip</h4>
                        <p className="text-xs text-green-800">
                          Store fresh herbs in a glass of water in the fridge to keep them fresh longer.
                        </p>
                      </div>
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-medium text-blue-700 mb-1 text-2xl">Trending</h4>
                        <p className="text-xs text-blue-800">
                          One-pot meals are perfect for busy weeknights and easy cleanup.
                        </p>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-lg">
                        <h4 className="font-medium text-amber-700 mb-1 text-2xl">Quick Tip</h4>
                        <p className="text-xs text-amber-800">
                          Always taste and season your food at each cooking stage for best flavor.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
