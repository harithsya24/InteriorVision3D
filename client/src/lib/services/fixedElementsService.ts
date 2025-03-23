import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { Furniture } from "../stores/useDesign";

export interface FixedElementType {
  id: string;
  name: string;
  description: string;
  modelPath: string; // Path to GLB model
  category: string;
  defaultDimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

// Database of available fixed architectural elements
const FIXED_ELEMENTS: FixedElementType[] = [
  {
    id: "bookshelf-wall",
    name: "Built-in Bookshelf",
    description: "A built-in bookshelf that spans from floor to ceiling",
    modelPath: "/models/built_in_bookshelf.glb",
    category: "storage",
    defaultDimensions: {
      width: 2.4,
      height: 2.8,
      depth: 0.4
    }
  },
  {
    id: "kitchen-cabinets",
    name: "Kitchen Cabinets",
    description: "Built-in kitchen cabinets with countertop",
    modelPath: "/models/kitchen_cabinets.glb",
    category: "kitchen",
    defaultDimensions: {
      width: 3.0,
      height: 2.1,
      depth: 0.6
    }
  },
  {
    id: "wall-fireplace",
    name: "Wall Fireplace",
    description: "Modern built-in wall fireplace with surround",
    modelPath: "/models/wall_fireplace.glb",
    category: "heating",
    defaultDimensions: {
      width: 1.8,
      height: 2.0,
      depth: 0.3
    }
  },
  {
    id: "tv-wall-unit",
    name: "TV Wall Unit",
    description: "TV wall mount with integrated storage and media center",
    modelPath: "/models/wall_tv_unit.glb",
    category: "entertainment",
    defaultDimensions: {
      width: 2.5,
      height: 1.8,
      depth: 0.35
    }
  }
];

// Service for managing fixed elements
export const FixedElementsService = {
  // Get all available fixed elements
  getAvailableFixedElements(): FixedElementType[] {
    return FIXED_ELEMENTS;
  },
  
  // Get a specific fixed element by ID
  getFixedElementById(id: string): FixedElementType | undefined {
    return FIXED_ELEMENTS.find(element => element.id === id);
  },
  
  // Create a furniture object from a fixed element
  createFixedFurniture(
    element: FixedElementType,
    position = { x: 0, y: 0, z: 0 },
    rotation = 0,
    color = "#FFFFFF"
  ): Furniture {
    return {
      type: element.name,
      position,
      rotation,
      color,
      scale: 1,
      isFixed: true, // This is a fixed architectural element
      modelPath: element.modelPath,
      productInfo: {
        name: element.name,
        brand: "Custom",
        price: 0,
        currency: "USD",
        url: "",
        dimensions: {
          width: element.defaultDimensions.width,
          height: element.defaultDimensions.height,
          depth: element.defaultDimensions.depth
        }
      }
    };
  },
  
  // Load a 3D model (utility method for components)
  async loadModel(modelPath: string): Promise<THREE.Group> {
    try {
      const gltf = await useGLTF(modelPath);
      return gltf.scene.clone(); // Return a clone to avoid reference issues
    } catch (error) {
      console.error(`Failed to load model: ${modelPath}`, error);
      throw new Error(`Failed to load model: ${modelPath}`);
    }
  }
};