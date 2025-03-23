import { RoomData } from "./stores/useDesign";
import { 
  findMaterialByDescription, 
  colorFromDescription, 
  dimensionsFromDescription,
  roomTypeFromDescription,
  lightingFromDescription
} from "./designUtils";

// Define typical furniture for different room types
const roomTypeFurniture: Record<string, Array<{ type: string, color: string, position: any, rotation: number }>> = {
  "living room": [
    { type: "sofa", color: "#6B8E23", position: { x: 0, y: 0.25, z: 2 }, rotation: 0 },
    { type: "table", color: "#8B4513", position: { x: 0, y: 0, z: 0.8 }, rotation: 0 },
    { type: "chair", color: "#708090", position: { x: -1.5, y: 0, z: 0 }, rotation: 45 },
    { type: "chair", color: "#708090", position: { x: 1.5, y: 0, z: 0 }, rotation: -45 },
    { type: "lamp", color: "#F5F5DC", position: { x: -2, y: 0, z: 2 }, rotation: 0 },
    { type: "plant", color: "#228B22", position: { x: 2, y: 0, z: 2 }, rotation: 0 },
  ],
  "bedroom": [
    { type: "bed", color: "#4682B4", position: { x: 0, y: 0, z: 0 }, rotation: 0 },
    { type: "cabinet", color: "#8B4513", position: { x: 2, y: 0, z: -1 }, rotation: 90 },
    { type: "cabinet", color: "#8B4513", position: { x: -2, y: 0, z: -1 }, rotation: -90 },
    { type: "lamp", color: "#F5F5DC", position: { x: -1.5, y: 0, z: -1 }, rotation: 0 },
  ],
  "kitchen": [
    { type: "cabinet", color: "#2F4F4F", position: { x: -2, y: 0, z: -2 }, rotation: 0 },
    { type: "cabinet", color: "#2F4F4F", position: { x: -1, y: 0, z: -2 }, rotation: 0 },
    { type: "cabinet", color: "#2F4F4F", position: { x: 0, y: 0, z: -2 }, rotation: 0 },
    { type: "cabinet", color: "#2F4F4F", position: { x: 1, y: 0, z: -2 }, rotation: 0 },
    { type: "cabinet", color: "#2F4F4F", position: { x: 2, y: 0, z: -2 }, rotation: 0 },
    { type: "table", color: "#8B4513", position: { x: 0, y: 0, z: 1 }, rotation: 0 },
    { type: "chair", color: "#A0522D", position: { x: -1, y: 0, z: 1 }, rotation: 0 },
    { type: "chair", color: "#A0522D", position: { x: 1, y: 0, z: 1 }, rotation: 0 },
  ],
  "office": [
    { type: "desk", color: "#5F9EA0", position: { x: 0, y: 0, z: -1.5 }, rotation: 0 },
    { type: "chair", color: "#000000", position: { x: 0, y: 0, z: -0.5 }, rotation: 180 },
    { type: "bookshelf", color: "#8B4513", position: { x: -2, y: 0, z: -2 }, rotation: 0 },
    { type: "lamp", color: "#F5F5DC", position: { x: 1, y: 0, z: -1.5 }, rotation: 0 },
    { type: "plant", color: "#006400", position: { x: 2, y: 0, z: -2 }, rotation: 0 },
  ],
  "bathroom": [
    { type: "cabinet", color: "#FFFFFF", position: { x: -1.5, y: 0, z: -1.5 }, rotation: 0 },
    { type: "cabinet", color: "#FFFFFF", position: { x: 1.5, y: 0, z: -1.5 }, rotation: 0 },
    { type: "rug", color: "#87CEFA", position: { x: 0, y: 0, z: 0 }, rotation: 0 },
  ],
  "dining room": [
    { type: "table", color: "#8B4513", position: { x: 0, y: 0, z: 0 }, rotation: 0 },
    { type: "chair", color: "#A0522D", position: { x: -1, y: 0, z: -1 }, rotation: 0 },
    { type: "chair", color: "#A0522D", position: { x: 1, y: 0, z: -1 }, rotation: 0 },
    { type: "chair", color: "#A0522D", position: { x: -1, y: 0, z: 1 }, rotation: 180 },
    { type: "chair", color: "#A0522D", position: { x: 1, y: 0, z: 1 }, rotation: 180 },
    { type: "cabinet", color: "#8B4513", position: { x: -2, y: 0, z: -2 }, rotation: 0 },
    { type: "lamp", color: "#F5F5DC", position: { x: 2, y: 0, z: -2 }, rotation: 0 },
  ]
};

// Parse text description to design data
export const parseTextToDesign = async (description: string): Promise<Partial<RoomData>> => {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  console.log("Parsing description:", description);
  
  // Extract room type
  const roomType = roomTypeFromDescription(description);
  console.log("Identified room type:", roomType);
  
  // Extract dimensions
  const dimensions = dimensionsFromDescription(description);
  console.log("Determined dimensions:", dimensions);
  
  // Extract materials
  const wallMaterial = findMaterialByDescription(description + " wall");
  const floorMaterial = findMaterialByDescription(description + " floor");
  const ceilingMaterial = findMaterialByDescription(description + " ceiling");
  
  // Extract colors
  wallMaterial.color = colorFromDescription(description + " wall");
  floorMaterial.color = colorFromDescription(description + " floor");
  ceilingMaterial.color = colorFromDescription(description + " ceiling");
  
  // Extract lighting
  const lighting = lightingFromDescription(description);
  
  // Determine furniture based on room type
  const furniture = roomTypeFurniture[roomType] || roomTypeFurniture["living room"];
  
  // Scale furniture positions based on room size
  const scaledFurniture = furniture.map(item => {
    const posScale = Math.min(dimensions.width, dimensions.depth) / 6; // Scale based on room size
    return {
      ...item,
      position: {
        x: item.position.x * posScale,
        y: item.position.y,
        z: item.position.z * posScale
      },
      scale: 1
    };
  });
  
  // Add a window to the north wall
  const windows = [
    {
      position: { 
        x: 0, 
        y: dimensions.height / 2, 
        z: -(dimensions.depth / 2) 
      },
      width: dimensions.width * 0.25,
      height: dimensions.height * 0.4,
      rotation: 0
    }
  ];
  
  // Add a door to the south wall
  const doors = [
    {
      position: { 
        x: -(dimensions.width / 4), 
        y: dimensions.height / 2.2, 
        z: dimensions.depth / 2 
      },
      width: dimensions.width * 0.15,
      height: dimensions.height * 0.8,
      rotation: 0,
      color: "#8B4513" // Brown door
    }
  ];
  
  // Add a light source in the middle of the ceiling
  const additionalLights = [
    {
      x: 0,
      y: dimensions.height - 0.1,
      z: 0,
      color: "#FFF9C4", // Warm light
      intensity: 0.8,
      castShadow: true
    }
  ];
  
  // Return the parsed design data
  return {
    width: dimensions.width,
    height: dimensions.height,
    depth: dimensions.depth,
    wallMaterial,
    floorMaterial,
    ceilingMaterial,
    ambientLightIntensity: lighting.ambient,
    directionalLightIntensity: lighting.directional,
    backgroundColor: lighting.backgroundColor,
    furniture: scaledFurniture,
    windows,
    doors,
    additionalLights
  };
};
