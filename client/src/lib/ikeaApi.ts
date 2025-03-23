import { Furniture } from './stores/useDesign';

// Interface for IKEA product data
export interface IkeaProduct {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  productUrl: string;
  type: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  color: string;
}

// Make sure we have an IKEA API key
let ikeaApiKey: string | null = null;

export const setIkeaApiKey = (key: string) => {
  ikeaApiKey = key;
};

export const getIkeaApiKey = () => {
  return ikeaApiKey;
};

// Function to search IKEA products 
export const searchIkeaProducts = async (query: string, category?: string): Promise<IkeaProduct[]> => {
  if (!ikeaApiKey) {
    console.warn('IKEA API key not set. Please configure API key to access IKEA products.');
    return []; // Return empty array if no API key
  }
  
  try {
    // This would be a real API call in production
    // const response = await fetch(`https://api.ikea.com/catalog/search?q=${query}&category=${category || ''}`, {
    //   headers: {
    //     'Authorization': `Bearer ${ikeaApiKey}`
    //   }
    // });
    // return await response.json();
    
    // For now, return mock data
    console.log(`Searching IKEA for "${query}" in category "${category || 'all'}"`);
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Return sample results (this would be real data from the API)
    return getMockIkeaProducts(query, category);
  } catch (error) {
    console.error('Error searching IKEA products:', error);
    return [];
  }
};

// Function to get IKEA product details by ID
export const getIkeaProductById = async (productId: string): Promise<IkeaProduct | null> => {
  if (!ikeaApiKey) {
    console.warn('IKEA API key not set. Please configure API key to access IKEA products.');
    return null;
  }
  
  try {
    // This would be a real API call in production
    // const response = await fetch(`https://api.ikea.com/catalog/products/${productId}`, {
    //   headers: {
    //     'Authorization': `Bearer ${ikeaApiKey}`
    //   }
    // });
    // return await response.json();
    
    // For now, return mock data
    console.log(`Getting IKEA product details for ID "${productId}"`);
    
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find product in mock data
    const allProducts = getAllMockProducts();
    const product = allProducts.find(p => p.id === productId);
    
    return product || null;
  } catch (error) {
    console.error('Error getting IKEA product details:', error);
    return null;
  }
};

// Convert IKEA product to furniture item for our app
export const ikeaProductToFurniture = (product: IkeaProduct, position = { x: 0, y: 0, z: 0 }, rotation = 0): Furniture => {
  return {
    type: mapIkeaTypeToFurnitureType(product.type),
    position,
    rotation,
    color: product.color,
    scale: 1,
    isFixed: false,
    ikeaProductId: product.id,
    productName: product.name,
    productPrice: product.price,
    productUrl: product.productUrl,
    dimensions: product.dimensions
  };
};

// Map IKEA product types to our furniture types
const mapIkeaTypeToFurnitureType = (ikeaType: string): string => {
  const typeMap: Record<string, string> = {
    'sofa': 'sofa',
    'armchair': 'sofa',
    'coffee table': 'table',
    'dining table': 'table',
    'desk': 'desk',
    'chair': 'chair',
    'bed': 'bed',
    'bookcase': 'bookshelf',
    'lamp': 'lamp',
    'wardrobe': 'cabinet',
    'cabinet': 'cabinet',
    'shelf': 'bookshelf',
    'plant': 'plant',
    'rug': 'rug'
  };
  
  return typeMap[ikeaType.toLowerCase()] || 'table';
};

// Note: In a real implementation, the functions below would be replaced with actual API calls
// These are just for demonstration purposes

// Sample mock products for development purposes
const getMockIkeaProducts = (query: string, category?: string): IkeaProduct[] => {
  const allProducts = getAllMockProducts();
  
  // Filter by search query and category
  return allProducts.filter(product => {
    const matchesQuery = product.name.toLowerCase().includes(query.toLowerCase()) ||
                         product.type.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = !category || product.type.toLowerCase().includes(category.toLowerCase());
    
    return matchesQuery && matchesCategory;
  }).slice(0, 10); // Limit to 10 results
};

// Mock product database
const getAllMockProducts = (): IkeaProduct[] => {
  return [
    {
      id: 'ikea-001',
      name: 'KIVIK Sofa',
      price: 699,
      imageUrl: '/ikea/kivik-sofa.jpg',
      productUrl: 'https://www.ikea.com/products/kivik-sofa',
      type: 'sofa',
      dimensions: { width: 2.28, height: 0.83, depth: 0.95 },
      color: '#CCCCCC'
    },
    {
      id: 'ikea-002',
      name: 'POÄNG Armchair',
      price: 199,
      imageUrl: '/ikea/poang-chair.jpg',
      productUrl: 'https://www.ikea.com/products/poang-armchair',
      type: 'chair',
      dimensions: { width: 0.68, height: 1.05, depth: 0.82 },
      color: '#8B4513'
    },
    {
      id: 'ikea-003',
      name: 'LACK Coffee Table',
      price: 49.99,
      imageUrl: '/ikea/lack-table.jpg',
      productUrl: 'https://www.ikea.com/products/lack-coffee-table',
      type: 'coffee table',
      dimensions: { width: 0.9, height: 0.45, depth: 0.55 },
      color: '#000000'
    },
    {
      id: 'ikea-004',
      name: 'MALM Bed Frame',
      price: 349,
      imageUrl: '/ikea/malm-bed.jpg',
      productUrl: 'https://www.ikea.com/products/malm-bed-frame',
      type: 'bed',
      dimensions: { width: 1.68, height: 0.38, depth: 2.09 },
      color: '#FFFFFF'
    },
    {
      id: 'ikea-005',
      name: 'BILLY Bookcase',
      price: 129,
      imageUrl: '/ikea/billy-bookcase.jpg',
      productUrl: 'https://www.ikea.com/products/billy-bookcase',
      type: 'bookcase',
      dimensions: { width: 0.8, height: 2.02, depth: 0.28 },
      color: '#F5F5DC'
    },
    {
      id: 'ikea-006',
      name: 'KALLAX Shelf Unit',
      price: 119,
      imageUrl: '/ikea/kallax-shelf.jpg',
      productUrl: 'https://www.ikea.com/products/kallax-shelf-unit',
      type: 'shelf',
      dimensions: { width: 1.47, height: 1.47, depth: 0.39 },
      color: '#F5F5F5'
    },
    {
      id: 'ikea-007',
      name: 'HEMNES Dresser',
      price: 249,
      imageUrl: '/ikea/hemnes-dresser.jpg',
      productUrl: 'https://www.ikea.com/products/hemnes-dresser',
      type: 'cabinet',
      dimensions: { width: 1.08, height: 0.96, depth: 0.5 },
      color: '#5F4B32'
    },
    {
      id: 'ikea-008',
      name: 'VITTSJÖ TV Unit',
      price: 99,
      imageUrl: '/ikea/vittsjo-tv-unit.jpg', 
      productUrl: 'https://www.ikea.com/products/vittsjo-tv-unit',
      type: 'cabinet',
      dimensions: { width: 1.5, height: 0.47, depth: 0.4 },
      color: '#000000'
    },
    {
      id: 'ikea-009',
      name: 'LISABO Dining Table',
      price: 299,
      imageUrl: '/ikea/lisabo-table.jpg',
      productUrl: 'https://www.ikea.com/products/lisabo-dining-table',
      type: 'dining table',
      dimensions: { width: 1.4, height: 0.74, depth: 0.8 },
      color: '#D2B48C'
    },
    {
      id: 'ikea-010',
      name: 'STOCKHOLM Rug',
      price: 299,
      imageUrl: '/ikea/stockholm-rug.jpg',
      productUrl: 'https://www.ikea.com/products/stockholm-rug',
      type: 'rug',
      dimensions: { width: 2.7, height: 0.01, depth: 1.8 },
      color: '#708090'
    },
    {
      id: 'ikea-011',
      name: 'FEJKA Artificial plant',
      price: 5.99,
      imageUrl: '/ikea/fejka-plant.jpg',
      productUrl: 'https://www.ikea.com/products/fejka-artificial-plant',
      type: 'plant',
      dimensions: { width: 0.12, height: 0.35, depth: 0.12 },
      color: '#228B22'
    },
    {
      id: 'ikea-012',
      name: 'HEKTAR Floor lamp',
      price: 69.99,
      imageUrl: '/ikea/hektar-lamp.jpg',
      productUrl: 'https://www.ikea.com/products/hektar-floor-lamp',
      type: 'lamp',
      dimensions: { width: 0.31, height: 1.81, depth: 0.31 },
      color: '#2F4F4F'
    }
  ];
};