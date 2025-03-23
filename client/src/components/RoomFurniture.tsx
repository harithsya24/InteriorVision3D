import { useEffect, useMemo } from "react";
import { useDesign } from "../lib/stores/useDesign";
import DraggableFurniture from "./DraggableFurniture";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const RoomFurniture: React.FC = () => {
  const { roomData } = useDesign();

  // Preload all furniture models
  useEffect(() => {
    // Preload fixed element models from our furniture data
    const modelPaths = roomData.furniture
      .filter(item => item.modelPath)
      .map(item => item.modelPath as string);
    
    // Create a Set to remove duplicates
    const uniqueModelPaths = [...new Set(modelPaths)];
    
    // Preload each model
    uniqueModelPaths.forEach(modelPath => {
      try {
        useGLTF.preload(modelPath);
        console.log(`Preloaded furniture model: ${modelPath}`);
      } catch (error) {
        console.warn(`Failed to preload model: ${modelPath}`, error);
      }
    });
  }, [roomData.furniture]);

  // Filter furniture to handle fixed elements with 3D models separately
  const { standardFurniture, modelFurniture } = useMemo(() => {
    return {
      // Regular furniture items (no 3D models)
      standardFurniture: roomData.furniture.filter(item => !item.modelPath),
      
      // Furniture items with 3D models
      modelFurniture: roomData.furniture.filter(item => item.modelPath)
    };
  }, [roomData.furniture]);

  // Render function for model-based furniture
  const renderModelFurniture = (furniture: any, index: number) => {
    // Load the model
    const { scene } = useGLTF(furniture.modelPath as string);
    
    // Clone the model scene to avoid reference issues
    const clonedScene = useMemo(() => {
      return scene.clone();
    }, [scene]);
    
    return (
      <group
        key={`model-furniture-${index}`}
        position={[furniture.position.x, furniture.position.y, furniture.position.z]}
        rotation={[0, furniture.rotation * Math.PI / 180, 0]}
        scale={[furniture.scale, furniture.scale, furniture.scale]}
      >
        <primitive object={clonedScene} />
      </group>
    );
  };

  return (
    <>
      {/* Render standard furniture as draggable objects */}
      {standardFurniture.map((furniture, index) => (
        <DraggableFurniture 
          key={`furniture-${index}`} 
          furniture={furniture} 
          index={roomData.furniture.indexOf(furniture)}
        />
      ))}
      
      {/* Render model-based furniture */}
      {modelFurniture.map((furniture, index) => renderModelFurniture(furniture, index))}
    </>
  );
};

export default RoomFurniture;