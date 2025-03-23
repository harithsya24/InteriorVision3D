import React, { useState, useEffect } from 'react';
import { useDesign, Furniture } from '../lib/stores/useDesign';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

const RecentlyUsedPanel: React.FC = () => {
  const [recentItems, setRecentItems] = useState<Furniture[]>([]);
  const furniture = useDesign(state => state.roomData.furniture);
  const addFurniture = useDesign(state => state.addFurniture);
  
  // Update the recent items list when furniture changes
  useEffect(() => {
    // Get the last 5 unique furniture types added
    const uniqueTypes = new Map<string, Furniture>();
    
    // Iterate backwards to get the most recent items first
    for (let i = furniture.length - 1; i >= 0; i--) {
      const item = furniture[i];
      const key = item.isFixed ? `fixed-${item.type}` : item.type;
      
      // Only add if we don't already have this type
      if (!uniqueTypes.has(key) && uniqueTypes.size < 5) {
        uniqueTypes.set(key, item);
      }
      
      // Stop once we have 5 items
      if (uniqueTypes.size >= 5) break;
    }
    
    setRecentItems(Array.from(uniqueTypes.values()));
  }, [furniture]);
  
  // Function to add a copy of an item
  const addCopy = (item: Furniture) => {
    // Create a deep copy of the item and place it in the center of the room
    const copy: Furniture = {
      ...item,
      position: { x: 0, y: 0, z: 0 },
      rotation: 0
    };
    
    addFurniture(copy);
  };
  
  // Render a preview of the item
  const renderItemPreview = (item: Furniture) => {
    return (
      <div className="w-12 h-12 bg-muted flex items-center justify-center rounded">
        <div className="text-xs text-center text-muted-foreground">
          {item.isFixed ? 'Fixed' : ''} {item.type}
        </div>
      </div>
    );
  };
  
  if (recentItems.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No recently used items yet. Add some furniture to see them here.
      </div>
    );
  }
  
  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4">Recently Used</h3>
      
      <ScrollArea className="h-[200px]">
        <div className="space-y-3">
          {recentItems.map((item, index) => (
            <Card key={index} className="p-3 flex items-center gap-3">
              {renderItemPreview(item)}
              <div className="flex-1">
                <div className="font-medium">
                  {item.isFixed ? 'Fixed ' : ''}{item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                </div>
                {item.productInfo?.name && (
                  <div className="text-xs text-muted-foreground">{item.productInfo.name}</div>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => addCopy(item)}>
                Add
              </Button>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default RecentlyUsedPanel;