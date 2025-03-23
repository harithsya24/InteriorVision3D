import { useState, useEffect } from "react";
import { useDesign } from "../lib/stores/useDesign";
import { IkeaApiService } from "../lib/services/ikeaApiService";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

// Mock IKEA product data interface
export interface IkeaProduct {
  id: string;
  name: string;
  price: {
    amount: number;
    currency: string;
  };
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  imageUrl: string;
  productUrl: string;
  category: string;
  description: string;
  brand: string;
}

// Sample IKEA products (for demonstration) - these would be fetched from the API
const SAMPLE_PRODUCTS: IkeaProduct[] = [
  {
    id: "ikea-001",
    name: "BILLY Bookcase",
    price: {
      amount: 129.99,
      currency: "USD"
    },
    dimensions: {
      width: 0.8,
      height: 2.02,
      depth: 0.28
    },
    imageUrl: "https://www.ikea.com/us/en/images/products/billy-bookcase-white__0625599_pe692385_s5.jpg",
    productUrl: "https://www.ikea.com/us/en/p/billy-bookcase-white-00263850/",
    category: "bookcase",
    description: "Bookcase, white, 31 1/2x11x79 1/2\"",
    brand: "IKEA"
  },
  {
    id: "ikea-002",
    name: "MALM Bed frame",
    price: {
      amount: 249.99,
      currency: "USD"
    },
    dimensions: {
      width: 1.6,
      height: 0.38,
      depth: 2.0
    },
    imageUrl: "https://www.ikea.com/us/en/images/products/malm-bed-frame-high-white-luroey__0749130_pe745499_s5.jpg",
    productUrl: "https://www.ikea.com/us/en/p/malm-bed-frame-high-white-luroey-s09009475/",
    category: "bed",
    description: "Bed frame, high, white, Queen",
    brand: "IKEA"
  },
  {
    id: "ikea-003",
    name: "POÄNG Armchair",
    price: {
      amount: 119.99,
      currency: "USD"
    },
    dimensions: {
      width: 0.68,
      height: 1.0,
      depth: 0.82
    },
    imageUrl: "https://www.ikea.com/us/en/images/products/poaeng-armchair-birch-veneer-knisa-light-beige__0571501_pe566690_s5.jpg",
    productUrl: "https://www.ikea.com/us/en/p/poaeng-armchair-birch-veneer-knisa-light-beige-s99305926/",
    category: "chair",
    description: "Armchair, birch veneer/Knisa light beige",
    brand: "IKEA"
  }
];

// Categories for filtering
const PRODUCT_CATEGORIES = [
  "all",
  "bookcase",
  "bed",
  "chair",
  "table",
  "sofa",
  "storage",
  "lighting"
];

const IkeaCatalogPanel: React.FC = () => {
  const { addFurniture } = useDesign();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Mock API search - this would be replaced with actual API calls
  const searchResults = SAMPLE_PRODUCTS.filter(product => {
    // Filter by category
    const categoryMatch = selectedCategory === "all" || product.category === selectedCategory;
    
    // Filter by search query
    const queryMatch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                     product.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && queryMatch;
  });
  
  // Handle selecting a product
  const handleSelectProduct = (product: IkeaProduct) => {
    // Convert IKEA product to furniture
    const furniture = {
      type: product.name,
      position: { x: 0, y: product.dimensions.height / 2, z: 0 },
      rotation: 0,
      color: "#FFFFFF", // Default color
      scale: 1,
      isFixed: false, // IKEA furniture is not fixed to walls/floors
      ikeaProductId: product.id,
      productInfo: {
        name: product.name,
        brand: product.brand,
        price: product.price.amount,
        currency: product.price.currency,
        url: product.productUrl,
        dimensions: {
          width: product.dimensions.width,
          height: product.dimensions.height,
          depth: product.dimensions.depth
        }
      }
    };
    
    // Add to the room
    addFurniture(furniture);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">IKEA Catalog</h3>
      </div>
      
      {/* Search bar */}
      <div className="flex gap-2">
        <Input
          placeholder="Search for furniture..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
      
      {/* Category filter */}
      <div>
        <label className="text-sm text-muted-foreground mb-2 block">
          Filter by Category
        </label>
        <Select 
          value={selectedCategory} 
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {PRODUCT_CATEGORIES.map(category => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Separator />
      
      {/* Product list */}
      <ScrollArea className="h-[350px] rounded-md border p-4">
        {searchResults.length > 0 ? (
          searchResults.map(product => (
            <Card key={product.id} className="p-3 mb-3 hover:bg-accent/10 transition-colors">
              <div className="text-sm font-medium mb-1">{product.name}</div>
              <div className="text-xs text-muted-foreground mb-2">{product.description}</div>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div className="text-xs">
                  <span className="font-medium">Price: </span>
                  {product.price.amount} {product.price.currency}
                </div>
                <div className="text-xs">
                  <span className="font-medium">Size: </span>
                  {product.dimensions.width}×{product.dimensions.height}×{product.dimensions.depth}m
                </div>
              </div>
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs h-7 px-2 w-[48%]"
                  onClick={() => window.open(product.productUrl, '_blank')}
                >
                  View on IKEA
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  className="text-xs h-7 px-2 w-[48%]"
                  onClick={() => handleSelectProduct(product)}
                >
                  Add to Room
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No products found matching your criteria.
          </div>
        )}
        
        {/* API Connection Notice */}
        <div className="mt-4 p-3 border border-yellow-200 bg-yellow-50 text-yellow-700 rounded-md text-xs">
          <p className="font-medium">⚠️ Using demo data</p>
          <p className="mt-1">
            This panel is showing sample data. To connect to the real IKEA API, 
            an API key needs to be provided and configured in the application.
          </p>
        </div>
      </ScrollArea>
      
      <div className="text-xs text-muted-foreground">
        <p>IKEA furniture is placed in the room as movable objects. You can reposition them after adding.</p>
      </div>
    </div>
  );
};

export default IkeaCatalogPanel;