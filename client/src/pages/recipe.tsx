import * as React from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/apiClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Clock, 
  Users, 
  ChefHat, 
  Heart, 
  Share2, 
  Bookmark, 
  Star,
  CheckCircle2
} from "lucide-react";

interface Recipe {
  id: string;
  title: string;
  description: string;
  image?: string;
  cookTime: number;
  prepTime: number;
  servings: number;
  difficulty: "Easy" | "Medium" | "Hard";
  rating: number;
  reviewCount: number;
  ingredients: Array<{
    name: string;
    amount: string;
    unit: string;
  }>;
  instructions: Array<{
    step: number;
    description: string;
  }>;
  tags: string[];
  nutrition?: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
  };
}

export default function Recipe() {
  const params = useParams();
  const slug = params.slug;
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(new Set());

  const { data: recipe, isLoading, error } = useQuery<Recipe>({
    queryKey: ['/api/recipes', slug],
    enabled: !!slug,
  });

  const toggleStep = (step: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(step)) {
      newCompleted.delete(step);
    } else {
      newCompleted.add(step);
    }
    setCompletedSteps(newCompleted);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Skeleton className="h-64 w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Recipe not found</h2>
            <p className="text-muted-foreground">
              The recipe you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Recipe Header */}
        <div className="mb-8">
          {recipe.image && (
            <img 
              src={recipe.image}
              alt={recipe.title}
              className="w-full h-64 md:h-80 object-cover rounded-lg mb-6"
            />
          )}
          
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {recipe.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold">{recipe.title}</h1>
            <p className="text-lg text-muted-foreground">{recipe.description}</p>
            
            {/* Recipe Meta */}
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{recipe.prepTime + recipe.cookTime} mins total</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center gap-1">
                <ChefHat className="h-4 w-4" />
                <span>{recipe.difficulty}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-accent fill-current" />
                <span>{recipe.rating} ({recipe.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4">
              <Button data-testid="save-recipe">
                <Heart className="mr-2 h-4 w-4" />
                Save Recipe
              </Button>
              <Button variant="outline" data-testid="bookmark-recipe">
                <Bookmark className="mr-2 h-4 w-4" />
                Bookmark
              </Button>
              <Button variant="outline" data-testid="share-recipe">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle>Ingredients</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span className="font-medium">{ingredient.name}</span>
                      <span className="text-muted-foreground">
                        {ingredient.amount} {ingredient.unit}
                      </span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {recipe.instructions.map((instruction) => (
                    <li key={instruction.step} className="flex gap-4">
                      <button
                        onClick={() => toggleStep(instruction.step)}
                        className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
                          completedSteps.has(instruction.step)
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'border-muted-foreground/30 hover:border-primary'
                        }`}
                        data-testid={`step-${instruction.step}`}
                      >
                        {completedSteps.has(instruction.step) ? (
                          <CheckCircle2 className="h-4 w-4" />
                        ) : (
                          <span className="text-sm font-medium">{instruction.step}</span>
                        )}
                      </button>
                      <div className="flex-1">
                        <p className={`${
                          completedSteps.has(instruction.step) 
                            ? 'line-through text-muted-foreground' 
                            : ''
                        }`}>
                          {instruction.description}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recipe Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Prep Time</span>
                  <span>{recipe.prepTime} mins</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cook Time</span>
                  <span>{recipe.cookTime} mins</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Time</span>
                  <span>{recipe.prepTime + recipe.cookTime} mins</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Servings</span>
                  <span>{recipe.servings}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Difficulty</span>
                  <Badge variant="outline">{recipe.difficulty}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Nutrition Info */}
            {recipe.nutrition && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Nutrition (per serving)</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Calories</span>
                    <span>{recipe.nutrition.calories}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Protein</span>
                    <span>{recipe.nutrition.protein}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Carbs</span>
                    <span>{recipe.nutrition.carbs}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Fat</span>
                    <span>{recipe.nutrition.fat}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
