import React, { useState } from 'react';
import { FixedElementsService, FixedElementType } from '../lib/services/fixedElementsService';
import { useDesign } from '../lib/stores/useDesign';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Card } from './ui/card';

const FixedElementsPanel: React.FC = () => {
  const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
  const fixedElements = FixedElementsService.getAvailableFixedElements();
  const addFurniture = useDesign(state => state.addFurniture);

  // Handle selecting a fixed element
  const handleSelectElement = (element: FixedElementType) => {
    setSelectedElementId(element.id);
    
    // Create a furniture item from the fixed element and add it to the room
    // Position at the center of the room for now
    const furniture = FixedElementsService.createFixedFurniture(
      element,
      { x: 0, y: 0, z: 0 },
      0
    );
    
    // Add the furniture to the room
    addFurniture(furniture);
  };

  return (
    <div className="p-4 bg-background rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Fixed Architectural Elements</h3>
      
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          These are built-in elements that attach to walls or floors.
        </p>
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex flex-col space-y-4 max-h-96 overflow-y-auto">
        {fixedElements.map(element => (
          <Card
            key={element.id}
            className={`p-4 cursor-pointer transition-colors hover:bg-muted ${
              selectedElementId === element.id ? 'border-primary' : ''
            }`}
            onClick={() => handleSelectElement(element)}
          >
            <div className="flex justify-between">
              <div>
                <h4 className="font-medium">{element.name}</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {element.description}
                </p>
                <p className="text-xs mt-2">
                  {element.defaultDimensions.width} × {element.defaultDimensions.depth} × {element.defaultDimensions.height} m
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FixedElementsPanel;