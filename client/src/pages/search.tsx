import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";
import { IngredientInput } from "@/components/IngredientInput";
import { PreferencesPanel } from "@/components/PreferencesPanel";
import { type IngredientChip, type SearchFilters } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { Search as SearchIcon, Plus, Star, Bookmark, Clock } from "lucide-react";

interface Ingredient {
  name: string;
  score: number;
}

interface Recipe {
  id: string;
  title: string;
  description: string;
  image?: string;
  cookTime: number;
  difficulty: string;
  rating: number;
  reviewCount: number;
  ingredients: string[];
  tags: string[];
}

interface IngredientsResponse {
  suggestions: Ingredient[];
  popular: Ingredient[];
}

interface RecipesResponse {
  recipes: Recipe[];
  total: number;
}

export default function Search() {
  const [selectedIngredients, setSelectedIngredients] = React.useState<IngredientChip[]>([]);
  const [searchFilters, setSearchFilters] = React.useState<SearchFilters>();

  // Fetch recipes based on selected ingredients and filters
  const ingredientNames = selectedIngredients.map(ing => ing.name).join(',');
  const queryParams = new URLSearchParams();
  if (ingredientNames) queryParams.set('ingredients', ingredientNames);
  if (searchFilters?.diet && searchFilters.diet !== 'any') queryParams.set('diet', searchFilters.diet);
  if (searchFilters?.allergies && searchFilters.allergies.length > 0) queryParams.set('allergies', searchFilters.allergies.join(','));
  if (searchFilters?.maxCookTime && searchFilters.maxCookTime !== 60) queryParams.set('maxCookTime', searchFilters.maxCookTime.toString());
  if (searchFilters?.cuisine) queryParams.set('cuisine', searchFilters.cuisine);
  if (searchFilters?.difficulty && searchFilters.difficulty !== 'any') queryParams.set('difficulty', searchFilters.difficulty);
  if (searchFilters?.allowSubstitutions === false) queryParams.set('allowSubstitutions', 'false');
  if (searchFilters?.servings && searchFilters.servings !== 4) queryParams.set('servings', searchFilters.servings.toString());

  const { data: recipesData, isLoading: recipesLoading } = useQuery<RecipesResponse>({
    queryKey: ['/api/recipes', queryParams.toString()],
    enabled: selectedIngredients.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const recipes = recipesData?.recipes || [];

  const handleIngredientsChange = (newIngredients: IngredientChip[]) => {
    setSelectedIngredients(newIngredients);
  };

  const handleFiltersChange = (filters: SearchFilters) => {
    setSearchFilters(filters);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Find Recipes</h1>
          <p className="text-muted-foreground">
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

        {/* Recipe Results */}
        {selectedIngredients.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">
                Recipes for your ingredients
              </h2>
              {recipesData && (
                <span className="text-muted-foreground">
                  {recipesData.total} recipes found
                </span>
              )}
            </div>

            {recipesLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <Skeleton className="h-48 w-full" />
                    <CardContent className="p-4 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-full" />
                      <Skeleton className="h-3 w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : recipes.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recipes.map((recipe) => (
                  <Card key={recipe.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    {recipe.image && (
                      <img 
                        src={recipe.image}
                        alt={recipe.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex gap-1">
                          {recipe.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center text-muted-foreground text-sm">
                          <Clock className="mr-1 h-3 w-3" />
                          {recipe.cookTime}m
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{recipe.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {recipe.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-accent fill-current" />
                          <span className="text-sm font-medium">{recipe.rating}</span>
                          <span className="text-muted-foreground text-sm">
                            ({recipe.reviewCount})
                          </span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          data-testid={`bookmark-recipe-${recipe.id}`}
                        >
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-muted-foreground mb-4">
                    <SearchIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No recipes found</h3>
                    <p>Try adding different ingredients or removing some filters.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Empty State */}
        {selectedIngredients.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-muted-foreground">
                <SearchIcon className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Start by adding ingredients</h3>
                <p>Search for ingredients you have and we'll find recipes you can make!</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
