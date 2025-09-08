import * as React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type SearchFilters, searchFiltersSchema } from "@shared/schema";
import { cn } from "@/lib/utils";
import { ChevronDown, X, Filter, Utensils } from "lucide-react";

interface PreferencesPanelProps {
  onFiltersChange: (filters: SearchFilters) => void;
  className?: string;
}

const ALLERGY_OPTIONS = [
  { value: "peanut", label: "Peanuts" },
  { value: "dairy", label: "Dairy" },
  { value: "gluten", label: "Gluten" },
  { value: "shellfish", label: "Shellfish" },
  { value: "tree-nuts", label: "Tree Nuts" },
  { value: "soy", label: "Soy" },
  { value: "eggs", label: "Eggs" },
  { value: "fish", label: "Fish" },
] as const;

const CUISINE_OPTIONS = [
  "Italian", "Chinese", "Mexican", "Indian", "Japanese", "French", 
  "Thai", "Mediterranean", "American", "Korean", "Greek", "Spanish",
  "Middle Eastern", "Vietnamese", "British", "German", "Brazilian"
];

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function PreferencesPanel({ onFiltersChange, className }: PreferencesPanelProps) {
  const [location, navigate] = useLocation();
  
  // Custom hook to manage search params since wouter doesn't have useSearchParams
  const getSearchParams = () => new URLSearchParams(window.location.search);
  const setSearchParams = (params: string) => {
    const newUrl = `${window.location.pathname}?${params}`;
    navigate(newUrl);
  };
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(() => {
    // Parse filters from URL on mount
    const searchParams = getSearchParams();
    const urlFilters: Partial<SearchFilters> = {};
    
    const diet = searchParams.get("diet");
    if (diet) urlFilters.diet = diet as SearchFilters["diet"];
    
    const allergies = searchParams.get("allergies");
    if (allergies) urlFilters.allergies = allergies.split(",") as SearchFilters["allergies"];
    
    const maxCookTime = searchParams.get("maxCookTime");
    if (maxCookTime) urlFilters.maxCookTime = parseInt(maxCookTime);
    
    const cuisine = searchParams.get("cuisine");
    if (cuisine) urlFilters.cuisine = cuisine;
    
    const difficulty = searchParams.get("difficulty");
    if (difficulty) urlFilters.difficulty = difficulty as SearchFilters["difficulty"];
    
    const allowSubstitutions = searchParams.get("allowSubstitutions");
    if (allowSubstitutions) urlFilters.allowSubstitutions = allowSubstitutions === "true";
    
    const servings = searchParams.get("servings");
    if (servings) urlFilters.servings = parseInt(servings);

    return searchFiltersSchema.parse(urlFilters);
  });

  // Debounce filter changes
  const debouncedFilters = useDebounce(filters, 500);

  // Update URL and call onChange when debounced filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (debouncedFilters.diet !== "any") {
      params.set("diet", debouncedFilters.diet);
    }
    
    if (debouncedFilters.allergies.length > 0) {
      params.set("allergies", debouncedFilters.allergies.join(","));
    }
    
    if (debouncedFilters.maxCookTime !== 60) {
      params.set("maxCookTime", debouncedFilters.maxCookTime.toString());
    }
    
    if (debouncedFilters.cuisine) {
      params.set("cuisine", debouncedFilters.cuisine);
    }
    
    if (debouncedFilters.difficulty !== "any") {
      params.set("difficulty", debouncedFilters.difficulty);
    }
    
    if (!debouncedFilters.allowSubstitutions) {
      params.set("allowSubstitutions", "false");
    }
    
    if (debouncedFilters.servings !== 4) {
      params.set("servings", debouncedFilters.servings.toString());
    }

    // Preserve existing search params (like ingredients)
    const existingParams = new URLSearchParams(window.location.search);
    const ingredients = existingParams.get("ingredients");
    if (ingredients) {
      params.set("ingredients", ingredients);
    }

    setSearchParams(params.toString());
    onFiltersChange(debouncedFilters);
  }, [debouncedFilters, onFiltersChange, setSearchParams]);

  const updateFilter = useCallback(<K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleAllergy = useCallback((allergy: string) => {
    setFilters(prev => ({
      ...prev,
      allergies: prev.allergies.includes(allergy as any)
        ? prev.allergies.filter(a => a !== allergy)
        : [...prev.allergies, allergy as any]
    }));
  }, []);

  const clearAllFilters = useCallback(() => {
    const defaultFilters = searchFiltersSchema.parse({});
    setFilters(defaultFilters);
  }, []);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    const defaults = searchFiltersSchema.parse({});
    let count = 0;
    
    if (filters.diet !== defaults.diet) count++;
    if (filters.allergies.length > 0) count++;
    if (filters.maxCookTime !== defaults.maxCookTime) count++;
    if (filters.cuisine) count++;
    if (filters.difficulty !== defaults.difficulty) count++;
    if (filters.allowSubstitutions !== defaults.allowSubstitutions) count++;
    if (filters.servings !== defaults.servings) count++;
    
    return count;
  }, [filters]);

  const renderActiveFilters = () => {
    const defaults = searchFiltersSchema.parse({});
    const activeFilters: { label: string; onRemove: () => void }[] = [];

    if (filters.diet !== defaults.diet) {
      activeFilters.push({
        label: filters.diet.charAt(0).toUpperCase() + filters.diet.slice(1),
        onRemove: () => updateFilter("diet", defaults.diet)
      });
    }

    if (filters.allergies.length > 0) {
      filters.allergies.forEach(allergy => {
        const allergyLabel = ALLERGY_OPTIONS.find(opt => opt.value === allergy)?.label || allergy;
        activeFilters.push({
          label: `No ${allergyLabel}`,
          onRemove: () => toggleAllergy(allergy)
        });
      });
    }

    if (filters.maxCookTime !== defaults.maxCookTime) {
      activeFilters.push({
        label: `≤${filters.maxCookTime} min`,
        onRemove: () => updateFilter("maxCookTime", defaults.maxCookTime)
      });
    }

    if (filters.cuisine) {
      activeFilters.push({
        label: filters.cuisine,
        onRemove: () => updateFilter("cuisine", undefined)
      });
    }

    if (filters.difficulty !== defaults.difficulty) {
      activeFilters.push({
        label: filters.difficulty.charAt(0).toUpperCase() + filters.difficulty.slice(1),
        onRemove: () => updateFilter("difficulty", defaults.difficulty)
      });
    }

    if (filters.allowSubstitutions !== defaults.allowSubstitutions) {
      activeFilters.push({
        label: "No substitutions",
        onRemove: () => updateFilter("allowSubstitutions", defaults.allowSubstitutions)
      });
    }

    if (filters.servings !== defaults.servings) {
      activeFilters.push({
        label: `${filters.servings} servings`,
        onRemove: () => updateFilter("servings", defaults.servings)
      });
    }

    return activeFilters;
  };

  const activeFilters = renderActiveFilters();

  return (
    <Card className={cn("w-full border border-gray-300 shadow-lg", className)}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="pb-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-200">
            <CardTitle className="flex items-center justify-between text-base font-semibold">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-700" />
                <span className="text-gray-800">Filters</span>
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="h-6 text-xs bg-blue-100 text-blue-800 border-blue-200">
                    {activeFilterCount}
                  </Badge>
                )}
              </div>
              <ChevronDown 
                className={cn("h-5 w-5 text-gray-600 transition-transform", isOpen && "rotate-180")} 
              />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-6 bg-gray-50/30">
            {/* Active Filters */}
            {activeFilters.length > 0 && (
              <div className="space-y-3 p-4 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">Active Filters</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-auto py-1 px-3 text-xs text-orange-600 hover:text-orange-700 hover:bg-orange-50 border border-orange-200"
                    data-testid="clear-all-filters"
                  >
                    Clear All
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {activeFilters.map((filter, index) => (
                    <Badge 
                      key={index}
                      variant="secondary" 
                      className="text-xs gap-1 bg-orange-50 text-orange-800 border border-orange-200 hover:bg-orange-100"
                    >
                      {filter.label}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={filter.onRemove}
                        className="h-auto w-auto p-0 hover:bg-transparent hover:text-orange-600"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 mt-6">
              {/* Diet */}
              <div className="space-y-3 p-4 bg-white rounded-lg border border-gray-200">
                <Label className="text-sm font-semibold text-gray-700">Diet</Label>
                <Select
                  value={filters.diet}
                  onValueChange={(value) => updateFilter("diet", value as SearchFilters["diet"])}
                >
                  <SelectTrigger 
                    data-testid="diet-select"
                    className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border border-gray-200 shadow-lg">
                    <SelectItem value="any">Any</SelectItem>
                    <SelectItem value="vegan">Vegan</SelectItem>
                    <SelectItem value="vegetarian">Vegetarian</SelectItem>
                    <SelectItem value="pescatarian">Pescatarian</SelectItem>
                    <SelectItem value="omnivore">Omnivore</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Servings */}
              <div className="space-y-3 p-4 bg-white rounded-lg border border-gray-200">
                <Label className="text-sm font-semibold text-gray-700">Servings</Label>
                <Input
                  type="number"
                  min={1}
                  max={12}
                  value={filters.servings}
                  onChange={(e) => updateFilter("servings", parseInt(e.target.value) || 4)}
                  className="w-full border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  data-testid="servings-input"
                />
              </div>
            </div>

            {/* Max Cook Time */}
            <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200 mt-6">
              <div className="flex justify-between items-center">
                <Label className="text-sm font-semibold text-gray-700">Max Cook Time</Label>
                <span className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">{filters.maxCookTime} minutes</span>
              </div>
              <Slider
                value={[filters.maxCookTime]}
                onValueChange={([value]) => updateFilter("maxCookTime", value)}
                max={240}
                min={5}
                step={5}
                className="w-full"
                data-testid="cook-time-slider"
              />
            </div>

            {/* Difficulty */}
            <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200 mt-6">
              <Label className="text-sm font-semibold text-gray-700">Difficulty</Label>
              <RadioGroup
                value={filters.difficulty}
                onValueChange={(value) => updateFilter("difficulty", value as SearchFilters["difficulty"])}
                className="flex gap-6"
                data-testid="difficulty-radio"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="any" 
                    id="any" 
                    className="border border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-200"
                  />
                  <Label htmlFor="any" className="text-sm font-medium text-gray-700">Any</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="easy" 
                    id="easy" 
                    className="border border-gray-300 text-green-600 focus:ring-2 focus:ring-green-200"
                  />
                  <Label htmlFor="easy" className="text-sm font-medium text-gray-700">Easy</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="medium" 
                    id="medium" 
                    className="border border-gray-300 text-yellow-600 focus:ring-2 focus:ring-yellow-200"
                  />
                  <Label htmlFor="medium" className="text-sm font-medium text-gray-700">Medium</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem 
                    value="hard" 
                    id="hard" 
                    className="border border-gray-300 text-red-600 focus:ring-2 focus:ring-red-200"
                  />
                  <Label htmlFor="hard" className="text-sm font-medium text-gray-700">Hard</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Cuisine */}
            <div className="space-y-3 p-4 bg-white rounded-lg border border-gray-200 mt-6">
              <Label className="text-sm font-semibold text-gray-700">Cuisine</Label>
              <Select
                value={filters.cuisine || "any"}
                onValueChange={(value) => updateFilter("cuisine", value === "any" ? undefined : value)}
              >
                <SelectTrigger 
                  data-testid="cuisine-select"
                  className="border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                >
                  <SelectValue placeholder="Any cuisine" />
                </SelectTrigger>
                <SelectContent className="border border-gray-200 shadow-lg">
                  <SelectItem value="any">Any cuisine</SelectItem>
                  {CUISINE_OPTIONS.map(cuisine => (
                    <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Allergies */}
            <div className="space-y-4 p-4 bg-white rounded-lg border border-gray-200 mt-6">
              <Label className="text-sm font-semibold text-gray-700">Avoid Allergens</Label>
              <div className="grid grid-cols-2 gap-3">
                {ALLERGY_OPTIONS.map(allergy => (
                  <Button
                    key={allergy.value}
                    variant={filters.allergies.includes(allergy.value) ? "default" : "outline"}
                    size="sm"
                    onClick={() => toggleAllergy(allergy.value)}
                    className={cn(
                      "justify-start text-sm h-10 font-medium transition-all duration-200",
                      filters.allergies.includes(allergy.value)
                        ? "bg-orange-500 hover:bg-orange-600 text-white border-orange-500 shadow-md"
                        : "border border-gray-300 text-gray-700 hover:border-orange-300 hover:bg-orange-50 hover:text-orange-700"
                    )}
                    data-testid={`allergy-${allergy.value}`}
                  >
                    {allergy.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Allow Substitutions */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 mt-6">
              <div className="space-y-1">
                <Label className="text-sm font-semibold text-gray-700">Allow Substitutions</Label>
                <p className="text-xs text-gray-600">
                  Allow ingredient substitutions in recipes
                </p>
              </div>
              <Switch
                checked={filters.allowSubstitutions}
                onCheckedChange={(checked) => updateFilter("allowSubstitutions", checked)}
                data-testid="substitutions-switch"
                className="data-[state=checked]:bg-green-600"
              />
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}