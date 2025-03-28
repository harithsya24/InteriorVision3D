import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useDesign } from "../lib/stores/useDesign";
import FurniturePanel from "./FurniturePanel";
import RecentlyUsedPanel from "./RecentlyUsedPanel";
import FixedElementsPanel from "./FixedElementsPanel";
import IkeaCatalogPanel from "./IkeaCatalogPanel";
import { Button } from "./ui/button";
import { 
  Square, 
  Palette, 
  Sofa, 
  History, 
  Home, 
  Sun, 
  ShoppingBag,
  Eye,
  EyeOff
} from "lucide-react";

const DesignControls: React.FC = () => {
  const { 
    roomData, 
    updateRoomDimensions, 
    updateWallMaterial, 
    updateFloorMaterial, 
    updateCeilingMaterial,
    updateAmbientLight,
    updateDirectionalLight,
    viewMode,
    setViewMode
  } = useDesign();
  
  // Toggle between first-person and orbit view
  const toggleViewMode = () => {
    setViewMode(viewMode === 'firstPerson' ? 'orbit' : 'firstPerson');
  };
  
  return (
    <div className="bg-background p-4 rounded-md shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Room Design Controls</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={toggleViewMode}
        >
          {viewMode === 'firstPerson' ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
          {viewMode === 'firstPerson' ? 'Exit First Person' : 'Enter First Person'}
        </Button>
      </div>
      
      <Tabs defaultValue="furniture">
        <div className="overflow-x-auto">
          <TabsList className="mb-4 w-full flex justify-between min-w-[600px]">
            <TabsTrigger value="furniture" className="flex items-center gap-2 px-4 py-2 flex-1">
              <Sofa className="h-4 w-4" />
              <span>Furniture</span>
            </TabsTrigger>
            <TabsTrigger value="fixed" className="flex items-center gap-2 px-4 py-2 flex-1">
              <Square className="h-4 w-4" />
              <span>Fixed</span>
            </TabsTrigger>
            <TabsTrigger value="ikea" className="flex items-center gap-2 px-4 py-2 flex-1">
              <ShoppingBag className="h-4 w-4" />
              <span>IKEA</span>
            </TabsTrigger>
            <TabsTrigger value="recent" className="flex items-center gap-2 px-4 py-2 flex-1">
              <History className="h-4 w-4" />
              <span>Recent</span>
            </TabsTrigger>
            <TabsTrigger value="materials" className="flex items-center gap-2 px-4 py-2 flex-1">
              <Palette className="h-4 w-4" />
              <span>Materials</span>
            </TabsTrigger>
            <TabsTrigger value="lighting" className="flex items-center gap-2 px-4 py-2 flex-1">
              <Sun className="h-4 w-4" />
              <span>Lighting</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        {/* Furniture Panel */}
        <TabsContent value="furniture">
          <FurniturePanel />
        </TabsContent>
        
        {/* Fixed Elements Panel */}
        <TabsContent value="fixed">
          <FixedElementsPanel />
        </TabsContent>
        
        {/* IKEA Catalog Panel */}
        <TabsContent value="ikea">
          <IkeaCatalogPanel />
        </TabsContent>
        
        {/* Recently Used Panel */}
        <TabsContent value="recent">
          <RecentlyUsedPanel />
        </TabsContent>
        
        {/* Room Dimensions Panel */}
        <TabsContent value="room">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Room Dimensions</h3>
            <p className="text-sm text-muted-foreground">
              Current size: {roomData.width}m × {roomData.height}m × {roomData.depth}m
            </p>
            
            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline">Small Room</Button>
              <Button variant="outline">Medium Room</Button>
              <Button variant="outline">Large Room</Button>
            </div>
            
            <p className="text-xs text-muted-foreground text-center mt-4">
              Note: Changing room size will not affect furniture placement
            </p>
          </div>
        </TabsContent>
        
        {/* Materials Panel */}
        <TabsContent value="materials">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Room Materials</h3>
            
            <div className="space-y-2">
              <h4 className="text-xs font-medium">Walls: {roomData.wallMaterial.name}</h4>
              <div className="grid grid-cols-4 gap-2">
                <Button variant="outline" className="p-1 h-12">
                  <div className="w-full h-full bg-[#D1C0A8]"></div>
                </Button>
                <Button variant="outline" className="p-1 h-12">
                  <div className="w-full h-full bg-[#FFFFFF]"></div>
                </Button>
                <Button variant="outline" className="p-1 h-12">
                  <div className="w-full h-full bg-[#B8C4D9]"></div>
                </Button>
                <Button variant="outline" className="p-1 h-12">
                  <div className="w-full h-full bg-[#D9C1B8]"></div>
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xs font-medium">Floor: {roomData.floorMaterial.name}</h4>
              <div className="grid grid-cols-4 gap-2">
                <Button variant="outline" className="p-1 h-12">
                  <div className="w-full h-full bg-[#8B4513]"></div>
                </Button>
                <Button variant="outline" className="p-1 h-12">
                  <div className="w-full h-full bg-[#A0522D]"></div>
                </Button>
                <Button variant="outline" className="p-1 h-12">
                  <div className="w-full h-full bg-[#D2B48C]"></div>
                </Button>
                <Button variant="outline" className="p-1 h-12">
                  <div className="w-full h-full bg-[#808080]"></div>
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xs font-medium">Ceiling: {roomData.ceilingMaterial.name}</h4>
              <div className="grid grid-cols-4 gap-2">
                <Button variant="outline" className="p-1 h-12">
                  <div className="w-full h-full bg-[#FFFFFF]"></div>
                </Button>
                <Button variant="outline" className="p-1 h-12">
                  <div className="w-full h-full bg-[#F5F5F5]"></div>
                </Button>
                <Button variant="outline" className="p-1 h-12">
                  <div className="w-full h-full bg-[#ECECEC]"></div>
                </Button>
                <Button variant="outline" className="p-1 h-12">
                  <div className="w-full h-full bg-[#E5E5E5]"></div>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
        
        {/* Lighting Panel */}
        <TabsContent value="lighting">
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Lighting Settings</h3>
            
            <div className="space-y-2">
              <h4 className="text-xs font-medium">Ambient Light: {roomData.ambientLightIntensity}</h4>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" onClick={() => updateAmbientLight(0.2)}>Low</Button>
                <Button variant="outline" onClick={() => updateAmbientLight(0.5)}>Medium</Button>
                <Button variant="outline" onClick={() => updateAmbientLight(0.8)}>High</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xs font-medium">Directional Light: {roomData.directionalLightIntensity}</h4>
              <div className="grid grid-cols-3 gap-2">
                <Button variant="outline" onClick={() => updateDirectionalLight(0.5)}>Soft</Button>
                <Button variant="outline" onClick={() => updateDirectionalLight(1.0)}>Natural</Button>
                <Button variant="outline" onClick={() => updateDirectionalLight(1.5)}>Bright</Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xs font-medium">Background Color</h4>
              <div className="grid grid-cols-4 gap-2">
                <Button variant="outline" className="p-1 h-8">
                  <div className="w-full h-full bg-[#87CEEB]"></div>
                </Button>
                <Button variant="outline" className="p-1 h-8">
                  <div className="w-full h-full bg-[#ADD8E6]"></div>
                </Button>
                <Button variant="outline" className="p-1 h-8">
                  <div className="w-full h-full bg-[#B0E0E6]"></div>
                </Button>
                <Button variant="outline" className="p-1 h-8">
                  <div className="w-full h-full bg-[#000000]"></div>
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DesignControls;