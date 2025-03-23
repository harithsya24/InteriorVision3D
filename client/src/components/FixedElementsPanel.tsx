import { useState } from "react";
import { useDesign } from "../lib/stores/useDesign";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

// Fixed elements data
const FIXED_ELEMENTS = [
  {
    id: "built_in_bookshelf",
    name: "Built-in Bookshelf",
    description: "Wall-mounted bookshelf with decorative elements",
    modelPath: "/models/built_in_bookshelf.glb",
    thumbnail: "🗄️",
    color: "#8B4513",
    dimensions: { width: 1.8, height: 2.1, depth: 0.4 }
  },
  {
    id: "kitchen_cabinets",
    name: "Kitchen Cabinets",
    description: "Set of integrated kitchen cabinets and countertop",
    modelPath: "/models/kitchen_cabinets.glb",
    thumbnail: "🍽️",
    color: "#A0522D",
    dimensions: { width: 2.4, height: 1.0, depth: 0.6 }
  },
  {
    id: "wall_fireplace",
    name: "Wall Fireplace",
    description: "Modern wall-mounted electric fireplace",
    modelPath: "/models/wall_fireplace.glb",
    thumbnail: "🔥",
    color: "#333333",
    dimensions: { width: 1.2, height: 0.8, depth: 0.2 }
  },
  {
    id: "wall_tv_unit",
    name: "Wall TV Unit",
    description: "Entertainment center with TV mount and storage",
    modelPath: "/models/wall_tv_unit.glb",
    thumbnail: "📺",
    color: "#2F4F4F",
    dimensions: { width: 2.2, height: 1.8, depth: 0.4 }
  },
  {
    id: "closet_wardrobe",
    name: "Built-in Wardrobe",
    description: "Full-height wardrobe with sliding doors",
    modelPath: "/models/closet_wardrobe.glb",
    thumbnail: "👕",
    color: "#4B3621",
    dimensions: { width: 2.0, height: 2.4, depth: 0.6 }
  }
];

const FixedElementsPanel: React.FC = () => {
  const { addFurniture } = useDesign();
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  
  // Handle selection of a fixed element
  const handleSelectElement = (element: any) => {
    setSelectedElement(element.id);
    
    // Add as fixed furniture
    const furniture = {
      type: element.name,
      position: {
        x: 0,
        y: element.dimensions.height / 2, // Position at floor level
        z: 0
      },
      rotation: 0,
      color: element.color,
      scale: 1,
      isFixed: true,
      modelPath: element.modelPath
    };
    
    addFurniture(furniture);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Fixed Architectural Elements</h3>
      </div>
      
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-3">
          {FIXED_ELEMENTS.map((element) => (
            <div 
              key={element.id}
              className={`border rounded-md p-3 transition-colors cursor-pointer ${
                selectedElement === element.id 
                  ? "border-primary bg-primary/10" 
                  : "hover:border-primary/50"
              }`}
              onClick={() => handleSelectElement(element)}
            >
              <div className="flex items-start gap-3">
                <div className="text-4xl">{element.thumbnail}</div>
                <div className="flex-1">
                  <h4 className="font-medium">{element.name}</h4>
                  <p className="text-muted-foreground text-sm">{element.description}</p>
                  <div className="text-xs text-muted-foreground mt-1">
                    {element.dimensions.width}m × {element.dimensions.height}m × {element.dimensions.depth}m
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>Fixed elements are built-in architectural features that cannot be moved.</p>
      </div>
    </div>
  );
};

export default FixedElementsPanel;