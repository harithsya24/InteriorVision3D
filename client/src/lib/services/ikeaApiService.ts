import { Furniture } from "../stores/useDesign";

// Interfaces for IKEA API responses
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

interface SearchResponse {
  products: IkeaProduct[];
  totalCount: number;
  nextPage?: string;
}

// Mock IKEA API service since we don't have actual API access
export const IkeaApiService = {
  // This would normally make API calls to IKEA's API
  async searchProducts(
    query: string,
    category?: string,
    page = 1,
    limit = 20
  ): Promise<SearchResponse> {
    console.log(`Searching IKEA products: ${query}, category: ${category || 'all'}`);
    
    // For now, we'll return mock data
    // In a real implementation, this would be:
    // const response = await fetch(`${IKEA_API_URL}/products?query=${query}&category=${category}&page=${page}&limit=${limit}`, {
    //   headers: {
    //     'Authorization': `Bearer ${IKEA_API_KEY}`
    //   }
    // });
    // return await response.json();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      products: mockIkeaProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        (category && product.category.toLowerCase().includes(category.toLowerCase()))
      ).slice((page - 1) * limit, page * limit),
      totalCount: mockIkeaProducts.length,
      nextPage: mockIkeaProducts.length > page * limit ? `page=${page + 1}` : undefined
    };
  },
  
  async getProductById(id: string): Promise<IkeaProduct | null> {
    console.log(`Getting IKEA product details: ${id}`);
    
    // In a real implementation, this would be:
    // const response = await fetch(`${IKEA_API_URL}/products/${id}`, {
    //   headers: {
    //     'Authorization': `Bearer ${IKEA_API_KEY}`
    //   }
    // });
    // return await response.json();
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const product = mockIkeaProducts.find(p => p.id === id);
    return product || null;
  },
  
  // Convert IKEA product to our Furniture type
  mapProductToFurniture(product: IkeaProduct, position = { x: 0, y: 0, z: 0 }, rotation = 0): Furniture {
    return {
      type: getCategoryFurnitureType(product.category),
      position,
      rotation,
      color: "#FFFFFF", // Default color, would need color mapping
      scale: 1,
      isFixed: false, // IKEA products are movable by definition
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

// Helper to map IKEA categories to our furniture types
function getCategoryFurnitureType(category: string): string {
  const categoryMap: { [key: string]: string } = {
    'sofa': 'sofa',
    'chair': 'chair',
    'table': 'table',
    'desk': 'desk',
    'bed': 'bed',
    'shelf': 'bookshelf',
    'storage': 'cabinet',
    'lighting': 'lamp',
    'decoration': 'plant',
    'rug': 'rug'
  };
  
  for (const [key, value] of Object.entries(categoryMap)) {
    if (category.toLowerCase().includes(key)) {
      return value;
    }
  }
  
  return 'cabinet'; // Default type
}

// Mock IKEA product data for development
const mockIkeaProducts: IkeaProduct[] = [
  {
    id: "s99326250",
    name: "RÅVAROR Sofa bed",
    price: {
      amount: 649.00,
      currency: "USD"
    },
    dimensions: {
      width: 90,
      height: 83,
      depth: 103
    },
    imageUrl: "/images/sofa.jpg",
    productUrl: "https://www.ikea.com/products/s99326250",
    category: "sofa",
    description: "Sofa by day, bed by night. RÅVAROR sofa bed has pocket springs that give support where needed and follows your body during the night.",
    brand: "IKEA"
  },
  {
    id: "s59325644",
    name: "STRANDMON Wing chair",
    price: {
      amount: 329.00,
      currency: "USD"
    },
    dimensions: {
      width: 82,
      height: 101,
      depth: 96
    },
    imageUrl: "/images/chair.jpg",
    productUrl: "https://www.ikea.com/products/s59325644",
    category: "chair",
    description: "You can really loosen up and relax in comfort because the high back on this chair provides extra support for your neck.",
    brand: "IKEA"
  },
  {
    id: "s29422817",
    name: "MALM Bed frame, high",
    price: {
      amount: 279.00,
      currency: "USD"
    },
    dimensions: {
      width: 209,
      height: 100,
      depth: 176
    },
    imageUrl: "/images/bed.jpg",
    productUrl: "https://www.ikea.com/products/s29422817",
    category: "bed",
    description: "A clean design with solid wood veneer. Place the bed freestanding or with the headboard against a wall.",
    brand: "IKEA"
  },
  {
    id: "s99222619",
    name: "BILLY Bookcase",
    price: {
      amount: 69.99,
      currency: "USD"
    },
    dimensions: {
      width: 80,
      height: 202,
      depth: 28
    },
    imageUrl: "/images/bookcase.jpg",
    productUrl: "https://www.ikea.com/products/s99222619",
    category: "shelf",
    description: "It is estimated that every five seconds, one BILLY bookcase is sold somewhere in the world.",
    brand: "IKEA"
  },
  {
    id: "s39213566",
    name: "LISABO Table",
    price: {
      amount: 199.00,
      currency: "USD"
    },
    dimensions: {
      width: 140,
      height: 74,
      depth: 80
    },
    imageUrl: "/images/table.jpg",
    productUrl: "https://www.ikea.com/products/s39213566",
    category: "table",
    description: "The ash veneer gives a warm, natural feeling to your room.",
    brand: "IKEA"
  },
  {
    id: "s39297648",
    name: "BEKANT Desk",
    price: {
      amount: 249.00,
      currency: "USD"
    },
    dimensions: {
      width: 160,
      height: 74,
      depth: 80
    },
    imageUrl: "/images/desk.jpg",
    productUrl: "https://www.ikea.com/products/s39297648",
    category: "desk",
    description: "10-year guarantee. Read about the terms in the guarantee brochure.",
    brand: "IKEA"
  },
  {
    id: "s49336180",
    name: "STOCKHOLM Rug, flatwoven",
    price: {
      amount: 299.00,
      currency: "USD"
    },
    dimensions: {
      width: 250,
      height: 1,
      depth: 350
    },
    imageUrl: "/images/rug.jpg",
    productUrl: "https://www.ikea.com/products/s49336180",
    category: "rug",
    description: "The rug is hand-woven by skilled craftspeople, and each one has a unique look.",
    brand: "IKEA"
  },
  {
    id: "s59419219",
    name: "BESTÅ Storage combination with doors",
    price: {
      amount: 380.00,
      currency: "USD"
    },
    dimensions: {
      width: 180,
      height: 74,
      depth: 42
    },
    imageUrl: "/images/storage.jpg",
    productUrl: "https://www.ikea.com/products/s59419219",
    category: "storage",
    description: "Smooth-running drawers with drawer stops.",
    brand: "IKEA"
  },
  {
    id: "s89251255",
    name: "SYMFONISK Table lamp with WiFi speaker",
    price: {
      amount: 189.00,
      currency: "USD"
    },
    dimensions: {
      width: 21,
      height: 40,
      depth: 21
    },
    imageUrl: "/images/lamp.jpg",
    productUrl: "https://www.ikea.com/products/s89251255",
    category: "lighting",
    description: "This lamp creates a nice mood light – and streams music as well!",
    brand: "IKEA"
  },
  {
    id: "s90418078",
    name: "FEJKA Artificial potted plant",
    price: {
      amount: 4.99,
      currency: "USD"
    },
    dimensions: {
      width: 12,
      height: 35,
      depth: 12
    },
    imageUrl: "/images/plant.jpg",
    productUrl: "https://www.ikea.com/products/s90418078",
    category: "decoration",
    description: "Lifelike artificial plant that remains looking fresh year after year.",
    brand: "IKEA"
  }
];