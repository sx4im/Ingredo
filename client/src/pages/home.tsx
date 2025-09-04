import * as React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";
import { IngredientInput } from "@/components/IngredientInput";
import { type IngredientChip } from "@shared/schema";
import { Search, ChefHat, Recycle, Heart, Plus, Star, Bookmark, ArrowRight, Play } from "lucide-react";

export default function Home() {
  const [ingredients, setIngredients] = React.useState<IngredientChip[]>([
    { id: "1", name: "Tomato" },
    { id: "2", name: "Basil" },
    { id: "3", name: "Mozzarella" }
  ]);

  const handleIngredientsChange = (newIngredients: IngredientChip[]) => {
    setIngredients(newIngredients);
  };

  const sampleRecipes = [
    {
      id: 1,
      title: "Fresh Caprese Salad",
      description: "A classic Italian salad with fresh tomatoes, mozzarella, and basil.",
      image: "https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?ixlib=rb-4.0.3&w=600&h=400&fit=crop",
      time: "15 min",
      rating: 4.8,
      reviews: 124,
      tags: ["Quick", "Fresh"]
    },
    {
      id: 2,
      title: "Garden Vegetable Stir Fry",
      description: "Quick and nutritious stir fry with seasonal vegetables and aromatic spices.",
      image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?ixlib=rb-4.0.3&w=600&h=400&fit=crop",
      time: "25 min",
      rating: 4.6,
      reviews: 89,
      tags: ["Healthy", "Vegetarian"]
    },
    {
      id: 3,
      title: "Classic Pasta Marinara",
      description: "Authentic Italian pasta with homemade marinara sauce and fresh herbs.",
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?ixlib=rb-4.0.3&w=600&h=400&fit=crop",
      time: "45 min",
      rating: 4.9,
      reviews: 203,
      tags: ["Comfort", "Italian"]
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div 
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506368249639-73a05d6f6488?ixlib=rb-4.0.3&w=1920&h=1080&fit=crop')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6">
              Cook with what you have
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover amazing recipes based on ingredients you already have at home. 
              No more food waste, just delicious possibilities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg"
                className="px-8 py-3 transform hover:scale-105 transition-transform"
                data-testid="start-cooking-button"
                asChild
              >
                <Link href="/search">
                  Start Cooking
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-3"
                data-testid="learn-more-button"
              >
                Learn More
              </Button>
            </div>

            {/* Quick Ingredient Entry */}
            <Card className="bg-card/50 backdrop-blur-sm shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">What ingredients do you have?</h3>
                <div className="mb-4">
                  <IngredientInput
                    initialIngredients={ingredients}
                    onChange={handleIngredientsChange}
                    placeholder="Type ingredients or paste a list..."
                    maxItems={20}
                    onOpenImageModal={() => console.log("Open image modal")}
                  />
                </div>
                <Button 
                  variant="secondary"
                  className="px-6 py-2"
                  data-testid="find-recipes-button"
                  asChild
                >
                  <Link href="/search">
                    Find Recipes <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Why Ingredo?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <ChefHat className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Smart Recipe Matching</h3>
                  <p className="text-muted-foreground">Our AI finds recipes that maximize your available ingredients and minimize shopping needs.</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <Recycle className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Reduce Food Waste</h3>
                  <p className="text-muted-foreground">Use what you have before it spoils. Track expiration dates and get timely recipe suggestions.</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-secondary/60 rounded-lg flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Save Favorites</h3>
                  <p className="text-muted-foreground">Build your personal cookbook with recipes you love and organize them into collections.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Recipes */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Popular Recipes</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleRecipes.map((recipe) => (
                <Card key={recipe.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <img 
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-1">
                        {recipe.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <span className="text-muted-foreground text-sm">{recipe.time}</span>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">{recipe.title}</h4>
                    <p className="text-muted-foreground text-sm mb-3">{recipe.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-accent fill-current" />
                        <span className="text-sm font-medium">{recipe.rating}</span>
                        <span className="text-muted-foreground text-sm">({recipe.reviews})</span>
                      </div>
                      <Button variant="ghost" size="icon" data-testid={`bookmark-recipe-${recipe.id}`}>
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to start cooking?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of home cooks discovering new recipes with ingredients they already have.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="px-8 py-3 transform hover:scale-105 transition-transform"
                data-testid="get-started-button"
                asChild
              >
                <Link href="/search">
                  Get Started Free
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="lg"
                className="px-8 py-3"
                data-testid="watch-demo-button"
              >
                <Play className="mr-2 h-4 w-4" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
