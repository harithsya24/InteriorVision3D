import { useState, useEffect } from "react";
import { useDesign, Furniture } from "../lib/stores/useDesign";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";

const MAX_RECENT_ITEMS = 8;

const RecentlyUsedPanel: React.FC = () => {
  const { roomData, addFurniture } = useDesign();
  const [recentItems, setRecentItems] = useState<Furniture[]>([]);
  
  // Update recently used items when furniture is added
  useEffect(() => {
    // Only track non-fixed furniture
    const nonFixedFurniture = roomData.furniture.filter(item => !item.isFixed);
    
    // Get the most recently added items
    const newRecentItems = [...nonFixedFurniture].reverse().slice(0, MAX_RECENT_ITEMS);
    
    // Remove duplicates based on furniture type
    const uniqueItems: Furniture[] = [];
    const types = new Set<string>();
    
    newRecentItems.forEach(item => {
      if (!types.has(item.type)) {
        types.add(item.type);
        uniqueItems.push(item);
      }
    });
    
    setRecentItems(uniqueItems);
  }, [roomData.furniture]);
  
  // Add a copy of the furniture with a slight offset
  const addCopy = (item: Furniture) => {
    // Create a copy with a slightly different position
    const copy: Furniture = {
      ...item,
      position: {
        x: item.position.x + 0.5,
        y: item.position.y,
        z: item.position.z + 0.5
      },
      isFixed: false // Ensure the copy is not fixed
    };
    
    addFurniture(copy);
  };
  
  // Render a preview of the furniture item
  const renderItemPreview = (item: Furniture) => {
    const itemTypeFormatted = item.type.charAt(0).toUpperCase() + item.type.slice(1);
    
    return (
      <div className="flex flex-col items-center">
        <div
          className="w-10 h-10 rounded border"
          style={{ backgroundColor: item.color }}
        />
        <div className="text-xs mt-1 text-center">{itemTypeFormatted}</div>
      </div>
    );
  };
  
  if (recentItems.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>No recently used furniture items</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      <Label>Recently Used Items</Label>
      
      <ScrollArea className="h-40">
        <div className="grid grid-cols-4 gap-2">
          {recentItems.map((item, index) => (
            <Button
              key={`recent-${index}`}
              variant="outline"
              className="h-auto p-2 flex flex-col items-center"
              onClick={() => addCopy(item)}
            >
              {renderItemPreview(item)}
            </Button>
          ))}
        </div>
      </ScrollArea>
      
      <div className="text-xs text-muted-foreground text-center">
        <p>Click an item to add a copy to your room</p>
      </div>
    </div>
  );
};

export default RecentlyUsedPanel;