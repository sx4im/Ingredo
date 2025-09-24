import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Search, 
  Filter, 
  Calendar, 
  Package, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  SortAsc,
  SortDesc,
  Grid,
  List
} from "lucide-react";

interface PantryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  expiryDate: string;
  category: string;
  thumbnail?: string;
}

export default function Pantry() {
  const { pantryItems, addPantryItem, updatePantryItem, removePantryItem } = useAppStore();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("expiry");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("asc");
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<PantryItem | null>(null);

  const [newItem, setNewItem] = React.useState({
    name: "",
    quantity: 1,
    unit: "pieces",
    expiryDate: "",
    category: "vegetables",
  });

  const categories = [
    "vegetables", "fruits", "dairy", "meat", "grains", "spices", "beverages", "other"
  ];

  const units = [
    "pieces", "kg", "g", "lbs", "oz", "liters", "ml", "cups", "tbsp", "tsp", "cans", "packages"
  ];

  // Filter and sort items
  const filteredItems = React.useMemo(() => {
    let filtered = pantryItems.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort items
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "expiry":
          comparison = new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime();
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "quantity":
          comparison = a.quantity - b.quantity;
          break;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [pantryItems, searchQuery, selectedCategory, sortBy, sortOrder]);

  // Get expiry status
  const getExpiryStatus = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: "expired", color: "destructive", days: diffDays };
    if (diffDays <= 1) return { status: "expiring", color: "destructive", days: diffDays };
    if (diffDays <= 3) return { status: "soon", color: "secondary", days: diffDays };
    return { status: "fresh", color: "default", days: diffDays };
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.expiryDate) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    addPantryItem(newItem);
    setNewItem({
      name: "",
      quantity: 1,
      unit: "pieces",
      expiryDate: "",
      category: "vegetables",
    });
    setShowAddDialog(false);
    toast({
      title: "Item added!",
      description: `${newItem.name} has been added to your pantry.`,
    });
  };

  const handleEditItem = (item: PantryItem) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      expiryDate: item.expiryDate,
      category: item.category,
    });
    setShowAddDialog(true);
  };

  const handleUpdateItem = () => {
    if (!editingItem || !newItem.name || !newItem.expiryDate) return;

    updatePantryItem(editingItem.id, newItem);
    setEditingItem(null);
    setNewItem({
      name: "",
      quantity: 1,
      unit: "pieces",
      expiryDate: "",
      category: "vegetables",
    });
    setShowAddDialog(false);
    toast({
      title: "Item updated!",
      description: `${newItem.name} has been updated.`,
    });
  };

  const handleDeleteItem = (itemId: string, itemName: string) => {
    removePantryItem(itemId);
    toast({
      title: "Item removed",
      description: `${itemName} has been removed from your pantry.`,
    });
  };

  const getExpiringCount = () => {
    return pantryItems.filter(item => {
      const status = getExpiryStatus(item.expiryDate);
      return status.status === "expiring" || status.status === "expired";
    }).length;
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/bg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      {/* Blue Overlay */}
      <div 
        className="fixed inset-0 z-10" 
        style={{ backgroundColor: 'rgba(30, 64, 175, 0.4)' }}
      />
      
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  My Pantry 
                </h1>
                <p className="text-gray-600">
                  Manage your ingredients and track expiry dates
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {getExpiringCount() > 0 && (
                  <Badge variant="destructive" className="px-3 py-1">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {getExpiringCount()} expiring
                  </Badge>
                )}
                
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {editingItem ? "Edit Pantry Item" : "Add New Item"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Item Name</Label>
                        <Input
                          id="name"
                          value={newItem.name}
                          onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Tomatoes"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="quantity">Quantity</Label>
                          <Input
                            id="quantity"
                            type="number"
                            min="1"
                            value={newItem.quantity}
                            onChange={(e) => setNewItem(prev => ({ ...prev, quantity: Number(e.target.value) }))}
                          />
                        </div>
                        <div>
                          <Label htmlFor="unit">Unit</Label>
                          <Select value={newItem.unit} onValueChange={(value) => setNewItem(prev => ({ ...prev, unit: value }))}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {units.map(unit => (
                                <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="category">Category</Label>
                        <Select value={newItem.category} onValueChange={(value) => setNewItem(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map(category => (
                              <SelectItem key={category} value={category}>
                                {category.charAt(0).toUpperCase() + category.slice(1)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          type="date"
                          value={newItem.expiryDate}
                          onChange={(e) => setNewItem(prev => ({ ...prev, expiryDate: e.target.value }))}
                        />
                      </div>
                      
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={editingItem ? handleUpdateItem : handleAddItem}
                          className="flex-1 bg-green-600 hover:bg-green-700"
                        >
                          {editingItem ? "Update Item" : "Add Item"}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowAddDialog(false);
                            setEditingItem(null);
                            setNewItem({
                              name: "",
                              quantity: 1,
                              unit: "pieces",
                              expiryDate: "",
                              category: "vegetables",
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Items</p>
                    <p className="text-3xl font-bold text-gray-900">{pantryItems.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
                    <p className="text-3xl font-bold text-gray-900">{getExpiringCount()}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Categories</p>
                    <p className="text-3xl font-bold text-gray-900">{new Set(pantryItems.map(item => item.category)).size}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Fresh Items</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {pantryItems.filter(item => getExpiryStatus(item.expiryDate).status === "fresh").length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search pantry items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-full md:w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="expiry">Expiry Date</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="quantity">Quantity</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button
                    variant="outline"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="w-full md:w-auto"
                  >
                    {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button
                      variant={viewMode === "grid" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Pantry Items */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {filteredItems.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
                  <p className="text-gray-600 mb-6">
                    {pantryItems.length === 0 
                      ? "Start building your pantry by adding some ingredients!"
                      : "Try adjusting your search or filter criteria."
                    }
                  </p>
                  {pantryItems.length === 0 && (
                    <Button onClick={() => setShowAddDialog(true)} className="bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Item
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
              }>
                <AnimatePresence>
                  {filteredItems.map((item, index) => {
                    const expiryStatus = getExpiryStatus(item.expiryDate);
                    
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className={`hover:shadow-lg transition-all duration-300 ${
                          expiryStatus.status === "expired" ? "border-red-200 bg-red-50" :
                          expiryStatus.status === "expiring" ? "border-orange-200 bg-orange-50" :
                          "border-gray-200"
                        }`}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 mb-1">{item.name}</h3>
                                <p className="text-sm text-gray-600 capitalize">{item.category}</p>
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEditItem(item)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteItem(item.id, item.name)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Quantity:</span>
                                <span className="font-medium">{item.quantity} {item.unit}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-600">Expires:</span>
                                <span className="font-medium">{new Date(item.expiryDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                            
                            <Badge 
                              variant={expiryStatus.color as any}
                              className="w-full justify-center"
                            >
                              {expiryStatus.status === "expired" && "Expired"}
                              {expiryStatus.status === "expiring" && "Expiring today"}
                              {expiryStatus.status === "soon" && `Expires in ${expiryStatus.days} days`}
                              {expiryStatus.status === "fresh" && "Fresh"}
                            </Badge>
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
