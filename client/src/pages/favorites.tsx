import * as React from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { 
  Heart, 
  Search, 
  Filter, 
  Clock, 
  Star,
  Users,
  ChefHat,
  Trash2,
  SortAsc,
  SortDesc,
  Grid,
  List,
  BookOpen,
  Share2,
  Plus
} from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  description: string;
  image?: string;
  cookTime: number;
  prepTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  rating: number;
  reviewCount: number;
  tags: string[];
  author: {
    name: string;
    avatar?: string;
  };
  addedDate: string;
}

export default function Favorites() {
  const { favoriteRecipes, removeFromFavorites } = useAppStore();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDifficulty, setSelectedDifficulty] = React.useState("all");
  const [selectedTag, setSelectedTag] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("added");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  // Mock favorite recipes data - in real app, this would come from API
  const [favoriteRecipesData] = React.useState<Recipe[]>([
    {
      id: "1",
      title: "Fresh Caprese Salad",
      description: "A classic Italian salad with fresh tomatoes, mozzarella, and basil.",
      image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?ixlib=rb-4.0.3&w=600&h=400&fit=crop",
      cookTime: 0,
      prepTime: 15,
      servings: 4,
      difficulty: "Easy",
      rating: 4.8,
      reviewCount: 124,
      tags: ["Quick", "Fresh", "Vegetarian"],
      author: { name: "Chef Maria" },
      addedDate: "2024-01-15"
    },
    {
      id: "2",
      title: "Garden Vegetable Stir Fry",
      description: "Quick and nutritious stir fry with seasonal vegetables and aromatic spices.",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&w=600&h=400&fit=crop",
      cookTime: 15,
      prepTime: 10,
      servings: 4,
      difficulty: "Easy",
      rating: 4.6,
      reviewCount: 89,
      tags: ["Healthy", "Vegetarian", "Quick"],
      author: { name: "Chef Alex" },
      addedDate: "2024-01-14"
    },
    {
      id: "3",
      title: "Classic Pasta Marinara",
      description: "Authentic Italian pasta with homemade marinara sauce and fresh herbs.",
      image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&w=600&h=400&fit=crop",
      cookTime: 30,
      prepTime: 15,
      servings: 6,
      difficulty: "Medium",
      rating: 4.9,
      reviewCount: 203,
      tags: ["Comfort", "Italian", "Pasta"],
      author: { name: "Chef Giovanni" },
      addedDate: "2024-01-13"
    },
    {
      id: "4",
      title: "Chocolate Lava Cake",
      description: "Decadent chocolate cake with a molten center, perfect for special occasions.",
      image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?ixlib=rb-4.0.3&w=600&h=400&fit=crop",
      cookTime: 12,
      prepTime: 20,
      servings: 4,
      difficulty: "Hard",
      rating: 4.7,
      reviewCount: 156,
      tags: ["Dessert", "Chocolate", "Special"],
      author: { name: "Chef Sophie" },
      addedDate: "2024-01-12"
    }
  ]);

  const difficulties = ["Easy", "Medium", "Hard"];
  const allTags = ["Quick", "Fresh", "Vegetarian", "Healthy", "Comfort", "Italian", "Pasta", "Dessert", "Chocolate", "Special"];

  // Filter and sort recipes
  const filteredRecipes = React.useMemo(() => {
    let filtered = favoriteRecipesData.filter(recipe => {
      const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDifficulty = selectedDifficulty === "all" || recipe.difficulty === selectedDifficulty;
      const matchesTag = selectedTag === "all" || recipe.tags.includes(selectedTag);
      return matchesSearch && matchesDifficulty && matchesTag;
    });

    // Sort recipes
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "title":
          comparison = a.title.localeCompare(b.title);
          break;
        case "rating":
          comparison = a.rating - b.rating;
          break;
        case "cookTime":
          comparison = (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime);
          break;
        case "added":
          comparison = new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime();
          break;
        case "difficulty":
          const difficultyOrder = { "Easy": 1, "Medium": 2, "Hard": 3 };
          comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
          break;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [favoriteRecipesData, searchQuery, selectedDifficulty, selectedTag, sortBy, sortOrder]);

  const handleRemoveFavorite = (recipeId: string, recipeTitle: string) => {
    removeFromFavorites(recipeId);
    toast({
      title: "Removed from favorites",
      description: `${recipeTitle} has been removed from your favorites.`,
    });
  };

  const handleAddToCollection = (recipeId: string, recipeTitle: string) => {
    toast({
      title: "Feature coming soon",
      description: "Collection management will be available soon.",
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/bg.webp)',
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  My Favorites 
                </h1>
                <p className="text-gray-600">
                  Your saved recipes and culinary inspirations
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="px-3 py-1">
                  <Heart className="h-4 w-4 mr-1" />
                  {favoriteRecipesData.length} recipes
                </Badge>
                
                <Link href="/search">
                  <Button className="bg-red-600 hover:bg-red-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Find More Recipes
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Favorites</p>
                    <p className="text-3xl font-bold text-gray-900">{favoriteRecipesData.length}</p>
                  </div>
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Easy Recipes</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {favoriteRecipesData.filter(r => r.difficulty === "Easy").length}
                    </p>
                  </div>
                  <ChefHat className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Quick Recipes</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {favoriteRecipesData.filter(r => r.tags.includes("Quick")).length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {(favoriteRecipesData.reduce((sum, r) => sum + r.rating, 0) / favoriteRecipesData.length).toFixed(1)}
                    </p>
                  </div>
                  <Star className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search your favorite recipes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="w-full md:w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      {difficulties.map(difficulty => (
                        <SelectItem key={difficulty} value={difficulty}>{difficulty}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={selectedTag} onValueChange={setSelectedTag}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Tag" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Tags</SelectItem>
                      {allTags.map(tag => (
                        <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="added">Date Added</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                      <SelectItem value="rating">Rating</SelectItem>
                      <SelectItem value="cookTime">Cook Time</SelectItem>
                      <SelectItem value="difficulty">Difficulty</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="w-full md:w-auto"
                  >
                    {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Favorite Recipes */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {filteredRecipes.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No favorites found</h3>
                  <p className="text-gray-600 mb-6">
                    {favoriteRecipesData.length === 0 
                      ? "Start building your favorites by saving recipes you love!"
                      : "Try adjusting your search or filter criteria."
                    }
                  </p>
                  {favoriteRecipesData.length === 0 && (
                    <Link href="/search">
                      <Button className="bg-red-600 hover:bg-red-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Find Recipes to Save
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
              }>
                <AnimatePresence>
                  {filteredRecipes.map((recipe, index) => (
                    <motion.div
                      key={recipe.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
                        {recipe.image && (
                          <div className="relative overflow-hidden">
                            <img 
                              src={recipe.image}
                              alt={recipe.title}
                              className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute top-4 right-4 flex gap-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleRemoveFavorite(recipe.id, recipe.title)}
                                className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white"
                              >
                                <Heart className="h-4 w-4 text-red-500 fill-current" />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => handleAddToCollection(recipe.id, recipe.title)}
                                className="h-8 w-8 p-0 rounded-full bg-white/90 hover:bg-white"
                              >
                                <BookOpen className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                        
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex gap-1">
                              {recipe.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <Badge className={`text-xs ${getDifficultyColor(recipe.difficulty)}`}>
                              {recipe.difficulty}
                            </Badge>
                          </div>
                          
                          <h3 className="font-semibold text-lg mb-2 group-hover:text-red-600 transition-colors">
                            {recipe.title}
                          </h3>
                          
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                            {recipe.description}
                          </p>
                          
                          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {recipe.prepTime + recipe.cookTime}m
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {recipe.servings}
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              {recipe.rating}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            <Link href={`/recipe/${recipe.id}`} className="flex-1">
                              <Button className="w-full" size="sm">
                                View Recipe
                              </Button>
                            </Link>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveFavorite(recipe.id, recipe.title)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
