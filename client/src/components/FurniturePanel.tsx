import { useState } from "react";
import { useDesign } from "../lib/stores/useDesign";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import FurnitureControls from "./FurnitureControls";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { PlusCircle } from "lucide-react";

// Basic furniture templates
const FURNITURE_TEMPLATES = [
  { 
    type: "chair", 
    dimensions: { width: 0.6, height: 1.0, depth: 0.6 },
    color: "#A0522D" 
  },
  { 
    type: "table", 
    dimensions: { width: 1.2, height: 0.75, depth: 0.8 },
    color: "#8B4513" 
  },
  { 
    type: "sofa", 
    dimensions: { width: 2.0, height: 0.9, depth: 0.85 },
    color: "#4169E1" 
  },
  { 
    type: "bed", 
    dimensions: { width: 1.8, height: 0.5, depth: 2.0 },
    color: "#F5F5DC" 
  },
  { 
    type: "bookshelf", 
    dimensions: { width: 0.8, height: 1.8, depth: 0.3 },
    color: "#D2B48C" 
  },
  { 
    type: "dresser", 
    dimensions: { width: 1.2, height: 0.8, depth: 0.5 },
    color: "#DEB887" 
  },
  { 
    type: "lamp", 
    dimensions: { width: 0.4, height: 1.5, depth: 0.4 },
    color: "#F0E68C" 
  },
  { 
    type: "plant", 
    dimensions: { width: 0.5, height: 1.2, depth: 0.5 },
    color: "#228B22" 
  }
];

const FurniturePanel: React.FC = () => {
  const { addFurniture } = useDesign();
  const [activeTab, setActiveTab] = useState("add");
  
  // Add furniture from template
  const handleAddFurniture = (template: any) => {
    const furniture = {
      type: template.type,
      position: {
        x: 0,
        y: template.dimensions.height / 2, // Position at floor level
        z: 0
      },
      rotation: 0,
      color: template.color,
      scale: 1,
      isFixed: false
    };
    
    addFurniture(furniture);
  };
  
  return (
    <div className="space-y-4">
      <Tabs defaultValue="add" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="add">Add Furniture</TabsTrigger>
          <TabsTrigger value="edit">Edit Properties</TabsTrigger>
        </TabsList>
        
        <TabsContent value="add" className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {FURNITURE_TEMPLATES.map((item, index) => (
              <Button
                key={`template-${index}`}
                variant="outline"
                className="h-auto flex flex-col py-3 px-2 items-center justify-center gap-2"
                onClick={() => handleAddFurniture(item)}
              >
                <div 
                  className="w-10 h-10 rounded-md" 
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs capitalize">{item.type}</span>
                <PlusCircle className="h-4 w-4 opacity-50" />
              </Button>
            ))}
          </div>
          
          <div className="text-center text-sm text-muted-foreground mt-4">
            <p>Click a template to add it to your room</p>
          </div>
        </TabsContent>
        
        <TabsContent value="edit">
          <FurnitureControls />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FurniturePanel;