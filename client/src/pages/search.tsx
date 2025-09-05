import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { Card, CardContent } from "@/components/ui/card";
import { IngredientInput } from "@/components/IngredientInput";
import { PreferencesPanel } from "@/components/PreferencesPanel";
import { SearchResults } from "@/components/SearchResults";
import { type IngredientChip, type SearchFilters } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Search as SearchIcon } from "lucide-react";
import Iridescence from "@/components/Iridescence";

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
      {/* Unified Iridescence Background */}
      <div className="fixed inset-0 z-0">
        <Iridescence
          color={[0.12, 0.25, 0.69]} // vibrant blue in RGB (0-1 range)
          mouseReact={true}
          amplitude={0.15}
          speed={0.8}
        />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="h1 text-gray-800 mb-4">Find Recipes</h1>
          <p className="lead vintage-text-muted text-center">
            Add ingredients you have and discover delicious recipes you can make
          </p>
        </div>

        {/* Ingredient Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <IngredientInput
              initialIngredients={selectedIngredients}
              onChange={handleIngredientsChange}
              placeholder="Type ingredients you have..."
              maxItems={15}
            />
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="mb-8">
          <PreferencesPanel onFiltersChange={handleFiltersChange} />
        </div>

        {/* Search Results */}
        <SearchResults
          ingredients={selectedIngredients.map(ing => ing.name)}
          filters={searchFilters}
          onRecipeSave={handleRecipeSave}
          onUseSuggestion={handleUseSuggestion}
        />
              </div>
      </div>
    </div>
  );
}
