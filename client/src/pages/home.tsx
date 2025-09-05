import * as React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";
import { IngredientInput } from "@/components/IngredientInput";
import FaultyTerminal from "@/components/FaultyTerminal";
import { type IngredientChip } from "@shared/schema";
import { Search, ChefHat, Recycle, Heart, Plus, Star, Bookmark, ArrowRight, Play, Clock, Users } from "lucide-react";

export default function Home() {
  const [ingredients, setIngredients] = React.useState<IngredientChip[]>([
    { id: "1", name: "Tomato" },
    { id: "2", name: "Basil" },
    { id: "3", name: "Mozzarella" }
  ]);
  const [hoveredRecipe, setHoveredRecipe] = React.useState<number | null>(null);

  const handleIngredientsChange = (newIngredients: IngredientChip[]) => {
    setIngredients(newIngredients);
  };

  const handleRecipeHover = (recipeId: number) => {
    setHoveredRecipe(recipeId);
  };

  const handleRecipeLeave = () => {
    setHoveredRecipe(null);
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
      <section className="relative w-full h-screen flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <FaultyTerminal
            scale={1.0}
            gridMul={[1.5, 1]}
            digitSize={0.8}
            timeScale={0.3}
            pause={false}
            scanlineIntensity={0.2}
            glitchAmount={0.4}
            flickerAmount={0.3}
            noiseAmp={0.1}
            chromaticAberration={0}
            dither={0}
            curvature={0.05}
            tint="#2d5016"
            mouseReact={true}
            mouseStrength={0.2}
            pageLoadAnimation={false}
            brightness={0.8}
            className="opacity-70"
            style={{}}
          />
        </div>
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="vintage-hero w-full mx-auto text-center bg-vintage-light-beige/10 backdrop-blur-sm rounded-3xl p-16 shadow-2xl border border-vintage-warm-brown/10 hover:shadow-3xl transition-all duration-500">
            <h1 className="display-text text-vintage-light-beige mb-8 drop-shadow-2xl font-extrabold">
              Cook with what you have
            </h1>
            <p className="lead text-vintage-light-beige/98 mb-10 max-w-3xl mx-auto text-center drop-shadow-lg text-xl font-medium">
              Discover amazing recipes based on ingredients you already have at home. 
              No more food waste, just delicious possibilities.
            </p>

            <div className="flex flex-col sm:flex-row gap-8 justify-center mb-16">
              <Button 
                size="lg"
                className="vintage-cta px-12 py-6 text-xl font-extrabold rounded-3xl transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-3xl group"
                data-testid="start-cooking-button"
                asChild
              >
                <Link href="/search" className="flex items-center">
                  Start Cooking <ArrowRight className="ml-3 h-7 w-7 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="px-12 py-6 text-xl font-extrabold border-3 border-vintage-light-beige text-vintage-light-beige hover:bg-vintage-light-beige hover:text-vintage-dark-green rounded-3xl transform hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-3xl group backdrop-blur-sm"
                data-testid="learn-more-button"
                asChild
              >
                <Link href="#features" className="flex items-center">
                  Learn More <Play className="ml-3 h-7 w-7 group-hover:scale-110 transition-transform duration-300" />
                </Link>
              </Button>
            </div>

            {/* Quick Ingredient Entry */}
            <Card className="vintage-section bg-vintage-light-beige/25 backdrop-blur-lg shadow-2xl rounded-3xl border-2 border-vintage-warm-brown/30 hover:shadow-3xl transition-all duration-500">
              <CardContent className="p-10">
                <h3 className="h3 vintage-text-primary mb-8 text-center font-extrabold text-2xl" style={{ fontFamily: 'var(--font-display)' }}>What ingredients do you have?</h3>
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
                  className="vintage-button-secondary px-10 py-4 text-xl font-extrabold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
                  data-testid="find-recipes-button"
                  asChild
                >
                  <Link href="/search" className="flex items-center">
                    Find Recipes <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="h2 text-vintage-light-beige mb-12">Why Ingredo?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <ChefHat className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="h5 vintage-text-primary mb-2">Smart Recipe Matching</h3>
                  <p className="text-muted-foreground">Our AI finds recipes that maximize your available ingredients and minimize shopping needs.</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                    <Recycle className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="h5 vintage-text-primary mb-2">Reduce Food Waste</h3>
                  <p className="text-muted-foreground">Use what you have before it spoils. Track expiration dates and get timely recipe suggestions.</p>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-secondary/60 rounded-lg flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-secondary-foreground" />
                  </div>
                  <h3 className="h5 vintage-text-primary mb-2">Save Favorites</h3>
                  <p className="text-muted-foreground">Build your personal cookbook with recipes you love and organize them into collections.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Recipes */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="h2 text-vintage-light-beige mb-12">Popular Recipes</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleRecipes.map((recipe) => (
                <Card 
                  key={recipe.id} 
                  className="overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onMouseEnter={() => handleRecipeHover(recipe.id)}
                  onMouseLeave={handleRecipeLeave}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={recipe.image}
                      alt={recipe.title}
                      className={`w-full h-48 object-cover transition-transform duration-300 ${
                        hoveredRecipe === recipe.id ? 'scale-105' : ''
                      }`}
                    />
                    <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${
                      hoveredRecipe === recipe.id ? 'opacity-100' : 'opacity-0'
                    }`} />
                    <div className={`absolute top-4 right-4 transition-opacity duration-300 ${
                      hoveredRecipe === recipe.id ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <Button 
                        size="sm" 
                        variant="secondary" 
                        className="h-8 w-8 p-0 rounded-full"
                        data-testid={`quick-bookmark-${recipe.id}`}
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex gap-1">
                        {recipe.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex items-center text-muted-foreground text-sm">
                        <Clock className="mr-1 h-3 w-3" />
                        {recipe.time}
                      </div>
                    </div>
                    <h4 className="recipe-title mb-2 group-hover:text-vintage-warm-brown transition-colors">
                      {recipe.title}
                    </h4>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                      {recipe.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-accent fill-current" />
                        <span className="text-sm font-medium">{recipe.rating}</span>
                        <span className="text-muted-foreground text-sm">({recipe.reviews})</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        data-testid={`view-recipe-${recipe.id}`}
                      >
                        View Recipe
                        <ArrowRight className="ml-1 h-3 w-3" />
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
