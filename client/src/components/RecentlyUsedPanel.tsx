import { useState, useEffect } from "react";
import { useDesign, Furniture } from "../lib/stores/useDesign";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

const MAX_RECENT_ITEMS = 8;

const RecentlyUsedPanel: React.FC = () => {
  const { roomData, addFurniture } = useDesign();
  const [recentItems, setRecentItems] = useState<Furniture[]>([]);

  // Initialize and update recent items when furniture changes
  useEffect(() => {
    const items = [...roomData.furniture].reverse().slice(0, MAX_RECENT_ITEMS);
    
    // Remove duplicate furniture items based on type
    const uniqueItems: Furniture[] = [];
    const types = new Set<string>();
    
    items.forEach(item => {
      if (!types.has(item.type)) {
        types.add(item.type);
        uniqueItems.push(item);
      }
    });
    
    setRecentItems(uniqueItems);
  }, [roomData.furniture]);

  // Add a copy of the selected item
  const addCopy = (item: Furniture) => {
    // Create a new position slightly offset from the original
    const offset = 0.3;
    const position = {
      x: item.position.x + offset,
      y: item.position.y,
      z: item.position.z + offset
    };
    
    // Create a copy of the furniture item with the new position
    const copy: Furniture = {
      ...item,
      position,
      isFixed: false // Make sure copy is movable
    };
    
    addFurniture(copy);
  };

  // Render a preview of a furniture item
  const renderItemPreview = (item: Furniture) => {
    return (
      <Card key={`recent-${item.type}-${item.position.x}-${item.position.y}`} className="p-3 mb-2 bg-card hover:bg-accent/10 transition-colors">
        <div className="text-xs font-medium mb-1">{item.type}</div>
        <div className="flex justify-between items-center">
          <div className="w-6 h-6 rounded-full" style={{ backgroundColor: item.color }} />
          <div className="text-xs text-muted-foreground">
            {item.ikeaProductId ? 'IKEA' : item.isFixed ? 'Fixed' : 'Custom'}
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-7 px-2"
            onClick={() => addCopy(item)}
          >
            Add Copy
          </Button>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Recently Used Items</h3>
      </div>
      
      <ScrollArea className="h-[300px] rounded-md border p-4">
        {recentItems.length > 0 ? (
          recentItems.map(renderItemPreview)
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No recently used items yet.
            <p className="text-xs mt-2">
              Add furniture items to see them here.
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default RecentlyUsedPanel;