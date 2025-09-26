import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAppStore } from "@/lib/store";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Mail, 
  Bell, 
  Shield, 
  Palette, 
  Moon, 
  Sun,
  Camera,
  Save,
  Trash2,
  Download,
  Upload,
  Eye,
  EyeOff,
  Lock,
  Key,
  Smartphone,
  Monitor,
  Globe,
  Heart,
  BookOpen,
  Package,
  ShoppingCart
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const { theme, setTheme, toggleTheme } = useAppStore();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = React.useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "",
    location: "",
    website: "",
  });

  const [notifications, setNotifications] = React.useState({
    emailNotifications: true,
    pushNotifications: true,
    recipeUpdates: true,
    pantryReminders: true,
    shoppingReminders: false,
    weeklyDigest: true,
  });

  const [privacy, setPrivacy] = React.useState({
    profileVisibility: "public",
    showEmail: false,
    showLocation: true,
    allowMessages: true,
    dataSharing: false,
  });

  const [preferences, setPreferences] = React.useState({
    defaultServings: 4,
    preferredUnits: "metric",
    language: "en",
    timezone: "UTC",
    autoSave: true,
    showNutritionInfo: true,
  });

  const handleSaveProfile = () => {
    // In a real app, this would make an API call
    toast({
      title: "Profile updated!",
      description: "Your profile has been saved successfully.",
    });
  };

  const handleSaveNotifications = () => {
    toast({
      title: "Notifications updated!",
      description: "Your notification preferences have been saved.",
    });
  };

  const handleSavePrivacy = () => {
    toast({
      title: "Privacy settings updated!",
      description: "Your privacy preferences have been saved.",
    });
  };

  const handleSavePreferences = () => {
    toast({
      title: "Preferences updated!",
      description: "Your app preferences have been saved.",
    });
  };

  const handleExportData = () => {
    const data = {
      profile: profileData,
      notifications,
      privacy,
      preferences,
      theme,
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ingredo-settings.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data exported!",
      description: "Your settings have been downloaded as a JSON file.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      title: "Feature coming soon",
      description: "Account deletion will be available soon.",
    });
  };

  return (
    <div className="relative min-h-screen">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50" />
      <div className="absolute inset-0 bg-[url('/bg.webp')] bg-cover bg-center opacity-5" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
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
                  Settings ⚙️
                </h1>
                <p className="text-gray-600">
                  Manage your account preferences and app settings
                </p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-8">
            {/* Profile Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Profile Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="text-2xl">
                        {user?.name?.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        Change Avatar
                      </Button>
                      <p className="text-sm text-gray-600 mt-1">
                        JPG, PNG or GIF. Max size 2MB.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Input
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                        placeholder="City, Country"
                      />
                    </div>
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={profileData.website}
                        onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleSaveProfile} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Theme Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-purple-600" />
                    Appearance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="theme">Theme</Label>
                      <p className="text-sm text-gray-600">
                        Choose your preferred color scheme
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={theme === "light" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("light")}
                      >
                        <Sun className="h-4 w-4 mr-2" />
                        Light
                      </Button>
                      <Button
                        variant={theme === "dark" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTheme("dark")}
                      >
                        <Moon className="h-4 w-4 mr-2" />
                        Dark
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-theme">Auto Theme</Label>
                      <p className="text-sm text-gray-600">
                        Automatically switch theme based on system preference
                      </p>
                    </div>
                    <Switch id="auto-theme" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Notification Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-orange-600" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-notifications">Email Notifications</Label>
                        <p className="text-sm text-gray-600">
                          Receive notifications via email
                        </p>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={notifications.emailNotifications}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, emailNotifications: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="push-notifications">Push Notifications</Label>
                        <p className="text-sm text-gray-600">
                          Receive push notifications in your browser
                        </p>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={notifications.pushNotifications}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pushNotifications: checked }))}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="recipe-updates">Recipe Updates</Label>
                        <p className="text-sm text-gray-600">
                          Get notified when your saved recipes are updated
                        </p>
                      </div>
                      <Switch
                        id="recipe-updates"
                        checked={notifications.recipeUpdates}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, recipeUpdates: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="pantry-reminders">Pantry Reminders</Label>
                        <p className="text-sm text-gray-600">
                          Get reminded about expiring ingredients
                        </p>
                      </div>
                      <Switch
                        id="pantry-reminders"
                        checked={notifications.pantryReminders}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, pantryReminders: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="shopping-reminders">Shopping Reminders</Label>
                        <p className="text-sm text-gray-600">
                          Get reminded about your shopping list
                        </p>
                      </div>
                      <Switch
                        id="shopping-reminders"
                        checked={notifications.shoppingReminders}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, shoppingReminders: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="weekly-digest">Weekly Digest</Label>
                        <p className="text-sm text-gray-600">
                          Receive a weekly summary of your cooking activity
                        </p>
                      </div>
                      <Switch
                        id="weekly-digest"
                        checked={notifications.weeklyDigest}
                        onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, weeklyDigest: checked }))}
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleSaveNotifications} className="bg-orange-600 hover:bg-orange-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Notifications
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Privacy Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-green-600" />
                    Privacy & Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="profile-visibility">Profile Visibility</Label>
                        <p className="text-sm text-gray-600">
                          Control who can see your profile
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant={privacy.profileVisibility === "public" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPrivacy(prev => ({ ...prev, profileVisibility: "public" }))}
                        >
                          <Globe className="h-4 w-4 mr-1" />
                          Public
                        </Button>
                        <Button
                          variant={privacy.profileVisibility === "private" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPrivacy(prev => ({ ...prev, profileVisibility: "private" }))}
                        >
                          <Lock className="h-4 w-4 mr-1" />
                          Private
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-email">Show Email</Label>
                        <p className="text-sm text-gray-600">
                          Display your email address on your profile
                        </p>
                      </div>
                      <Switch
                        id="show-email"
                        checked={privacy.showEmail}
                        onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showEmail: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="show-location">Show Location</Label>
                        <p className="text-sm text-gray-600">
                          Display your location on your profile
                        </p>
                      </div>
                      <Switch
                        id="show-location"
                        checked={privacy.showLocation}
                        onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, showLocation: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="allow-messages">Allow Messages</Label>
                        <p className="text-sm text-gray-600">
                          Allow other users to send you messages
                        </p>
                      </div>
                      <Switch
                        id="allow-messages"
                        checked={privacy.allowMessages}
                        onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, allowMessages: checked }))}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="data-sharing">Data Sharing</Label>
                        <p className="text-sm text-gray-600">
                          Allow anonymous usage data to improve the app
                        </p>
                      </div>
                      <Switch
                        id="data-sharing"
                        checked={privacy.dataSharing}
                        onCheckedChange={(checked) => setPrivacy(prev => ({ ...prev, dataSharing: checked }))}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <Separator />
                    <div className="space-y-2">
                      <Label>Change Password</Label>
                      <Button variant="outline" size="sm">
                        <Key className="h-4 w-4 mr-2" />
                        Update Password
                      </Button>
                    </div>
                  </div>
                  
                  <Button onClick={handleSavePrivacy} className="bg-green-600 hover:bg-green-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Privacy Settings
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* App Preferences */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Monitor className="h-5 w-5 text-indigo-600" />
                    App Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="default-servings">Default Servings</Label>
                      <Input
                        id="default-servings"
                        type="number"
                        min="1"
                        max="20"
                        value={preferences.defaultServings}
                        onChange={(e) => setPreferences(prev => ({ ...prev, defaultServings: Number(e.target.value) }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="preferred-units">Preferred Units</Label>
                      <div className="flex gap-2 mt-2">
                        <Button
                          variant={preferences.preferredUnits === "metric" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPreferences(prev => ({ ...prev, preferredUnits: "metric" }))}
                        >
                          Metric
                        </Button>
                        <Button
                          variant={preferences.preferredUnits === "imperial" ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPreferences(prev => ({ ...prev, preferredUnits: "imperial" }))}
                        >
                          Imperial
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="auto-save">Auto Save</Label>
                      <p className="text-sm text-gray-600">
                        Automatically save your progress while cooking
                      </p>
                    </div>
                    <Switch
                      id="auto-save"
                      checked={preferences.autoSave}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, autoSave: checked }))}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="show-nutrition">Show Nutrition Info</Label>
                      <p className="text-sm text-gray-600">
                        Display nutritional information for recipes
                      </p>
                    </div>
                    <Switch
                      id="show-nutrition"
                      checked={preferences.showNutritionInfo}
                      onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, showNutritionInfo: checked }))}
                    />
                  </div>
                  
                  <Button onClick={handleSavePreferences} className="bg-indigo-600 hover:bg-indigo-700">
                    <Save className="h-4 w-4 mr-2" />
                    Save Preferences
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Data Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Download className="h-5 w-5 text-gray-600" />
                    Data Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Export Data</Label>
                        <p className="text-sm text-gray-600">
                          Download all your data including recipes, collections, and settings
                        </p>
                      </div>
                      <Button variant="outline" onClick={handleExportData}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Import Data</Label>
                        <p className="text-sm text-gray-600">
                          Import data from a previously exported file
                        </p>
                      </div>
                      <Button variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Import
                      </Button>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-red-600">Delete Account</Label>
                        <p className="text-sm text-gray-600">
                          Permanently delete your account and all associated data
                        </p>
                      </div>
                      <Button variant="destructive" onClick={handleDeleteAccount}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
