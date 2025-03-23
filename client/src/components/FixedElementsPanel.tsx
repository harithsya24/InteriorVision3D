import { useState } from "react";
import { useDesign } from "../lib/stores/useDesign";
import { FixedElementsService, FixedElementType } from "../lib/services/fixedElementsService";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const FixedElementsPanel: React.FC = () => {
  const { addFurniture } = useDesign();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Get all available fixed elements
  const allElements = FixedElementsService.getAvailableFixedElements();
  
  // Get unique categories for filtering
  const uniqueCategories = Array.from(new Set(allElements.map(item => item.category)));
  const categories = ["all", ...uniqueCategories];
  
  // Filter elements by selected category
  const filteredElements = selectedCategory === "all" 
    ? allElements 
    : allElements.filter(item => item.category === selectedCategory);
  
  // Handle element selection
  const handleSelectElement = (element: FixedElementType) => {
    // Create a furniture item from the fixed element
    // Place at default position - users can move it later
    const furniture = FixedElementsService.createFixedFurniture(
      element,
      { x: 0, y: element.defaultDimensions.height / 2, z: 0 },
      0, // Default rotation
      "#FFFFFF" // Default color
    );
    
    // Add to the room
    addFurniture(furniture);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Fixed Architectural Elements</h3>
      </div>
      
      {/* Category filter */}
      <div className="mb-4">
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
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Separator />
      
      {/* Elements list */}
      <ScrollArea className="h-[350px] rounded-md border p-4">
        {filteredElements.map(element => (
          <Card key={element.id} className="p-3 mb-3 hover:bg-accent/10 transition-colors">
            <div className="text-sm font-medium mb-1">{element.name}</div>
            <div className="text-xs text-muted-foreground mb-2">{element.description}</div>
            <div className="text-xs mb-2">
              <span className="font-medium">Dimensions: </span>
              {element.defaultDimensions.width}m × {element.defaultDimensions.height}m × {element.defaultDimensions.depth}m
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full text-xs"
              onClick={() => handleSelectElement(element)}
            >
              Add to Room
            </Button>
          </Card>
        ))}
        
        {filteredElements.length === 0 && (
          <div className="text-center text-muted-foreground py-8">
            No elements found for this category.
          </div>
        )}
      </ScrollArea>
      
      <div className="text-xs text-muted-foreground mt-4">
        <p>Fixed elements are architectural features that are permanently attached to walls or floors.</p>
      </div>
    </div>
  );
};

export default FixedElementsPanel;