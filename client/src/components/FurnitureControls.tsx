import { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import { useDesign } from "../lib/stores/useDesign";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Slider } from "./ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

const FurnitureControls: React.FC = () => {
  const { roomData, updateFurniturePosition, updateFurnitureRotation, updateFurnitureColor, removeFurniture } = useDesign();
  
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0, z: 0 });
  const [rotation, setRotation] = useState(0);
  const [color, setColor] = useState("#FFFFFF");
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  
  // Update controls when furniture is selected
  useEffect(() => {
    if (selectedIndex !== null && roomData.furniture[selectedIndex]) {
      const furniture = roomData.furniture[selectedIndex];
      setPosition(furniture.position);
      setRotation(furniture.rotation);
      setColor(furniture.color);
    }
  }, [selectedIndex, roomData.furniture]);
  
  // Handle furniture selection
  const handleSelectFurniture = (index: number) => {
    setSelectedIndex(index);
  };
  
  // Handle position changes
  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && selectedIndex !== null) {
      const newPosition = { ...position, [axis]: numValue };
      setPosition(newPosition);
      updateFurniturePosition(selectedIndex, newPosition);
    }
  };
  
  // Handle rotation changes
  const handleRotationChange = (value: number[]) => {
    if (selectedIndex !== null) {
      setRotation(value[0]);
      updateFurnitureRotation(selectedIndex, value[0]);
    }
  };
  
  // Handle color changes
  const handleColorChange = (newColor: string) => {
    if (selectedIndex !== null) {
      setColor(newColor);
      updateFurnitureColor(selectedIndex, newColor);
    }
  };
  
  // Handle furniture removal
  const handleRemoveFurniture = () => {
    if (selectedIndex !== null) {
      removeFurniture(selectedIndex);
      setSelectedIndex(null);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select Furniture Item</Label>
        <Select 
          value={selectedIndex !== null ? selectedIndex.toString() : ""}
          onValueChange={(value) => handleSelectFurniture(parseInt(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select furniture to edit" />
          </SelectTrigger>
          <SelectContent>
            {roomData.furniture.map((item, index) => (
              <SelectItem 
                key={`furniture-option-${index}`} 
                value={index.toString()}
                disabled={item.isFixed}
              >
                {item.type} {item.isFixed && "(Fixed)"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedIndex !== null && roomData.furniture[selectedIndex] && !roomData.furniture[selectedIndex].isFixed && (
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-2">
              <Label htmlFor="position-x">X Position</Label>
              <Input
                id="position-x"
                type="number"
                step="0.1"
                value={position.x}
                onChange={(e) => handlePositionChange('x', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position-y">Y Position</Label>
              <Input
                id="position-y"
                type="number"
                step="0.1"
                value={position.y}
                onChange={(e) => handlePositionChange('y', e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position-z">Z Position</Label>
              <Input
                id="position-z"
                type="number"
                step="0.1"
                value={position.z}
                onChange={(e) => handlePositionChange('z', e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Rotation (Degrees)</Label>
            <div className="flex items-center gap-4">
              <Slider
                value={[rotation]}
                min={0}
                max={360}
                step={1}
                onValueChange={handleRotationChange}
                className="flex-1"
              />
              <span className="w-12 text-center">{rotation}°</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Color</Label>
            <div className="flex gap-2">
              <div
                className="w-10 h-10 rounded border cursor-pointer"
                style={{ backgroundColor: color }}
                onClick={() => setColorPickerOpen(!colorPickerOpen)}
              />
              <Input
                type="text"
                value={color}
                onChange={(e) => handleColorChange(e.target.value)}
                className="flex-1"
              />
            </div>
            
            {colorPickerOpen && (
              <div className="mt-2 p-2 bg-background border rounded-md shadow-md">
                <HexColorPicker color={color} onChange={handleColorChange} />
                <div className="flex justify-end mt-2">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => setColorPickerOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleRemoveFurniture}
          >
            Remove Furniture
          </Button>
        </>
      )}
      
      {(selectedIndex === null || (selectedIndex !== null && roomData.furniture[selectedIndex]?.isFixed)) && (
        <div className="flex h-40 items-center justify-center text-muted-foreground text-center p-4">
          {selectedIndex === null ? (
            <p>Select a furniture item to edit its properties</p>
          ) : (
            <p>This is a fixed element and cannot be modified</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FurnitureControls;