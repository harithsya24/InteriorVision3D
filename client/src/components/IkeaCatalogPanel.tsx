import React, { useState, useEffect } from 'react';
import { IkeaApiService } from '../lib/services/ikeaApiService';
import { useDesign } from '../lib/stores/useDesign';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Card } from './ui/card';

// Export the interface for use in other components
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

const IkeaCatalogPanel: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('');
  const [searchResults, setSearchResults] = useState<IkeaProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const addFurniture = useDesign(state => state.addFurniture);

  // Categories for the dropdown
  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'sofa', label: 'Sofas' },
    { value: 'chair', label: 'Chairs' },
    { value: 'table', label: 'Tables' },
    { value: 'desk', label: 'Desks' },
    { value: 'bed', label: 'Beds' },
    { value: 'shelf', label: 'Shelves & Storage' },
    { value: 'lighting', label: 'Lighting' },
    { value: 'decoration', label: 'Decoration' },
    { value: 'rug', label: 'Rugs' }
  ];

  // Search for products when query or category changes
  const handleSearch = async () => {
    if (!searchQuery && !category) return;
    
    setIsLoading(true);
    try {
      const response = await IkeaApiService.searchProducts(searchQuery, category);
      setSearchResults(response.products);
    } catch (error) {
      console.error('Error searching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle selecting a product
  const handleSelectProduct = (product: IkeaProduct) => {
    setSelectedProductId(product.id);
    
    // Center of the room
    const furniture = IkeaApiService.mapProductToFurniture(
      product, 
      { x: 0, y: 0, z: 0 },
      0
    );
    
    // Add the furniture to the room
    addFurniture(furniture);
  };

  return (
    <div className="p-4 bg-background rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">IKEA Catalog</h3>
      
      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Search furniture..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} disabled={isLoading}>
            {isLoading ? 'Searching...' : 'Search'}
          </Button>
        </div>
        
        <select
          className="w-full p-2 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
        
        <Separator />
        
        <div className="flex flex-col space-y-4 max-h-96 overflow-y-auto">
          {searchResults.length === 0 ? (
            <p className="text-muted-foreground italic">
              {isLoading ? 'Searching for products...' : 'No products found. Try a different search.'}
            </p>
          ) : (
            searchResults.map(product => (
              <Card
                key={product.id}
                className={`p-4 cursor-pointer transition-colors hover:bg-muted ${
                  selectedProductId === product.id ? 'border-primary' : ''
                }`}
                onClick={() => handleSelectProduct(product)}
              >
                <div className="flex items-start gap-4">
                  <div className="w-20 h-20 bg-muted flex items-center justify-center rounded">
                    {/* Placeholder for product image */}
                    <div className="text-xs text-center text-muted-foreground">
                      {product.category}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {product.price.amount} {product.price.currency}
                    </p>
                    <p className="text-xs mt-1">
                      {product.dimensions.width} × {product.dimensions.depth} × {product.dimensions.height} cm
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default IkeaCatalogPanel;