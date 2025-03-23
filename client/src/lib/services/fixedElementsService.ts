import { Furniture } from "../stores/useDesign";
import * as THREE from "three";

// Types for the fixed elements
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

// The service to handle fixed architectural elements
export const FixedElementsService = {
  // Get all available fixed element types
  getAvailableFixedElements(): FixedElementType[] {
    return fixedElementTypes;
  },

  // Get a fixed element by ID
  getFixedElementById(id: string): FixedElementType | undefined {
    return fixedElementTypes.find(element => element.id === id);
  },

  // Convert a FixedElementType to a Furniture object
  createFixedFurniture(
    element: FixedElementType,
    position = { x: 0, y: 0, z: 0 },
    rotation = 0,
    color = "#FFFFFF"
  ): Furniture {
    return {
      type: element.category,
      position,
      rotation,
      color,
      scale: 1,
      isFixed: true,
      modelPath: element.modelPath,
      productInfo: {
        name: element.name,
        brand: "Custom",
        price: 0, // Fixed elements don't have a price
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

  // Load a 3D model for a fixed element
  async loadModel(modelPath: string): Promise<THREE.Group> {
    // This would normally load a GLB model using THREE.GLTFLoader
    // For simplicity, we'll just return a placeholder mesh
    const group = new THREE.Group();
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const mesh = new THREE.Mesh(geometry, material);
    group.add(mesh);
    return group;
  }
};

// Available fixed element types
const fixedElementTypes: FixedElementType[] = [
  {
    id: "built-in-bookshelf",
    name: "Built-in Bookshelf",
    description: "A modern wall-mounted bookshelf with multiple compartments",
    modelPath: "/models/built_in_bookshelf.glb",
    category: "bookshelf",
    defaultDimensions: {
      width: 2.0,
      height: 2.2,
      depth: 0.4
    }
  },
  {
    id: "kitchen-cabinets",
    name: "Kitchen Cabinets",
    description: "A set of built-in kitchen cabinets with countertop",
    modelPath: "/models/kitchen_cabinets.glb",
    category: "cabinet",
    defaultDimensions: {
      width: 2.5,
      height: 2.0,
      depth: 0.6
    }
  },
  {
    id: "wall-fireplace",
    name: "Wall Fireplace",
    description: "A sleek modern wall-mounted fireplace",
    modelPath: "/models/wall_fireplace.glb",
    category: "fireplace",
    defaultDimensions: {
      width: 1.2,
      height: 0.8,
      depth: 0.2
    }
  },
  {
    id: "wall-tv-unit",
    name: "TV Wall Unit",
    description: "A wall-mounted TV entertainment center",
    modelPath: "/models/wall_tv_unit.glb",
    category: "entertainment",
    defaultDimensions: {
      width: 2.0,
      height: 1.8,
      depth: 0.5
    }
  },
  {
    id: "closet-wardrobe",
    name: "Built-in Closet Wardrobe",
    description: "A floor-to-ceiling built-in wardrobe closet",
    modelPath: "/models/closet_wardrobe.glb",
    category: "storage",
    defaultDimensions: {
      width: 2.4,
      height: 2.4,
      depth: 0.6
    }
  }
];