import { useState } from "react";
import { useDesign } from "../lib/stores/useDesign";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import FurnitureControls from "./FurnitureControls";

const FURNITURE_TEMPLATES = [
  { type: "Sofa", color: "#8B4513", dimensions: { width: 2.0, height: 0.8, depth: 0.9 } },
  { type: "Chair", color: "#A0522D", dimensions: { width: 0.8, height: 1.0, depth: 0.8 } },
  { type: "Table", color: "#D2B48C", dimensions: { width: 1.2, height: 0.75, depth: 0.8 } },
  { type: "Bed", color: "#F5DEB3", dimensions: { width: 1.8, height: 0.5, depth: 2.1 } },
  { type: "Cabinet", color: "#A52A2A", dimensions: { width: 1.0, height: 1.8, depth: 0.5 } },
  { type: "Desk", color: "#CD853F", dimensions: { width: 1.4, height: 0.75, depth: 0.7 } },
  { type: "Lamp", color: "#FFD700", dimensions: { width: 0.4, height: 1.5, depth: 0.4 } },
  { type: "Bookshelf", color: "#8B4513", dimensions: { width: 1.2, height: 2.0, depth: 0.4 } },
];

const FurniturePanel: React.FC = () => {
  const { roomData, addFurniture } = useDesign();
  const [customType, setCustomType] = useState("");
  const [customColor, setCustomColor] = useState("#FFFFFF");
  
  // Function to add furniture from template
  const addFurnitureFromTemplate = (type: string, color: string, dimensions: { width: number, height: number, depth: number }) => {
    const furniture = {
      type,
      position: {
        x: 0,
        y: dimensions.height / 2, // Place on floor
        z: 0
      },
      rotation: 0,
      color,
      scale: 1,
      isFixed: false
    };
    
    addFurniture(furniture);
  };
  
  // Function to add custom furniture
  const addCustomFurniture = () => {
    if (!customType.trim()) return;
    
    const furniture = {
      type: customType,
      position: {
        x: 0,
        y: 0.5, // Default height
        z: 0
      },
      rotation: 0,
      color: customColor,
      scale: 1,
      isFixed: false
    };
    
    addFurniture(furniture);
    setCustomType("");
  };
  
  return (
    <Tabs defaultValue="templates">
      <TabsList className="grid grid-cols-3 mb-4">
        <TabsTrigger value="templates">Templates</TabsTrigger>
        <TabsTrigger value="custom">Add Custom</TabsTrigger>
        <TabsTrigger value="modify">Modify</TabsTrigger>
      </TabsList>
      
      {/* Templates Tab */}
      <TabsContent value="templates" className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {FURNITURE_TEMPLATES.map((item, index) => (
            <Button
              key={`template-${index}`}
              variant="outline"
              className="h-auto py-3 flex flex-col items-center justify-center hover:bg-accent/10"
              onClick={() => addFurnitureFromTemplate(item.type, item.color, item.dimensions)}
            >
              <div 
                className="w-12 h-12 mb-1 rounded" 
                style={{ backgroundColor: item.color }}
              />
              <div className="text-sm font-medium">{item.type}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {item.dimensions.width}m × {item.dimensions.height}m × {item.dimensions.depth}m
              </div>
            </Button>
          ))}
        </div>
        
        <div className="text-center text-xs text-muted-foreground mt-4">
          <p>Click on any template to add it to your room</p>
        </div>
      </TabsContent>
      
      {/* Custom Furniture Tab */}
      <TabsContent value="custom" className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="custom-type">Furniture Type</Label>
          <Input
            id="custom-type"
            placeholder="E.g., Coffee Table, Plant, etc."
            value={customType}
            onChange={(e) => setCustomType(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="custom-color">Color</Label>
          <div className="flex gap-2">
            <Input
              id="custom-color"
              type="color"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={customColor}
              onChange={(e) => setCustomColor(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
        
        <Button 
          className="w-full mt-4" 
          onClick={addCustomFurniture}
          disabled={!customType.trim()}
        >
          Add Custom Furniture
        </Button>
      </TabsContent>
      
      {/* Modify Tab */}
      <TabsContent value="modify" className="space-y-4">
        <FurnitureControls />
      </TabsContent>
    </Tabs>
  );
};

export default FurniturePanel;