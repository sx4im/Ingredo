import * as React from "react";
import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { RecipeCard, type RecipeCardData } from "@/components/RecipeCard";
import { RecipeCardGridSkeleton } from "@/components/RecipeCard/RecipeCardSkeleton";
import { apiClient } from "@/lib/apiClient";
import { type SearchFilters } from "@shared/schema";
import { 
  Search, 
  Sparkles, 
  Clock, 
  Star, 
  TrendingUp,
  Filter,
  RefreshCw
} from "lucide-react";

interface SearchResultsProps {
  ingredients: string[];
  filters: SearchFilters;
  onRecipeSave?: (recipeId: string) => void;
  onUseSuggestion?: (recipeId: string) => void;
  className?: string;
}

type SortOption = "relevance" | "time" | "rating" | "popularity";
type SearchMode = "match" | "creative";

interface RecipeSearchResponse {
  recipes: RecipeCardData[];
  total: number;
  mode: SearchMode;
  generatedAt: string;
}

const SORT_OPTIONS = [
  { value: "relevance", label: "Best Match", icon: Search },
  { value: "time", label: "Quickest", icon: Clock },
  { value: "rating", label: "Highest Rated", icon: Star },
  { value: "popularity", label: "Most Popular", icon: TrendingUp },
] as const;

export function SearchResults({ 
  ingredients, 
  filters, 
  onRecipeSave, 
  onUseSuggestion,
  className 
}: SearchResultsProps) {
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [activeMode, setActiveMode] = useState<SearchMode>("match");
  const [isGeneratingCreative, setIsGeneratingCreative] = useState(false);

  // Build query parameters
  const queryParams = useMemo(() => {
    const params = new URLSearchParams();
    if (ingredients.length > 0) {
      params.set('ingredients', ingredients.join(','));
    }
    if (filters.diet && filters.diet !== 'any') {
      params.set('diet', filters.diet);
    }
    if (filters.allergies && filters.allergies.length > 0) {
      params.set('allergies', filters.allergies.join(','));
    }
    if (filters.maxCookTime && filters.maxCookTime !== 60) {
      params.set('maxCookTime', filters.maxCookTime.toString());
    }
    if (filters.cuisine) {
      params.set('cuisine', filters.cuisine);
    }
    if (filters.difficulty && filters.difficulty !== 'any') {
      params.set('difficulty', filters.difficulty);
    }
    if (filters.allowSubstitutions === false) {
      params.set('allowSubstitutions', 'false');
    }
    if (filters.servings && filters.servings !== 4) {
      params.set('servings', filters.servings.toString());
    }
    params.set('mode', activeMode);
    params.set('sort', sortBy);
    return params.toString();
  }, [ingredients, filters, activeMode, sortBy]);

  // Fetch matched recipes
  const { 
    data: matchedData, 
    isLoading: matchedLoading, 
    error: matchedError,
    refetch: refetchMatched
  } = useQuery<RecipeSearchResponse>({
    queryKey: ['/api/recipes', queryParams],
    enabled: ingredients.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  // Fetch creative recipes
  const { 
    data: creativeData, 
    isLoading: creativeLoading, 
    error: creativeError,
    refetch: refetchCreative
  } = useQuery<RecipeSearchResponse>({
    queryKey: ['/api/recipes', queryParams.replace('mode=match', 'mode=creative')],
    enabled: false, // Only fetch when explicitly requested
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleModeChange = async (value: string) => {
    const mode = value as SearchMode;
    setActiveMode(mode);
    if (mode === 'creative' && !creativeData) {
      setIsGeneratingCreative(true);
      try {
        await refetchCreative();
      } finally {
        setIsGeneratingCreative(false);
      }
    }
  };

  const handleGenerateCreative = async () => {
    setIsGeneratingCreative(true);
    try {
      await refetchCreative();
      setActiveMode('creative');
    } finally {
      setIsGeneratingCreative(false);
    }
  };

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
  };

  // Sort recipes based on selected option
  const sortedRecipes = useMemo(() => {
    const recipes = activeMode === 'creative' ? creativeData?.recipes || [] : matchedData?.recipes || [];
    
    switch (sortBy) {
      case 'time':
        return [...recipes].sort((a, b) => (a.prepTime + a.cookTime) - (b.prepTime + b.cookTime));
      case 'rating':
        return [...recipes].sort((a, b) => b.rating - a.rating);
      case 'popularity':
        return [...recipes].sort((a, b) => b.reviewCount - a.reviewCount);
      case 'relevance':
      default:
        return [...recipes].sort((a, b) => (b.matchPercentage || 0) - (a.matchPercentage || 0));
    }
  }, [activeMode, creativeData, matchedData, sortBy]);

  const currentData = activeMode === 'creative' ? creativeData : matchedData;
  const isLoading = activeMode === 'creative' ? creativeLoading : matchedLoading;
  const error = activeMode === 'creative' ? creativeError : matchedError;

  // Empty state suggestions
  const getEmptyStateSuggestions = () => {
    const suggestions = [
      "Try adding eggs or cheese",
      "Add some fresh vegetables",
      "Include protein like chicken or tofu",
      "Add herbs and spices",
      "Try adding pasta or rice"
    ];
    return suggestions[Math.floor(Math.random() * suggestions.length)];
  };

  if (ingredients.length === 0) {
    return (
      <EmptyState
        icon={<Search className="mx-auto h-12 w-12 mb-4 opacity-50" />}
        title="Start by adding ingredients"
        description="Search for ingredients you have and we'll find recipes you can make!"
        action={{
          label: "Add ingredients above",
          onClick: () => {}
        }}
        className={className}
      />
    );
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <div className="flex flex-col items-center justify-center">
            <Search className="h-12 w-12 mb-4 text-gray-800" />
            <h3 className="text-lg font-medium mb-2 text-gray-800">Search failed</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't find any recipes. Please try again.
            </p>
            <Button onClick={() => refetchMatched()}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h2 className="h2 vintage-text-primary">
            {activeMode === 'creative' ? 'Creative Recipes' : 'Matched Recipes'}
          </h2>
          {currentData && (
            <Badge variant="secondary" className="text-sm">
              {currentData.total} recipes found
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Sort dropdown */}
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SORT_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>

          {/* Mode toggle */}
          <Tabs value={activeMode} onValueChange={handleModeChange} className="w-auto">
            <TabsList>
              <TabsTrigger value="match" data-testid="mode-matched">
                <Search className="h-4 w-4 mr-1" />
                Matched
              </TabsTrigger>
              <TabsTrigger value="creative" data-testid="mode-creative">
                <Sparkles className="h-4 w-4 mr-1" />
                Creative
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <RecipeCardGridSkeleton count={6} />
      ) : sortedRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedRecipes.map((recipe, index) => (
            <RecipeCard
              key={`${recipe.id}-${activeMode}`}
              recipe={recipe}
              onSave={onRecipeSave}
              onUseSuggestion={onUseSuggestion}
              priority={index < 3} // Prioritize first 3 images
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Search className="mx-auto h-12 w-12 mb-4 opacity-50" />}
          title="No recipes found"
          description={`${getEmptyStateSuggestions()}. Try adjusting your filters or adding more ingredients.`}
          action={{
            label: activeMode === 'match' ? "Generate Creative Recipes" : "Clear Filters",
            onClick: activeMode === 'match' ? handleGenerateCreative : () => {}
          }}
        />
      )}

      {/* Creative generation loading */}
      {isGeneratingCreative && (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="flex items-center justify-center gap-3">
              <RefreshCw className="h-5 w-5 animate-spin text-primary" />
              <span className="text-lg font-medium">Generating creative recipes...</span>
            </div>
            <p className="text-muted-foreground mt-2">
              Our AI is creating unique recipe combinations for you!
            </p>
          </CardContent>
        </Card>
      )}

      {/* Load more button for creative mode */}
      {activeMode === 'creative' && creativeData && !isGeneratingCreative && (
        <div className="text-center">
          <Button
            variant="outline"
            onClick={handleGenerateCreative}
            disabled={isGeneratingCreative}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate More Creative Recipes
          </Button>
        </div>
      )}
    </div>
  );
}
