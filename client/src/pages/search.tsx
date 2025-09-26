import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { Card, CardContent } from "@/components/ui/card";
import { IngredientInput } from "@/components/IngredientInput";
import { PreferencesPanel } from "@/components/PreferencesPanel";
import { SearchResults } from "@/components/SearchResults";
import { ScrollReveal, FadeUp, SlowFadeUp } from "@/components/ScrollReveal";
import { type IngredientChip, type SearchFilters } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Search as SearchIcon } from "lucide-react";

export default function Search() {
  const [selectedIngredients, setSelectedIngredients] = React.useState<IngredientChip[]>([]);
  const [searchFilters, setSearchFilters] = React.useState<SearchFilters>(() => {
    // Initialize with default filters
    return {
      diet: "any",
      allergies: [],
      maxCookTime: 60,
      cuisine: undefined,
      difficulty: "any",
      allowSubstitutions: true,
      servings: 4
    };
  });
  
  const { toast } = useToast();

  const handleIngredientsChange = (newIngredients: IngredientChip[]) => {
    setSelectedIngredients(newIngredients);
  };

  const handleFiltersChange = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  const handleRecipeSave = (recipeId: string) => {
    toast({
      title: "Recipe saved!",
      description: "Recipe has been added to your favorites.",
    });
  };

  const handleUseSuggestion = (recipeId: string) => {
    toast({
      title: "Great choice!",
      description: "Recipe has been added to your meal plan.",
    });
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/bg2.webp)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      {/* Blue Overlay */}
      <div
        className="fixed inset-0 z-0"
        style={{ backgroundColor: 'rgba(30, 64, 175, 0.4)' }}
      />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <SlowFadeUp>
          <div className="text-center mb-8">
            <h1 className="h1 text-white mb-4">Find Recipes</h1>
            <p className="text-white/90 text-center text-base font-medium">
              Add ingredients you have and discover delicious recipes you can make
            </p>
          </div>
        </SlowFadeUp>

        {/* Ingredient Search */}
        <ScrollReveal preset="fadeUp" >
          <Card className="mb-8">
            <CardContent className="p-6" >
              <IngredientInput
                initialIngredients={selectedIngredients}
                onChange={handleIngredientsChange}
                placeholder="Search ingredients..."
                maxItems={15}
              />
            </CardContent>
          </Card>
        </ScrollReveal>

        {/* Filters */}
        <ScrollReveal preset="fadeUp" >
          <div className="mb-8">
            <PreferencesPanel onFiltersChange={handleFiltersChange} />
          </div>
        </ScrollReveal>

        {/* Search Results */}
        <ScrollReveal preset="fadeUp" >
          <SearchResults
            ingredients={selectedIngredients.map(ing => ing.name)}
            filters={searchFilters}
            onRecipeSave={handleRecipeSave}
            onUseSuggestion={handleUseSuggestion}
          />
        </ScrollReveal>
              </div>
      </div>
    </div>
  );
}
