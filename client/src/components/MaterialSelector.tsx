import { useState } from "react";
import { useDesign } from "../lib/stores/useDesign";
import { materialOptions } from "../lib/materialLibrary";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "./ui/select";

const MaterialSelector = () => {
  const { 
    roomData, 
    updateWallMaterial, 
    updateFloorMaterial, 
    updateCeilingMaterial 
  } = useDesign();
  
  const [selectedSurface, setSelectedSurface] = useState<string>("walls");
  const [materialScale, setMaterialScale] = useState<number>(roomData.wallMaterial.scale || 1);
  
  // Handle material selection based on the selected surface
  const handleMaterialChange = (materialName: string) => {
    const selectedMaterial = materialOptions.find(mat => mat.name === materialName);
    if (!selectedMaterial) return;
    
    switch (selectedSurface) {
      case "walls":
        updateWallMaterial({
          ...selectedMaterial,
          scale: materialScale
        });
        break;
      case "floor":
        updateFloorMaterial({
          ...selectedMaterial,
          scale: materialScale
        });
        break;
      case "ceiling":
        updateCeilingMaterial({
          ...selectedMaterial,
          scale: materialScale
        });
        break;
    }
  };
  
  // Handle material scale change
  const handleScaleChange = (value: number[]) => {
    const newScale = value[0];
    setMaterialScale(newScale);
    
    // Update the appropriate material with the new scale
    switch (selectedSurface) {
      case "walls":
        updateWallMaterial({
          ...roomData.wallMaterial,
          scale: newScale
        });
        break;
      case "floor":
        updateFloorMaterial({
          ...roomData.floorMaterial,
          scale: newScale
        });
        break;
      case "ceiling":
        updateCeilingMaterial({
          ...roomData.ceilingMaterial,
          scale: newScale
        });
        break;
    }
  };
  
  // Get the current material name based on selected surface
  const getCurrentMaterial = (): string => {
    switch (selectedSurface) {
      case "walls":
        return roomData.wallMaterial.name;
      case "floor":
        return roomData.floorMaterial.name;
      case "ceiling":
        return roomData.ceilingMaterial.name;
      default:
        return "wood";
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select Surface</Label>
        <div className="flex gap-2">
          <Button 
            variant={selectedSurface === "walls" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedSurface("walls");
              setMaterialScale(roomData.wallMaterial.scale || 1);
            }}
          >
            Walls
          </Button>
          <Button 
            variant={selectedSurface === "floor" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedSurface("floor");
              setMaterialScale(roomData.floorMaterial.scale || 1);
            }}
          >
            Floor
          </Button>
          <Button 
            variant={selectedSurface === "ceiling" ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setSelectedSurface("ceiling");
              setMaterialScale(roomData.ceilingMaterial.scale || 1);
            }}
          >
            Ceiling
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label>Material</Label>
        <Select 
          value={getCurrentMaterial()} 
          onValueChange={handleMaterialChange}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select material" />
          </SelectTrigger>
          <SelectContent>
            {materialOptions.map(material => (
              <SelectItem key={material.name} value={material.name}>
                {material.displayName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Texture Scale</Label>
          <span className="text-xs text-muted-foreground">{materialScale.toFixed(1)}x</span>
        </div>
        <Slider
          min={0.1}
          max={5}
          step={0.1}
          value={[materialScale]}
          onValueChange={handleScaleChange}
        />
      </div>
      
      <div className="p-2 bg-muted rounded-md">
        <p className="text-xs text-muted-foreground">
          Tip: Adjust texture scale for realistic material appearance. Smaller values create larger patterns.
        </p>
      </div>
    </div>
  );
};

export default MaterialSelector;
