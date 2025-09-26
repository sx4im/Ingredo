import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppStore } from "@/lib/store";
import { useToast } from "@/hooks/use-toast";
import { 
  Plus, 
  Search, 
  Filter, 
  ShoppingCart, 
  CheckCircle2,
  Trash2,
  Download,
  FileText,
  Share2,
  SortAsc,
  SortDesc,
  List,
  Grid,
  Edit,
  Copy,
  Printer
} from "lucide-react";

interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  isPurchased: boolean;
  addedDate: string;
}

export default function Shopping() {
  const { shoppingList, addToShoppingList, updateShoppingListItem, removeFromShoppingList, togglePurchased, clearPurchased } = useAppStore();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [sortBy, setSortBy] = React.useState("added");
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc");
  const [showCompleted, setShowCompleted] = React.useState(true);
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [editingItem, setEditingItem] = React.useState<ShoppingListItem | null>(null);

  const [newItem, setNewItem] = React.useState({
    name: "",
    quantity: 1,
    unit: "pieces",
    category: "vegetables",
    isPurchased: false,
  });

  const categories = [
    "vegetables", "fruits", "dairy", "meat", "grains", "spices", "beverages", "other"
  ];

  const units = [
    "pieces", "kg", "g", "lbs", "oz", "liters", "ml", "cups", "tbsp", "tsp", "cans", "packages"
  ];

  // Filter and sort items
  const filteredItems = React.useMemo(() => {
    let filtered = shoppingList.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesCompleted = showCompleted || !item.isPurchased;
      return matchesSearch && matchesCategory && matchesCompleted;
    });

    // Sort items
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name);
          break;
        case "category":
          comparison = a.category.localeCompare(b.category);
          break;
        case "quantity":
          comparison = a.quantity - b.quantity;
          break;
        case "added":
          comparison = new Date(a.addedDate).getTime() - new Date(b.addedDate).getTime();
          break;
        case "status":
          comparison = (a.isPurchased ? 1 : 0) - (b.isPurchased ? 1 : 0);
          break;
      }
      
      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [shoppingList, searchQuery, selectedCategory, sortBy, sortOrder, showCompleted]);

  const purchasedCount = shoppingList.filter(item => item.isPurchased).length;
  const totalCount = shoppingList.length;
  const remainingCount = totalCount - purchasedCount;

  const handleAddItem = () => {
    if (!newItem.name) {
      toast({
        title: "Missing information",
        description: "Please enter an item name.",
        variant: "destructive",
      });
      return;
    }

    addToShoppingList(newItem);
    setNewItem({
      name: "",
      quantity: 1,
      unit: "pieces",
      category: "vegetables",
      isPurchased: false,
    });
    setShowAddDialog(false);
    toast({
      title: "Item added!",
      description: `${newItem.name} has been added to your shopping list.`,
    });
  };

  const handleEditItem = (item: ShoppingListItem) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      category: item.category,
      isPurchased: item.isPurchased,
    });
    setShowAddDialog(true);
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;

    updateShoppingListItem(editingItem.id, {
      name: newItem.name,
      quantity: newItem.quantity,
      unit: newItem.unit,
      category: newItem.category,
    });
    setEditingItem(null);
    setNewItem({
      name: "",
      quantity: 1,
      unit: "pieces",
      category: "vegetables",
      isPurchased: false,
    });
    setShowAddDialog(false);
    toast({
      title: "Item updated!",
      description: `${newItem.name} has been updated.`,
    });
  };

  const handleDeleteItem = (itemId: string, itemName: string) => {
    removeFromShoppingList(itemId);
    toast({
      title: "Item removed",
      description: `${itemName} has been removed from your shopping list.`,
    });
  };

  const handleTogglePurchased = (itemId: string) => {
    togglePurchased(itemId);
  };

  const handleClearPurchased = () => {
    clearPurchased();
    toast({
      title: "Cleared completed items",
      description: "All purchased items have been removed from your list.",
    });
  };

  const exportToText = () => {
    const text = shoppingList
      .filter(item => !item.isPurchased)
      .map(item => `${item.name} - ${item.quantity} ${item.unit}`)
      .join('\n');
    
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shopping-list.txt';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "List exported!",
      description: "Your shopping list has been downloaded as a text file.",
    });
  };

  const copyToClipboard = () => {
    const text = shoppingList
      .filter(item => !item.isPurchased)
      .map(item => `${item.name} - ${item.quantity} ${item.unit}`)
      .join('\n');
    
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "Your shopping list has been copied.",
    });
  };

  const printList = () => {
    const printContent = shoppingList
      .filter(item => !item.isPurchased)
      .map(item => `${item.name} - ${item.quantity} ${item.unit}`)
      .join('\n');
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Shopping List</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1 { color: #333; }
              .item { margin: 5px 0; }
            </style>
          </head>
          <body>
            <h1>Shopping List</h1>
            <div>${printContent.split('\n').map(item => `<div class="item">${item}</div>`).join('')}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/shopping.webp)',
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
                  Shopping List 🛒
                </h1>
                <p className="text-gray-600">
                  Plan your shopping and never forget an ingredient
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                {remainingCount > 0 && (
                  <Badge variant="secondary" className="px-3 py-1">
                    {remainingCount} items remaining
                  </Badge>
                )}
                
                <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>
                        {editingItem ? "Edit Shopping Item" : "Add New Item"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Item Name</Label>
                        <Input
                          id="name"
                          value={newItem.name}
                          onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., Milk"
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
                      
                      <div className="flex gap-2 pt-4">
                        <Button
                          onClick={editingItem ? handleUpdateItem : handleAddItem}
                          className="flex-1 bg-blue-600 hover:bg-blue-700"
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
                              category: "vegetables",
                              isPurchased: false,
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
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Items</p>
                    <p className="text-3xl font-bold text-gray-900">{totalCount}</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Purchased</p>
                    <p className="text-3xl font-bold text-gray-900">{purchasedCount}</p>
                  </div>
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Remaining</p>
                    <p className="text-3xl font-bold text-gray-900">{remainingCount}</p>
                  </div>
                  <List className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Categories</p>
                    <p className="text-3xl font-bold text-gray-900">{new Set(shoppingList.map(item => item.category)).size}</p>
                  </div>
                  <Filter className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filters and Actions */}
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
                        placeholder="Search shopping items..."
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
                      <SelectItem value="added">Date Added</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="category">Category</SelectItem>
                      <SelectItem value="quantity">Quantity</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
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
                      variant={showCompleted ? "default" : "outline"}
                      size="sm"
                      onClick={() => setShowCompleted(!showCompleted)}
                    >
                      Show Completed
                    </Button>
                  </div>
                </div>
                
                {/* Export Actions */}
                {shoppingList.length > 0 && (
                  <div className="flex gap-2 mt-4 pt-4 border-t">
                    <Button variant="outline" size="sm" onClick={exportToText}>
                      <Download className="h-4 w-4 mr-2" />
                      Export TXT
                    </Button>
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy List
                    </Button>
                    <Button variant="outline" size="sm" onClick={printList}>
                      <Printer className="h-4 w-4 mr-2" />
                      Print
                    </Button>
                    {purchasedCount > 0 && (
                      <Button variant="outline" size="sm" onClick={handleClearPurchased}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear Completed
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Shopping List Items */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {filteredItems.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
                  <p className="text-gray-600 mb-6">
                    {shoppingList.length === 0 
                      ? "Start building your shopping list by adding some items!"
                      : "Try adjusting your search or filter criteria."
                    }
                  </p>
                  {shoppingList.length === 0 && (
                    <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Item
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                <AnimatePresence>
                  {filteredItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card className={`transition-all duration-300 ${
                        item.isPurchased 
                          ? "bg-green-50 border-green-200 opacity-75" 
                          : "hover:shadow-md"
                      }`}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <Checkbox
                              checked={item.isPurchased}
                              onCheckedChange={() => handleTogglePurchased(item.id)}
                              className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                            />
                            
                            <div className="flex-1">
                              <div className={`flex items-center gap-2 ${item.isPurchased ? "line-through text-gray-500" : ""}`}>
                                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                <Badge variant="secondary" className="text-xs">
                                  {item.category}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                {item.quantity} {item.unit}
                              </p>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditItem(item)}
                                disabled={item.isPurchased}
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
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
