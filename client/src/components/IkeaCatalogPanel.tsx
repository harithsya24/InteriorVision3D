import { useState } from "react";
import { useDesign } from "../lib/stores/useDesign";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";
import { Search } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

// Mock IKEA products (in a real implementation, this would come from an API)
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
  color: string;
}

const MOCK_IKEA_PRODUCTS: IkeaProduct[] = [
  {
    id: "prod001",
    name: "MALM",
    price: { amount: 179, currency: "USD" },
    dimensions: { width: 2.0, height: 0.5, depth: 1.6 },
    imageUrl: "https://www.ikea.com/placeholder-image.jpg",
    productUrl: "https://www.ikea.com/product/malm",
    category: "beds",
    description: "Bed frame, high, white, Queen",
    brand: "IKEA",
    color: "#FFFFFF"
  },
  {
    id: "prod002",
    name: "BILLY",
    price: { amount: 59, currency: "USD" },
    dimensions: { width: 0.8, height: 2.0, depth: 0.28 },
    imageUrl: "https://www.ikea.com/placeholder-image.jpg",
    productUrl: "https://www.ikea.com/product/billy",
    category: "bookcases",
    description: "Bookcase, white, 31 1/2x11x79 1/2",
    brand: "IKEA",
    color: "#FFFFFF"
  },
  {
    id: "prod003",
    name: "POÄNG",
    price: { amount: 99, currency: "USD" },
    dimensions: { width: 0.68, height: 1.0, depth: 0.82 },
    imageUrl: "https://www.ikea.com/placeholder-image.jpg",
    productUrl: "https://www.ikea.com/product/poang",
    category: "chairs",
    description: "Armchair, birch veneer, Knisa light beige",
    brand: "IKEA",
    color: "#F5DEB3"
  },
  {
    id: "prod004",
    name: "KALLAX",
    price: { amount: 129, currency: "USD" },
    dimensions: { width: 1.47, height: 1.47, depth: 0.39 },
    imageUrl: "https://www.ikea.com/placeholder-image.jpg",
    productUrl: "https://www.ikea.com/product/kallax",
    category: "shelving_units",
    description: "Shelving unit, white, 57 7/8x57 7/8",
    brand: "IKEA",
    color: "#FFFFFF"
  },
  {
    id: "prod005",
    name: "STOCKHOLM",
    price: { amount: 399, currency: "USD" },
    dimensions: { width: 2.1, height: 0.9, depth: 0.8 },
    imageUrl: "https://www.ikea.com/placeholder-image.jpg",
    productUrl: "https://www.ikea.com/product/stockholm",
    category: "sofas",
    description: "Sofa, Seglora natural, 83 1/8\"",
    brand: "IKEA",
    color: "#8B4513"
  }
];

const CATEGORIES = [
  { id: "all", name: "All Items" },
  { id: "sofas", name: "Sofas & Armchairs" },
  { id: "tables", name: "Tables & Desks" },
  { id: "chairs", name: "Chairs" },
  { id: "beds", name: "Beds" },
  { id: "storage", name: "Storage & Organization" }
];

const IkeaCatalogPanel: React.FC = () => {
  const { addFurniture } = useDesign();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [products, setProducts] = useState<IkeaProduct[]>(MOCK_IKEA_PRODUCTS);
  
  // Handle product search
  const handleSearch = () => {
    const filteredProducts = MOCK_IKEA_PRODUCTS.filter(product => {
      const matchesQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
      
      return matchesQuery && matchesCategory;
    });
    
    setProducts(filteredProducts);
  };
  
  // Handle category selection
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    
    if (category === "all") {
      setProducts(MOCK_IKEA_PRODUCTS);
    } else {
      const filteredProducts = MOCK_IKEA_PRODUCTS.filter(product => 
        product.category === category
      );
      setProducts(filteredProducts);
    }
  };
  
  // Handle selecting an IKEA product
  const handleSelectProduct = (product: IkeaProduct) => {
    const furniture = {
      type: product.name,
      position: {
        x: 0,
        y: product.dimensions.height / 2, // Position at floor level
        z: 0
      },
      rotation: 0,
      color: product.color,
      scale: 1,
      isFixed: false,
      ikeaProductId: product.id,
      productInfo: {
        name: product.name,
        brand: product.brand,
        price: product.price.amount,
        currency: product.price.currency,
        url: product.productUrl,
        dimensions: product.dimensions
      }
    };
    
    addFurniture(furniture);
  };
  
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="search-query">Search IKEA Catalog</Label>
        <div className="flex gap-2 mt-1">
          <Input
            id="search-query"
            placeholder="Search by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" onValueChange={handleCategoryChange}>
        <div className="overflow-x-auto">
          <TabsList className="w-max">
            {CATEGORIES.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="px-4"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>
        
        {CATEGORIES.map(category => (
          <TabsContent key={`content-${category.id}`} value={category.id}>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-3">
                {products.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <p>No products found. Try a different search or category.</p>
                  </div>
                ) : (
                  products.map(product => (
                    <div
                      key={product.id}
                      className="border rounded-md p-3 hover:border-primary/50 transition-colors cursor-pointer"
                      onClick={() => handleSelectProduct(product)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 bg-muted flex items-center justify-center rounded">
                          <span className="text-2xl">🪑</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <h4 className="font-medium">{product.name}</h4>
                            <span className="font-medium">${product.price.amount}</span>
                          </div>
                          <p className="text-muted-foreground text-sm">{product.description}</p>
                          <div className="flex justify-between items-center mt-1">
                            <div className="text-xs text-muted-foreground">
                              {product.dimensions.width}m × {product.dimensions.height}m × {product.dimensions.depth}m
                            </div>
                            <Button variant="ghost" size="sm" className="h-7 text-xs">Add to room</Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="text-center text-xs text-muted-foreground">
        <p>Note: This is a demo with sample IKEA products. In a real implementation, this would connect to the IKEA API.</p>
      </div>
    </div>
  );
};

export default IkeaCatalogPanel;