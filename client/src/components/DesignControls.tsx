import { useState } from "react";
import { useDesign } from "../lib/stores/useDesign";
import { NavigationInfo } from "./Navigation";
import MaterialSelector from "./MaterialSelector";
import LightingControls from "./LightingControls";
import FurniturePanel from "./FurniturePanel";
import IkeaCatalogPanel from "./IkeaCatalogPanel";
import FixedElementsPanel from "./FixedElementsPanel";
import { Button } from "./ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";

const DesignControls = () => {
  const [isOpen, setIsOpen] = useState(true);
  const { cameraPosition, roomData } = useDesign();

  return (
    <>
      {/* Toggle controls button */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          className="bg-card/80 backdrop-blur-sm"
        >
          {isOpen ? "Hide Controls" : "Show Controls"}
        </Button>
      </div>

      {/* Main Controls Panel */}
      {isOpen && (
        <div className="fixed right-4 top-16 w-80 bg-card/90 backdrop-blur-md shadow-lg rounded-lg p-4 z-40 text-card-foreground overflow-y-auto max-h-[80vh]">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Interior Design Controls</h2>

          <Tabs defaultValue="materials">
            <TabsList className="grid grid-cols-5 mb-4">
              <TabsTrigger value="materials">Materials</TabsTrigger>
              <TabsTrigger value="lighting">Lighting</TabsTrigger>
              <TabsTrigger value="furniture">Furniture</TabsTrigger>
              <TabsTrigger value="fixed">Fixed</TabsTrigger>
              <TabsTrigger value="ikea">IKEA</TabsTrigger>
            </TabsList>

            <TabsContent value="materials" className="space-y-4">
              <MaterialSelector />
            </TabsContent>

            <TabsContent value="lighting" className="space-y-4">
              <LightingControls />
            </TabsContent>

            <TabsContent value="furniture" className="space-y-4">
              <FurniturePanel />
            </TabsContent>
            
            <TabsContent value="fixed" className="space-y-4">
              <FixedElementsPanel />
            </TabsContent>
            
            <TabsContent value="ikea" className="space-y-4">
              <IkeaCatalogPanel />
            </TabsContent>
          </Tabs>

          {/* Current Position Info */}
          <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
            <p>Camera Position:</p>
            <code className="block text-[10px] font-mono mt-1 p-1 bg-muted rounded">
              X: {cameraPosition.x.toFixed(2)}, Y: {cameraPosition.y.toFixed(2)}, Z: {cameraPosition.z.toFixed(2)}
            </code>
            
            <p className="mt-2">Room Dimensions:</p>
            <code className="block text-[10px] font-mono mt-1 p-1 bg-muted rounded">
              W: {roomData.width}m, H: {roomData.height}m, D: {roomData.depth}m
            </code>
          </div>
        </div>
      )}

      {/* Navigation controls */}
      <NavigationInfo />
    </>
  );
};

export default DesignControls;
