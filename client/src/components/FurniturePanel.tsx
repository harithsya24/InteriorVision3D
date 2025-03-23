import { useState } from "react";
import { useDesign } from "../lib/stores/useDesign";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Toggle } from "./ui/toggle";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";

// Available furniture types
const furnitureTypes = [
  { id: "sofa", name: "Sofa" },
  { id: "chair", name: "Chair" },
  { id: "table", name: "Table" },
  { id: "bed", name: "Bed" },
  { id: "desk", name: "Desk" },
  { id: "cabinet", name: "Cabinet" },
  { id: "bookshelf", name: "Bookshelf" },
  { id: "lamp", name: "Lamp" },
  { id: "plant", name: "Plant" },
  { id: "rug", name: "Rug" },
];

const FurniturePanel = () => {
  const { 
    roomData, 
    addFurniture, 
    removeFurniture, 
    updateFurniturePosition,
    updateFurnitureRotation,
    updateFurnitureColor
  } = useDesign();
  
  const [selectedFurnitureIndex, setSelectedFurnitureIndex] = useState<number | null>(null);
  const [newFurnitureType, setNewFurnitureType] = useState("sofa");
  const [newFurniturePosition, setNewFurniturePosition] = useState({ x: 0, y: 0, z: 0 });
  const [newFurnitureRotation, setNewFurnitureRotation] = useState(0);
  const [newFurnitureColor, setNewFurnitureColor] = useState("#8B4513");
  
  const handleAddFurniture = () => {
    addFurniture({
      type: newFurnitureType,
      position: newFurniturePosition,
      rotation: newFurnitureRotation,
      color: newFurnitureColor,
      scale: 1
    });
  };
  
  const handleSelectFurniture = (index: number) => {
    if (selectedFurnitureIndex === index) {
      setSelectedFurnitureIndex(null);
    } else {
      setSelectedFurnitureIndex(index);
      const furniture = roomData.furniture[index];
      setNewFurniturePosition({ ...furniture.position });
      setNewFurnitureRotation(furniture.rotation);
      setNewFurnitureColor(furniture.color);
    }
  };
  
  const handleUpdateFurniture = () => {
    if (selectedFurnitureIndex === null) return;
    
    updateFurniturePosition(selectedFurnitureIndex, newFurniturePosition);
    updateFurnitureRotation(selectedFurnitureIndex, newFurnitureRotation);
    updateFurnitureColor(selectedFurnitureIndex, newFurnitureColor);
  };
  
  return (
    <div className="space-y-4">
      {/* List of current furniture */}
      <div className="space-y-2">
        <Label>Placed Furniture</Label>
        <div className="space-y-1 max-h-32 overflow-y-auto pr-1">
          {roomData.furniture.length === 0 ? (
            <p className="text-xs text-muted-foreground">No furniture placed yet.</p>
          ) : (
            roomData.furniture.map((furniture, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-2 rounded-md ${
                  selectedFurnitureIndex === index ? 'bg-primary/20' : 'bg-muted'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: furniture.color }} 
                  />
                  <span className="text-sm">{furniture.type}</span>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-xs"
                    onClick={() => handleSelectFurniture(index)}
                  >
                    {selectedFurnitureIndex === index ? 'Deselect' : 'Edit'}
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="h-6 text-xs"
                    onClick={() => removeFurniture(index)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Furniture editing controls */}
      {selectedFurnitureIndex !== null && (
        <div className="space-y-3 p-2 border border-primary/30 rounded-md">
          <h4 className="font-medium text-sm">Edit Furniture</h4>
          
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">X Position</Label>
              <Input
                type="number"
                step={0.1}
                value={newFurniturePosition.x}
                onChange={(e) => setNewFurniturePosition({...newFurniturePosition, x: parseFloat(e.target.value)})}
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs">Y Position</Label>
              <Input
                type="number"
                step={0.1}
                value={newFurniturePosition.y}
                onChange={(e) => setNewFurniturePosition({...newFurniturePosition, y: parseFloat(e.target.value)})}
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs">Z Position</Label>
              <Input
                type="number"
                step={0.1}
                value={newFurniturePosition.z}
                onChange={(e) => setNewFurniturePosition({...newFurniturePosition, z: parseFloat(e.target.value)})}
                className="h-8"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs">Rotation (Y-axis)</Label>
              <span className="text-xs text-muted-foreground">{newFurnitureRotation}°</span>
            </div>
            <Slider
              min={0}
              max={360}
              step={5}
              value={[newFurnitureRotation]}
              onValueChange={(value) => setNewFurnitureRotation(value[0])}
            />
          </div>
          
          <div>
            <Label className="text-xs">Color</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={newFurnitureColor}
                onChange={(e) => setNewFurnitureColor(e.target.value)}
                className="w-8 h-8 p-1"
              />
              <Input
                type="text"
                value={newFurnitureColor}
                onChange={(e) => setNewFurnitureColor(e.target.value)}
                className="flex-1 h-8"
              />
            </div>
          </div>
          
          <Button
            size="sm"
            onClick={handleUpdateFurniture}
            className="w-full"
          >
            Update Furniture
          </Button>
        </div>
      )}
      
      {/* Add new furniture form */}
      <div className="space-y-3 border-t pt-3">
        <h4 className="font-medium text-sm">Add New Furniture</h4>
        
        <div>
          <Label className="text-xs">Furniture Type</Label>
          <Select 
            value={newFurnitureType} 
            onValueChange={setNewFurnitureType}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {furnitureTypes.map(type => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <div>
            <Label className="text-xs">X Position</Label>
            <Input
              type="number"
              step={0.1}
              value={newFurniturePosition.x}
              onChange={(e) => setNewFurniturePosition({...newFurniturePosition, x: parseFloat(e.target.value)})}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Y Position</Label>
            <Input
              type="number"
              step={0.1}
              value={newFurniturePosition.y}
              onChange={(e) => setNewFurniturePosition({...newFurniturePosition, y: parseFloat(e.target.value)})}
              className="h-8"
            />
          </div>
          <div>
            <Label className="text-xs">Z Position</Label>
            <Input
              type="number"
              step={0.1}
              value={newFurniturePosition.z}
              onChange={(e) => setNewFurniturePosition({...newFurniturePosition, z: parseFloat(e.target.value)})}
              className="h-8"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label className="text-xs">Rotation</Label>
            <span className="text-xs text-muted-foreground">{newFurnitureRotation}°</span>
          </div>
          <Slider
            min={0}
            max={360}
            step={5}
            value={[newFurnitureRotation]}
            onValueChange={(value) => setNewFurnitureRotation(value[0])}
          />
        </div>
        
        <div>
          <Label className="text-xs">Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={newFurnitureColor}
              onChange={(e) => setNewFurnitureColor(e.target.value)}
              className="w-8 h-8 p-1"
            />
            <Input
              type="text"
              value={newFurnitureColor}
              onChange={(e) => setNewFurnitureColor(e.target.value)}
              className="flex-1 h-8"
            />
          </div>
        </div>
        
        <Button
          size="sm"
          onClick={handleAddFurniture}
          className="w-full"
        >
          Add Furniture
        </Button>
      </div>
    </div>
  );
};

export default FurniturePanel;
