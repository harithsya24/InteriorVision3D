import { useState } from 'react';
import { useDesign, Furniture } from '../lib/stores/useDesign';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { HexColorPicker } from 'react-colorful';

const FurnitureControls: React.FC = () => {
  const { 
    roomData, 
    updateFurniturePosition, 
    updateFurnitureRotation, 
    updateFurnitureColor,
    removeFurniture
  } = useDesign();
  
  const [selectedFurnitureIndex, setSelectedFurnitureIndex] = useState<number | null>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const selectedFurniture = selectedFurnitureIndex !== null ? roomData.furniture[selectedFurnitureIndex] : null;
  
  // Handle position change for X, Y, or Z
  const handlePositionChange = (axis: 'x' | 'y' | 'z', value: number) => {
    if (selectedFurnitureIndex === null) return;
    
    const position = { 
      ...selectedFurniture!.position,
      [axis]: parseFloat(value.toFixed(2))
    };
    
    updateFurniturePosition(selectedFurnitureIndex, position);
  };
  
  // Handle rotation change
  const handleRotationChange = (value: number) => {
    if (selectedFurnitureIndex === null) return;
    updateFurnitureRotation(selectedFurnitureIndex, value);
  };
  
  // Handle color change
  const handleColorChange = (color: string) => {
    if (selectedFurnitureIndex === null) return;
    updateFurnitureColor(selectedFurnitureIndex, color);
  };
  
  // Handle furniture removal
  const handleRemoveFurniture = () => {
    if (selectedFurnitureIndex === null) return;
    removeFurniture(selectedFurnitureIndex);
    setSelectedFurnitureIndex(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {/* Furniture Selection Panel */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Select Furniture to Move</CardTitle>
          </CardHeader>
          <CardContent className="h-60 overflow-y-auto grid grid-cols-1 gap-2">
            {roomData.furniture.length > 0 ? (
              roomData.furniture.map((item, index) => (
                <Button
                  key={`${item.type}-${index}`}
                  variant={selectedFurnitureIndex === index ? "default" : "outline"}
                  onClick={() => setSelectedFurnitureIndex(index)}
                  className="justify-start text-left h-auto py-2"
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: item.color }}
                    />
                    <div>
                      <div className="font-medium">{item.type}</div>
                      <div className="text-xs opacity-70">
                        {item.isFixed ? 'Fixed Element' : 'Movable Furniture'}
                      </div>
                    </div>
                  </div>
                </Button>
              ))
            ) : (
              <div className="text-center text-muted-foreground py-8">
                No furniture items added yet.
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Controls Panel - Only shown when furniture is selected */}
        {selectedFurniture && (
          <>
            {/* Position Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-md">Position</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="position-x">X Position</Label>
                    <Input
                      id="position-x"
                      type="number"
                      value={selectedFurniture.position.x}
                      onChange={(e) => handlePositionChange('x', parseFloat(e.target.value) || 0)}
                      className="w-24"
                      step={0.1}
                    />
                  </div>
                  <Slider
                    id="position-x-slider"
                    min={-roomData.width/2}
                    max={roomData.width/2}
                    step={0.1}
                    value={[selectedFurniture.position.x]}
                    onValueChange={(values) => handlePositionChange('x', values[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="position-y">Y Position (Height)</Label>
                    <Input
                      id="position-y"
                      type="number"
                      value={selectedFurniture.position.y}
                      onChange={(e) => handlePositionChange('y', parseFloat(e.target.value) || 0)}
                      className="w-24"
                      step={0.1}
                    />
                  </div>
                  <Slider
                    id="position-y-slider"
                    min={0}
                    max={roomData.height}
                    step={0.1}
                    value={[selectedFurniture.position.y]}
                    onValueChange={(values) => handlePositionChange('y', values[0])}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="position-z">Z Position</Label>
                    <Input
                      id="position-z"
                      type="number"
                      value={selectedFurniture.position.z}
                      onChange={(e) => handlePositionChange('z', parseFloat(e.target.value) || 0)}
                      className="w-24"
                      step={0.1}
                    />
                  </div>
                  <Slider
                    id="position-z-slider"
                    min={-roomData.depth/2}
                    max={roomData.depth/2}
                    step={0.1}
                    value={[selectedFurniture.position.z]}
                    onValueChange={(values) => handlePositionChange('z', values[0])}
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Rotation and Color Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-md">Rotation & Color</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="rotation">Rotation (degrees)</Label>
                    <Input
                      id="rotation"
                      type="number"
                      value={selectedFurniture.rotation}
                      onChange={(e) => handleRotationChange(parseFloat(e.target.value) || 0)}
                      className="w-24"
                      step={15}
                    />
                  </div>
                  <Slider
                    id="rotation-slider"
                    min={0}
                    max={360}
                    step={1}
                    value={[selectedFurniture.rotation]}
                    onValueChange={(values) => handleRotationChange(values[0])}
                  />
                </div>
                
                <div className="space-y-2 pt-4">
                  <div className="flex justify-between items-center">
                    <Label htmlFor="color">Color</Label>
                    <div 
                      className="w-8 h-8 rounded cursor-pointer border"
                      style={{ backgroundColor: selectedFurniture.color }}
                      onClick={() => setShowColorPicker(!showColorPicker)}
                    />
                  </div>
                  
                  {showColorPicker && (
                    <div className="relative z-10 mt-2">
                      <div className="absolute right-0">
                        <HexColorPicker 
                          color={selectedFurniture.color} 
                          onChange={handleColorChange}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="destructive" 
                  onClick={handleRemoveFurniture}
                  className="w-full"
                  disabled={selectedFurniture.isFixed}
                >
                  {selectedFurniture.isFixed ? 'Cannot Remove Fixed Element' : 'Remove Furniture'}
                </Button>
              </CardFooter>
            </Card>
          </>
        )}
      </div>
      
      {!selectedFurniture && (
        <div className="text-center text-muted-foreground p-4 border rounded-md">
          Select a furniture item from the list above to modify its position, rotation, and color.
        </div>
      )}
      
      <div className="text-xs text-muted-foreground">
        <p className="mb-1">Tips:</p>
        <ul className="list-disc pl-4 space-y-1">
          <li>Use the sliders for precise positioning</li>
          <li>Rotate furniture to fit perfectly in your space</li>
          <li>Fixed architectural elements have limited movement options</li>
        </ul>
      </div>
    </div>
  );
};

export default FurnitureControls;