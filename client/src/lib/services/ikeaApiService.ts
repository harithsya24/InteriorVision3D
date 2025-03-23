import { Furniture } from "../stores/useDesign";

// IKEA API product interface
interface IkeaProduct {
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

// API response interface
interface SearchResponse {
  products: IkeaProduct[];
  totalCount: number;
  nextPage?: string;
}

// Store API key
let apiKey = "";

// IKEA API service
export const IkeaApiService = {
  // Set API key
  setApiKey(key: string) {
    apiKey = key;
  },
  
  // Get API key
  getApiKey() {
    return apiKey;
  },
  
  // Check if API key is set
  hasApiKey() {
    return !!apiKey;
  },
  
  // Search for products
  async searchProducts(
    query: string, 
    category?: string, 
    page: number = 1, 
    pageSize: number = 10
  ): Promise<SearchResponse> {
    // For now, return mock data if no API key is set
    if (!apiKey) {
      // Return empty result with warning
      console.warn("IKEA API key not set. Using mock data.");
      return {
        products: [],
        totalCount: 0
      };
    }
    
    try {
      // In a real implementation, this would connect to the IKEA API
      // using the provided API key
      const url = `https://api.ikea.com/products/search?query=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}${category ? `&category=${category}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`IKEA API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error searching IKEA products:", error);
      throw error;
    }
  },
  
  // Get specific product by ID
  async getProductById(id: string): Promise<IkeaProduct | null> {
    // For now, return null if no API key is set
    if (!apiKey) {
      console.warn("IKEA API key not set. Unable to fetch product details.");
      return null;
    }
    
    try {
      // In a real implementation, this would connect to the IKEA API
      const url = `https://api.ikea.com/products/${id}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        if (response.status === 404) {
          return null; // Product not found
        }
        throw new Error(`IKEA API error: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching IKEA product ${id}:`, error);
      throw error;
    }
  },
  
  // Map IKEA product to furniture object for the room
  mapProductToFurniture(product: IkeaProduct, position = { x: 0, y: 0, z: 0 }, rotation = 0): Furniture {
    return {
      type: product.name,
      position,
      rotation,
      color: "#FFFFFF", // Default color
      scale: 1,
      isFixed: false, // IKEA products are not fixed elements
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
  }
};

// Helper function to map IKEA category to furniture type
function getCategoryFurnitureType(category: string): string {
  const categoryMap: Record<string, string> = {
    "chairs": "Chair",
    "sofas": "Sofa",
    "tables": "Table",
    "beds": "Bed",
    "storage": "Storage",
    "bookcases": "Bookcase",
    "cabinets": "Cabinet",
    "desks": "Desk",
    "lighting": "Lamp"
  };
  
  return categoryMap[category.toLowerCase()] || "Furniture";
}