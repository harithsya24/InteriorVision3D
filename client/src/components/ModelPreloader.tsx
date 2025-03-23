import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

// This component doesn't render anything but ensures
// all 3D models are loaded in the background
const ModelPreloader: React.FC = () => {
  useEffect(() => {
    // Preload all models we might need
    const models = [
      '/models/built_in_bookshelf.glb',
      '/models/kitchen_cabinets.glb',
      '/models/wall_fireplace.glb',
      '/models/wall_tv_unit.glb',
      '/models/closet_wardrobe.glb', // This doesn't exist yet, but we preload for the future
    ];
    
    // Preload each model
    models.forEach(modelPath => {
      try {
        useGLTF.preload(modelPath);
        console.log(`Preloaded model: ${modelPath}`);
      } catch (error) {
        console.warn(`Failed to preload model: ${modelPath}`, error);
      }
    });
    
    // Clean up - not strictly necessary for preloaded models, 
    // but good practice for potential memory management
    return () => {
      models.forEach(modelPath => {
        try {
          useGLTF.clear(modelPath);
        } catch (error) {
          console.warn(`Failed to clear model: ${modelPath}`, error);
        }
      });
    };
  }, []);
  
  // This component doesn't render anything
  return null;
};

export default ModelPreloader;