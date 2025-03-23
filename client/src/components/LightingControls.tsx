import { useState } from "react";
import { useDesign } from "../lib/stores/useDesign";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";

const LightingControls = () => {
  const { 
    roomData, 
    updateAmbientLight, 
    updateDirectionalLight,
    addLight,
    removeLight,
    updateBackgroundColor
  } = useDesign();
  
  const [newLightColor, setNewLightColor] = useState("#ffffff");
  const [newLightIntensity, setNewLightIntensity] = useState(1);
  const [newLightPosition, setNewLightPosition] = useState({ x: 0, y: 2, z: 0 });
  
  // Lighting presets
  const lightingPresets = [
    { name: "Bright Day", ambient: 0.8, directional: 1.2, bg: "#87CEEB" },
    { name: "Evening", ambient: 0.4, directional: 0.7, bg: "#F08080" },
    { name: "Night", ambient: 0.2, directional: 0.3, bg: "#191970" },
    { name: "Warm", ambient: 0.6, directional: 0.9, bg: "#FFD700" },
    { name: "Cool", ambient: 0.6, directional: 0.9, bg: "#ADD8E6" },
  ];
  
  const handleApplyPreset = (preset: typeof lightingPresets[0]) => {
    updateAmbientLight(preset.ambient);
    updateDirectionalLight(preset.directional);
    updateBackgroundColor(preset.bg);
  };
  
  const handleAddLight = () => {
    addLight({
      x: newLightPosition.x,
      y: newLightPosition.y,
      z: newLightPosition.z,
      color: newLightColor,
      intensity: newLightIntensity,
      castShadow: true
    });
  };
  
  return (
    <div className="space-y-5">
      {/* Lighting Presets */}
      <div className="space-y-2">
        <Label>Lighting Presets</Label>
        <div className="grid grid-cols-3 gap-2">
          {lightingPresets.map((preset) => (
            <Button 
              key={preset.name}
              variant="outline" 
              size="sm"
              onClick={() => handleApplyPreset(preset)}
              className="text-xs"
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Main Lights Controls */}
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Ambient Light</Label>
            <span className="text-xs text-muted-foreground">
              {roomData.ambientLightIntensity.toFixed(1)}
            </span>
          </div>
          <Slider
            min={0}
            max={2}
            step={0.1}
            value={[roomData.ambientLightIntensity]}
            onValueChange={(value) => updateAmbientLight(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Directional Light (Sun)</Label>
            <span className="text-xs text-muted-foreground">
              {roomData.directionalLightIntensity.toFixed(1)}
            </span>
          </div>
          <Slider
            min={0}
            max={2}
            step={0.1}
            value={[roomData.directionalLightIntensity]}
            onValueChange={(value) => updateDirectionalLight(value[0])}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Background Color</Label>
          <div className="flex gap-2">
            <Input
              type="color"
              value={roomData.backgroundColor}
              onChange={(e) => updateBackgroundColor(e.target.value)}
              className="w-12 h-10 p-1"
            />
            <Input
              type="text"
              value={roomData.backgroundColor}
              onChange={(e) => updateBackgroundColor(e.target.value)}
              className="flex-1"
            />
          </div>
        </div>
      </div>
      
      {/* Additional Lights */}
      <div className="space-y-3 border-t pt-3">
        <Label>Additional Lights</Label>
        
        {roomData.additionalLights.length > 0 && (
          <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
            {roomData.additionalLights.map((light, index) => (
              <div key={index} className="flex items-center justify-between bg-muted p-2 rounded-md">
                <div className="flex-1 text-xs">
                  <div 
                    className="w-3 h-3 rounded-full inline-block mr-2" 
                    style={{ backgroundColor: light.color }} 
                  />
                  <span>
                    ({light.x}, {light.y}, {light.z}) - {light.intensity.toFixed(1)}
                  </span>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="h-6 text-xs"
                  onClick={() => removeLight(index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {/* Add New Light Form */}
        <div className="space-y-2 bg-muted/50 p-2 rounded-md">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Label className="text-xs">X</Label>
              <Input
                type="number"
                min={-10}
                max={10}
                step={0.5}
                value={newLightPosition.x}
                onChange={(e) => setNewLightPosition({...newLightPosition, x: parseFloat(e.target.value)})}
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs">Y</Label>
              <Input
                type="number"
                min={0}
                max={10}
                step={0.5}
                value={newLightPosition.y}
                onChange={(e) => setNewLightPosition({...newLightPosition, y: parseFloat(e.target.value)})}
                className="h-8"
              />
            </div>
            <div>
              <Label className="text-xs">Z</Label>
              <Input
                type="number"
                min={-10}
                max={10}
                step={0.5}
                value={newLightPosition.z}
                onChange={(e) => setNewLightPosition({...newLightPosition, z: parseFloat(e.target.value)})}
                className="h-8"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Color</Label>
              <div className="flex">
                <Input
                  type="color"
                  value={newLightColor}
                  onChange={(e) => setNewLightColor(e.target.value)}
                  className="w-8 h-8 p-1"
                />
                <Input
                  type="text"
                  value={newLightColor}
                  onChange={(e) => setNewLightColor(e.target.value)}
                  className="flex-1 h-8"
                />
              </div>
            </div>
            <div>
              <Label className="text-xs">Intensity</Label>
              <Input
                type="number"
                min={0}
                max={5}
                step={0.1}
                value={newLightIntensity}
                onChange={(e) => setNewLightIntensity(parseFloat(e.target.value))}
                className="h-8"
              />
            </div>
          </div>
          
          <Button
            size="sm"
            className="w-full"
            onClick={handleAddLight}
          >
            Add Light
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LightingControls;
