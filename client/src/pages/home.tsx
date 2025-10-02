import * as React from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CountUp from "@/components/CountUp";
import SplitText from "@/components/SplitText";
import { type IngredientChip } from "@shared/schema";
import { Search, ChefHat, Recycle, Heart, Plus, Star, Bookmark, ArrowRight, Clock, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FadeUp, FadeDown, ModernFadeUp, ModernFadeDown } from "@/components/ScrollReveal";

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
      image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?ixlib=rb-4.0.3&w=600&h=400&fit=crop",
      time: "45 min",
      rating: 4.9,
      reviews: 203,
      tags: ["Comfort", "Italian"]
    }
  ];

  return (
    <div className="relative min-h-screen">
      {/* Background Image for entire page */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/discover.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      {/* Blue Overlay for entire page */}
      <div 
        className="fixed inset-0 z-0" 
        style={{ backgroundColor: 'rgba(30, 64, 175, 0.4)' }}
      />

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex items-center justify-center z-10 py-4 sm:py-8 lg:py-16">
        
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="w-full mx-auto text-center px-2 sm:px-8 lg:px-16 py-4 sm:py-8 lg:py-16">
            <SplitText
              text="Cook with what you have"
              tag="h1"
              className="hero-heading text-white mb-4 sm:mb-2 max-w-4xl mx-auto px-2 py-2"
              delay={100}
              duration={0.8}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 60, rotationX: -90 }}
              to={{ opacity: 1, y: 0, rotationX: 0 }}
              threshold={0.1}
              rootMargin="-50px"
              textAlign="center"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            >
              <p className="lead text-white mb-6 sm:mb-8 lg:mb-10 max-w-4xl mx-auto text-center drop-shadow-lg text-base sm:text-lg lg:text-xl font-medium leading-relaxed px-2">
                Turn the ingredients you already have into amazing meals. Discover personalized recipes that help you save time, reduce food waste, and enjoy delicious possibilities every day.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8, ease: "easeOut" }}
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center mb-8 sm:mb-12 lg:mb-16 px-4">
                <Link 
                  href="/search" 
                  className="animated-button responsive-button"
                  data-testid="start-cooking-button"
                >
                    Start Cooking
                  <ArrowRight className="button-icon ml-2" style={{ color: 'var(--vintage-dark-green)' }} />
                  </Link>
                <button 
                    onClick={() => {
                      const element = document.getElementById('how-it-works');
                      if (element) {
                        element.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="animated-button responsive-button"
                  data-testid="learn-more-button"
                >
                    <ArrowRight className="button-icon mr-2" style={{ color: 'var(--vintage-dark-green)' }} />
                  Learn More
                  </button>
              </div>
            </motion.div>

            {/* Simple Stats Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
            >
              <div className="max-w-4xl mx-auto px-4">
                <div className="grid grid-cols-3 gap-2 sm:gap-6 lg:gap-8 mb-8 sm:mb-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0, duration: 0.8, ease: "easeOut" }}
                    className="text-center"
                  >
                    <div className="text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-1 sm:mb-2">
                      <CountUp 
                        to={2847} 
                        duration={4.0} 
                        separator="," 
                        className="count-up-text"
                      />
                    </div>
                    <div className="text-white/90 text-xs sm:text-sm lg:text-base xl:text-lg">Recipes Available</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
                    className="text-center"
                  >
                    <div className="text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-1 sm:mb-2">
                      <CountUp 
                        to={156} 
                        duration={4.0} 
                        className="count-up-text"
                        />
                      </div>
                      <div className="text-white/90 text-xs sm:text-sm lg:text-base xl:text-lg">Ingredients Supported</div>
                    </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, duration: 0.8, ease: "easeOut" }}
                    className="text-center"
                  >
                    <div className="text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-1 sm:mb-2">
                      <CountUp 
                        to={98} 
                        duration={4.0} 
                        className="count-up-text"
                      />%
                    </div>
                    <div className="text-white/90 text-xs sm:text-sm lg:text-base xl:text-lg">User Satisfaction</div>
                  </motion.div>
                </div>

                {/* Simple Call to Action */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.6, duration: 0.8, ease: "easeOut" }}
                  className="text-center px-4"
                >
                <Link 
                  href="/search" 
                  className="animated-button-secondary explore-button responsive-button font-extrabold inline-block"
                  style={{ maxWidth: '300px' }}
                >
                      Explore All Recipes 
                      <ArrowRight className="button-icon ml-2" style={{ color: 'var(--vintage-warm-brown)' }} />
                      </Link>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="why-ingredo" className="section-padding relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <FadeUp allowedSections={['why-ingredo', 'popular-recipes', 'how-it-works']}>
              <h2 className="h2 text-white mb-12">Why Ingredo?</h2>
            </FadeUp>
            <div className="grid md:grid-cols-3 gap-8">
              <FadeUp allowedSections={['why-ingredo', 'popular-recipes', 'how-it-works']} delay={200}>
                <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white hover:bg-white transition-all duration-300">
                  <div className="w-12 h-12 bg-vintage-warm-brown/20 rounded-lg flex items-center justify-center mb-4">
                    <ChefHat className="h-6 w-6" style={{ color: '#FF6B35' }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Smart Recipe Matching</h3>
                  <p className="text-gray-800/90">Our AI finds recipes that maximize your available ingredients and minimize shopping needs.</p>
                </div>
              </FadeUp>

              <FadeUp allowedSections={['why-ingredo', 'popular-recipes', 'how-it-works']} delay={400}>
                <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white hover:bg-white transition-all duration-300">
                  <div className="w-12 h-12 bg-vintage-warm-brown/20 rounded-lg flex items-center justify-center mb-4">
                    <Recycle className="h-6 w-6" style={{ color: '#4CAF50' }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Reduce Food Waste</h3>
                  <p className="text-gray-800/90">Use what you have before it spoils. Track expiration dates and get timely recipe suggestions.</p>
                </div>
              </FadeUp>

              <FadeUp allowedSections={['why-ingredo', 'popular-recipes', 'how-it-works']} delay={600}>
                <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white hover:bg-white transition-all duration-300">
                  <div className="w-12 h-12 bg-vintage-warm-brown/20 rounded-lg flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6" style={{ color: '#E91E63' }} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Save Favorites</h3>
                  <p className="text-gray-800/90">Build your personal digital cookbook with recipes you love and neatly organize them into collections.</p>
                </div>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Recipes */}
      <section id="popular-recipes" className="section-padding relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <FadeUp allowedSections={['why-ingredo', 'popular-recipes', 'how-it-works']}>
              <h2 className="h2 text-white mb-12">Popular Recipes</h2>
            </FadeUp>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sampleRecipes.map((recipe, index) => (
                <FadeUp 
                  key={recipe.id}
                  allowedSections={['why-ingredo', 'popular-recipes', 'how-it-works']} 
                  delay={400 + (index * 200)}
                >
                  <Card 
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
                      loading="lazy"
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
                </FadeUp>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="section-padding relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="how-it-works-container w-full mx-auto text-center">
            <FadeUp allowedSections={['why-ingredo', 'popular-recipes', 'how-it-works']}>
              <div className="text-center mb-8 sm:mb-12 lg:mb-16">
                <h2 className="how-it-works-heading">
                  How It Works
                </h2>
                <p className="how-it-works-description">
                  Get started with Ingredo in just three simple steps
                </p>
              </div>
            </FadeUp>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Step 1 */}
            <FadeUp allowedSections={['why-ingredo', 'popular-recipes', 'how-it-works']} delay={400}>
              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white hover:bg-white transition-all duration-300">
                <div className="step-number w-20 h-20 bg-vintage-warm-brown rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" style={{ color: 'var(--vintage-dark-green)' }}>
                  1
                </div>
                <h3 className="step-card-title">
                  Add Your Ingredients
                </h3>
                <p className="step-card-description">
                  Simply type or select the ingredients you have in your kitchen. Our smart system will recognize them instantly.
                </p>
              </div>
            </FadeUp>

            {/* Step 2 */}
            <FadeUp allowedSections={['why-ingredo', 'popular-recipes', 'how-it-works']} delay={600}>
              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white hover:bg-white transition-all duration-300">
                <div className="step-number w-20 h-20 bg-vintage-warm-brown rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" style={{ color: 'var(--vintage-dark-green)' }}>
                  2
                </div>
                <h3 className="step-card-title">
                  Discover Recipes
                </h3>
                <p className="step-card-description">
                  Browse through perfectly matched recipes or explore creative suggestions based on your available ingredients.
                </p>
              </div>
            </FadeUp>

            {/* Step 3 */}
            <FadeUp allowedSections={['why-ingredo', 'popular-recipes', 'how-it-works']} delay={800}>
              <div className="group bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-white hover:bg-white transition-all duration-300">
                <div className="step-number w-20 h-20 bg-vintage-warm-brown rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4" style={{ color: 'var(--vintage-dark-green)' }}>
                  3
                </div>
                <h3 className="step-card-title">
                  Start Cooking
                </h3>
                <p className="step-card-description">
                  Follow step-by-step instructions and create delicious meals while reducing food waste in your kitchen.
                </p>
              </div>
            </FadeUp>
          </div>

            {/* CTA Button */}
            <FadeUp allowedSections={['why-ingredo', 'popular-recipes', 'how-it-works']} delay={1000}>
              <div className="text-center mt-8 sm:mt-10 lg:mt-12">
                <Link 
                  href="/search" 
                  className="animated-button explore-button responsive-button font-extrabold"
                  style={{ maxWidth: '300px' }}
                >
                  Get Started Now
                  <ArrowRight className="button-icon ml-2" style={{ color: 'var(--vintage-warm-brown)' }} />
                  </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

    </div>
  );
}
