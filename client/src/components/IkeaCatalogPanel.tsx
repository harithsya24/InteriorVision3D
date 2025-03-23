import { useState, useEffect } from "react";
import { useDesign } from "../lib/stores/useDesign";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "./ui/card";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { searchIkeaProducts, IkeaProduct, ikeaProductToFurniture, getIkeaApiKey, setIkeaApiKey } from "../lib/ikeaApi";

const IkeaCatalogPanel = () => {
  const { addFurniture } = useDesign();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<IkeaProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IkeaProduct | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [rotation, setRotation] = useState(0);
  const [apiKey, setApiKey] = useState(getIkeaApiKey() || "");
  const [apiKeyError, setApiKeyError] = useState("");
  
  // Available furniture categories
  const categories = [
    { id: "", name: "All Categories" },
    { id: "sofa", name: "Sofas & Armchairs" },
    { id: "table", name: "Tables" },
    { id: "chair", name: "Chairs" },
    { id: "bed", name: "Beds" },
    { id: "cabinet", name: "Storage & Cabinets" },
    { id: "bookcase", name: "Bookcases & Shelves" },
    { id: "lamp", name: "Lighting" },
    { id: "plant", name: "Plants & Decorations" },
    { id: "rug", name: "Rugs" }
  ];
  
  // Handle API key configuration
  const handleSetApiKey = () => {
    if (!apiKey.trim()) {
      setApiKeyError("API key cannot be empty");
      return;
    }
    
    setIkeaApiKey(apiKey);
    setApiKeyError("");
  };
  
  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const results = await searchIkeaProducts(searchQuery, selectedCategory || undefined);
      setSearchResults(results);
      setSelectedProduct(null);
    } catch (error) {
      console.error("Error searching IKEA products:", error);
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle product selection
  const handleSelectProduct = (product: IkeaProduct) => {
    setSelectedProduct(product);
    
    // Set default position on the floor
    setPosition({ 
      x: 0, 
      y: product.dimensions.height / 2 || 0.5, 
      z: 0 
    });
    
    setRotation(0);
  };
  
  // Handle adding the selected product to the room
  const handleAddProduct = () => {
    if (!selectedProduct) return;
    
    const furnitureItem = ikeaProductToFurniture(selectedProduct, position, rotation);
    addFurniture(furnitureItem);
    
    // Clear selection
    setSelectedProduct(null);
  };
  
  return (
    <div className="space-y-5">
      {/* API Key Configuration */}
      <div className="space-y-2 p-3 bg-muted/30 rounded-md">
        <div className="flex items-center justify-between">
          <Label className="text-sm">IKEA API Key</Label>
          <Button 
            size="sm" 
            onClick={handleSetApiKey}
            disabled={!apiKey.trim()}
          >
            {getIkeaApiKey() ? "Update Key" : "Set Key"}
          </Button>
        </div>
        <Input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter IKEA API key..."
          className={apiKeyError ? "border-red-500" : ""}
        />
        {apiKeyError && (
          <p className="text-xs text-red-500">{apiKeyError}</p>
        )}
        <p className="text-xs text-muted-foreground">
          An API key is required to search and view IKEA products.
        </p>
      </div>
      
      {/* Search Form */}
      <div className="space-y-3">
        <div className="flex space-x-2">
          <div className="flex-1">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search IKEA furniture..."
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Select 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim() || !getIkeaApiKey()}
          >
            {isSearching ? "Searching..." : "Search"}
          </Button>
        </div>
        
        {!getIkeaApiKey() && (
          <p className="text-sm text-amber-500">
            Please set your IKEA API key above to search for products.
          </p>
        )}
      </div>
      
      {/* Search Results */}
      {searchResults.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium">Search Results</h3>
          <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
            {searchResults.map((product) => (
              <Card 
                key={product.id} 
                className={`cursor-pointer transition-colors ${
                  selectedProduct?.id === product.id ? 'border-primary' : ''
                }`}
                onClick={() => handleSelectProduct(product)}
              >
                <CardHeader className="p-3 pb-2">
                  <CardTitle className="text-sm truncate">{product.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {product.type} - ${product.price}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 pt-0">
                  <p className="text-xs text-muted-foreground">
                    {product.dimensions.width}m × {product.dimensions.height}m × {product.dimensions.depth}m
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
      
      {/* Selected Product Details */}
      {selectedProduct && (
        <div className="space-y-3 border p-3 rounded-md">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{selectedProduct.name}</h3>
              <div className="flex space-x-2 mt-1">
                <Badge variant="outline">{selectedProduct.type}</Badge>
                <Badge variant="secondary">${selectedProduct.price}</Badge>
              </div>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => setSelectedProduct(null)}
            >
              Clear
            </Button>
          </div>
          
          <Separator />
          
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">X Position</Label>
              <Input
                type="number"
                step={0.1}
                value={position.x}
                onChange={(e) => setPosition({...position, x: parseFloat(e.target.value) || 0})}
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs">Y Position</Label>
              <Input
                type="number"
                step={0.1}
                value={position.y}
                onChange={(e) => setPosition({...position, y: parseFloat(e.target.value) || 0})}
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs">Z Position</Label>
              <Input
                type="number"
                step={0.1}
                value={position.z}
                onChange={(e) => setPosition({...position, z: parseFloat(e.target.value) || 0})}
                className="h-8"
              />
            </div>
          </div>
          
          <div>
            <Label className="text-xs">Rotation (Y-axis)</Label>
            <Input
              type="number"
              step={15}
              min={0}
              max={360}
              value={rotation}
              onChange={(e) => setRotation(parseFloat(e.target.value) || 0)}
              className="h-8"
            />
          </div>
          
          <Button 
            className="w-full" 
            onClick={handleAddProduct}
          >
            Add to Room
          </Button>
        </div>
      )}
      
      {searchQuery && searchResults.length === 0 && !isSearching && (
        <p className="text-sm text-muted-foreground">
          No products found. Try another search term or category.
        </p>
      )}
    </div>
  );
};

export default IkeaCatalogPanel;