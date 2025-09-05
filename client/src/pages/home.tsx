import * as React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";
import ThemeAwarePixelBlast from "@/components/ThemeAwarePixelBlast";
import { type IngredientChip } from "@shared/schema";
import { Search, ChefHat, Recycle, Heart, Plus, Star, Bookmark, ArrowRight, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [ingredients, setIngredients] = React.useState<IngredientChip[]>([
    { id: "1", name: "Tomato" },
    { id: "2", name: "Basil" },
    { id: "3", name: "Mozzarella" }
  ]);
  const [hoveredRecipe, setHoveredRecipe] = React.useState<number | null>(null);
  const { toast } = useToast();

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
          <ThemeAwarePixelBlast
            variant="circle"
            pixelSize={6}
            patternScale={3}
            patternDensity={1.2}
            pixelSizeJitter={0.5}
            enableRipples
            rippleSpeed={0.4}
            rippleThickness={0.12}
            rippleIntensityScale={1.5}
            liquid
            liquidStrength={0.12}
            liquidRadius={1.2}
            liquidWobbleSpeed={5}
            speed={0.6}
            edgeFade={0.25}
            transparent
            className=""
            style={{}}
          />
        </div>
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="vintage-hero w-full mx-auto text-center bg-vintage-light-beige/10 backdrop-blur-sm rounded-3xl p-16 shadow-2xl border border-vintage-warm-brown/10 hover:shadow-3xl transition-all duration-500">
            <h1 className="display-text text-vintage-light-beige mb-8 drop-shadow-2xl font-extrabold">
              Cook with what you have
            </h1>
            <p className="lead text-vintage-light-beige/98 mb-10 max-w-3xl mx-auto text-center drop-shadow-lg text-xl font-medium">
              Turn the ingredients you already have into amazing meals. Discover personalized recipes that help you save time, reduce food waste, and enjoy delicious possibilities every day.
            </p>

            <div className="flex flex-col sm:flex-row gap-8 justify-center mb-16">
              <Link 
                href="/search" 
                className="animated-button text-xl px-8 py-4"
                data-testid="start-cooking-button"
              >
                  Start Cooking
                <ArrowRight className="button-icon ml-2" style={{ color: 'var(--vintage-warm-brown)' }} />
                </Link>
                              <button 
                  onClick={() => {
                    const element = document.getElementById('how-it-works');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="animated-button-secondary text-xl px-8 py-4"
                data-testid="learn-more-button"
              >
                  <ArrowRight className="button-icon mr-2" style={{ color: 'var(--vintage-warm-brown)' }} />
                Learn More
                </button>
            </div>

            {/* Simple Stats Section */}
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                <div className="text-center">
                  <div className="text-5xl font-bold text-vintage-warm-brown mb-2">2,847</div>
                  <div className="text-vintage-light-beige/90 text-lg">Recipes Available</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-vintage-warm-brown mb-2">156</div>
                  <div className="text-vintage-light-beige/90 text-lg">Ingredients Supported</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-vintage-warm-brown mb-2">98%</div>
                  <div className="text-vintage-light-beige/90 text-lg">User Satisfaction</div>
                </div>
              </div>

              {/* Simple Call to Action */}
              <div className="text-center">
                <Link 
                  href="/search" 
                  className="animated-button explore-button font-extrabold"
                  style={{ maxWidth: '300px' }}
                >
                  Explore All Recipes 
                  <ArrowRight className="button-icon ml-2" style={{ color: 'var(--vintage-warm-brown)' }} />
                  </Link>
              </div>
            </div>
          </div>
        </div>

      </section>


      {/* Features Section */}
      <section className="section-padding bg-muted/30 relative">
        <div className="absolute inset-0 z-0">
          <ThemeAwarePixelBlast
            variant="circle"
            pixelSize={5}
            patternScale={2.5}
            patternDensity={0.8}
            pixelSizeJitter={0.4}
            enableRipples
            rippleSpeed={0.35}
            rippleThickness={0.15}
            rippleIntensityScale={1.0}
            liquid
            liquidStrength={0.06}
            liquidRadius={0.8}
            liquidWobbleSpeed={3.5}
            speed={0.35}
            edgeFade={0.4}
            transparent
            className=""
            style={{}}
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
      <section className="section-padding relative">
        <div className="absolute inset-0 z-0">
          <ThemeAwarePixelBlast
            variant="circle"
            pixelSize={4}
            patternScale={2}
            patternDensity={1.0}
            pixelSizeJitter={0.3}
            enableRipples
            rippleSpeed={0.3}
            rippleThickness={0.1}
            rippleIntensityScale={1.2}
            liquid
            liquidStrength={0.08}
            liquidRadius={1.0}
            liquidWobbleSpeed={4}
            speed={0.4}
            edgeFade={0.3}
            transparent
            className=""
            style={{}}
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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

      {/* How It Works Section */}
      <section className="section-padding relative" id="how-it-works">
        <div className="absolute inset-0 z-0">
          <ThemeAwarePixelBlast
            variant="circle"
            pixelSize={5}
            patternScale={2}
            patternDensity={1}
            pixelSizeJitter={0.3}
            enableRipples
            rippleSpeed={0.3}
            rippleThickness={0.1}
            rippleIntensityScale={1.2}
            liquid
            liquidStrength={0.08}
            liquidRadius={1}
            liquidWobbleSpeed={4}
            speed={0.4}
            edgeFade={0.3}
            transparent
            className=""
            style={{}}
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="vintage-hero w-full mx-auto text-center bg-vintage-light-beige/10 backdrop-blur-sm rounded-3xl p-16 shadow-2xl border border-vintage-warm-brown/10 hover:shadow-3xl transition-all duration-500">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-vintage-light-beige mb-4">
                How It Works
              </h2>
              <p className="text-vintage-light-beige/80 text-lg max-w-2xl mx-auto">
                Get started with Ingredo in just three simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <div className="group bg-vintage-dark-green/20 backdrop-blur-sm rounded-2xl p-6 border border-vintage-warm-brown/20 hover:bg-vintage-dark-green/30 transition-all duration-300">
              <div className="step-number w-20 h-20 bg-vintage-warm-brown rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" style={{ color: 'var(--vintage-dark-green)' }}>
                1
              </div>
              <h3 className="text-xl font-semibold text-vintage-light-beige mb-3 text-center">
                Add Your Ingredients
              </h3>
              <p className="text-vintage-light-beige/80 leading-relaxed text-left">
                Simply type or select the ingredients you have in your kitchen. Our smart system will recognize them instantly.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group bg-vintage-dark-green/20 backdrop-blur-sm rounded-2xl p-6 border border-vintage-warm-brown/20 hover:bg-vintage-dark-green/30 transition-all duration-300">
              <div className="step-number w-20 h-20 bg-vintage-warm-brown rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" style={{ color: 'var(--vintage-dark-green)' }}>
                2
              </div>
              <h3 className="text-xl font-semibold text-vintage-light-beige mb-3 text-center">
                Discover Recipes
              </h3>
              <p className="text-vintage-light-beige/80 leading-relaxed text-left">
                Browse through perfectly matched recipes or explore creative suggestions based on your available ingredients.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group bg-vintage-dark-green/20 backdrop-blur-sm rounded-2xl p-6 border border-vintage-warm-brown/20 hover:bg-vintage-dark-green/30 transition-all duration-300">
              <div className="step-number w-20 h-20 bg-vintage-warm-brown rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" style={{ color: 'var(--vintage-dark-green)' }}>
                3
              </div>
              <h3 className="text-xl font-semibold text-vintage-light-beige mb-3 text-center">
                Start Cooking
              </h3>
              <p className="text-vintage-light-beige/80 leading-relaxed text-left">
                Follow step-by-step instructions and create delicious meals while reducing food waste in your kitchen.
              </p>
            </div>
          </div>

            {/* CTA Button */}
            <div className="text-center mt-12">
              <Link 
                href="/search" 
                className="animated-button explore-button font-extrabold"
                style={{ maxWidth: '300px' }}
              >
                Get Started Now
                <ArrowRight className="button-icon ml-2" style={{ color: 'var(--vintage-warm-brown)' }} />
                </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
