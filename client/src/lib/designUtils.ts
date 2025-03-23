import { RoomData, Material } from "./stores/useDesign";
import { materialOptions } from "./materialLibrary";

// Default room configuration
export const defaultRoomConfig: RoomData = {
  width: 6,
  height: 3,
  depth: 6,
  wallMaterial: {
    name: "plaster",
    texture: "asphalt.png",
    color: "#f5f5f5",
    scale: 2,
    roughness: 0.7,
    metalness: 0.1
  },
  floorMaterial: {
    name: "wood",
    texture: "wood.jpg",
    color: "#c4a484",
    scale: 1,
    roughness: 0.5,
    metalness: 0.1
  },
  ceilingMaterial: {
    name: "plaster",
    texture: "asphalt.png",
    color: "#ffffff",
    scale: 2,
    roughness: 0.7,
    metalness: 0.1
  },
  ambientLightIntensity: 0.5,
  directionalLightIntensity: 1,
  additionalLights: [],
  backgroundColor: "#87CEEB", // Sky blue
  furniture: [],
  windows: [
    {
      position: { x: 0, y: 1.5, z: 3 },
      width: 1.2,
      height: 1.2,
      rotation: 0
    }
  ],
  doors: [
    {
      position: { x: -3, y: 1.2, z: 0 },
      width: 1,
      height: 2.2,
      rotation: 90,
      color: "#8B4513" // Brown
    }
  ]
};

// Helper function to find a material by name
export const findMaterialByName = (name: string): Material => {
  const material = materialOptions.find(m => m.name === name);
  if (!material) {
    return materialOptions[0]; // Return default material if not found
  }
  return material;
};

// Helper to find the closest material by description
export const findMaterialByDescription = (description: string): Material => {
  const descLower = description.toLowerCase();
  
  // Keywords match table
  const materialKeywords: Record<string, string[]> = {
    wood: ["wood", "wooden", "timber", "hardwood", "oak", "maple", "pine"],
    concrete: ["concrete", "cement", "gray", "industrial"],
    marble: ["marble", "stone", "granite", "luxury"],
    brick: ["brick", "red brick", "exposed brick", "rustic"],
    plaster: ["plaster", "drywall", "painted", "white wall", "smooth"],
    tile: ["tile", "tiles", "ceramic", "porcelain", "bathroom"],
    carpet: ["carpet", "rug", "soft", "plush", "wool"]
  };
  
  // Find matching material
  for (const [matName, keywords] of Object.entries(materialKeywords)) {
    if (keywords.some(keyword => descLower.includes(keyword))) {
      return findMaterialByName(matName);
    }
  }
  
  // Default to plaster if no matches
  return findMaterialByName("plaster");
};

// Helper function to determine color from text description
export const colorFromDescription = (description: string): string => {
  const descLower = description.toLowerCase();
  
  // Color mapping
  const colorMap: Record<string, string> = {
    white: "#FFFFFF",
    black: "#000000",
    gray: "#808080",
    grey: "#808080",
    red: "#FF0000",
    blue: "#0000FF",
    green: "#008000",
    yellow: "#FFFF00",
    purple: "#800080",
    pink: "#FFC0CB",
    orange: "#FFA500",
    brown: "#8B4513",
    beige: "#F5F5DC",
    tan: "#D2B48C",
    teal: "#008080",
    navy: "#000080",
    cream: "#FFFDD0",
    ivory: "#FFFFF0",
    olive: "#808000",
    maroon: "#800000",
    gold: "#FFD700",
    silver: "#C0C0C0",
  };
  
  // Look for color mentions
  for (const [colorName, colorCode] of Object.entries(colorMap)) {
    if (descLower.includes(colorName)) {
      return colorCode;
    }
  }
  
  // Default colors for common elements if specific color not found
  if (descLower.includes("wall")) return "#F5F5F5"; // Off-white for walls
  if (descLower.includes("floor")) return "#C4A484"; // Wood brown for floors
  if (descLower.includes("ceiling")) return "#FFFFFF"; // White for ceilings
  
  return "#CCCCCC"; // Default neutral gray
};

// Function to determine dimensions from description
export const dimensionsFromDescription = (description: string): { width: number, height: number, depth: number } => {
  const descLower = description.toLowerCase();
  
  // Default to medium room
  let size = "medium";
  
  // Determine size from keywords
  if (descLower.includes("small") || descLower.includes("tiny") || descLower.includes("compact")) {
    size = "small";
  }
  else if (descLower.includes("large") || descLower.includes("big") || descLower.includes("spacious")) {
    size = "large";
  }
  else if (descLower.includes("huge") || descLower.includes("enormous") || descLower.includes("vast")) {
    size = "huge";
  }
  
  // Size to dimensions mapping
  const sizeMap = {
    small: { width: 4, height: 2.7, depth: 4 },
    medium: { width: 6, height: 3, depth: 6 },
    large: { width: 8, height: 3.2, depth: 8 },
    huge: { width: 10, height: 3.5, depth: 10 }
  };
  
  return sizeMap[size as keyof typeof sizeMap];
};

// Function to parse room type from description
export const roomTypeFromDescription = (description: string): string => {
  const descLower = description.toLowerCase();
  
  // Room type keywords
  const roomTypes = [
    { type: "living room", keywords: ["living room", "lounge", "family room", "sitting room"] },
    { type: "bedroom", keywords: ["bedroom", "master bedroom", "guest room", "sleeping"] },
    { type: "kitchen", keywords: ["kitchen", "cooking", "culinary"] },
    { type: "bathroom", keywords: ["bathroom", "bath", "shower", "toilet"] },
    { type: "dining room", keywords: ["dining room", "dining area", "eating area"] },
    { type: "office", keywords: ["office", "study", "work room", "home office"] },
    { type: "library", keywords: ["library", "book room", "reading room"] },
    { type: "playroom", keywords: ["playroom", "game room", "entertainment"] },
  ];
  
  // Find matching room type
  for (const { type, keywords } of roomTypes) {
    if (keywords.some(keyword => descLower.includes(keyword))) {
      return type;
    }
  }
  
  return "living room"; // Default
};

// Function to determine lighting settings from description
export const lightingFromDescription = (description: string): { ambient: number, directional: number, backgroundColor: string } => {
  const descLower = description.toLowerCase();
  
  // Default (medium brightness, neutral day)
  let lighting = {
    ambient: 0.5,
    directional: 1.0,
    backgroundColor: "#87CEEB" // Default sky blue
  };
  
  // Time of day lighting
  if (descLower.includes("morning") || descLower.includes("sunrise") || descLower.includes("dawn")) {
    lighting = {
      ambient: 0.4,
      directional: 0.9,
      backgroundColor: "#FFB6C1" // Light pink
    };
  }
  else if (descLower.includes("noon") || descLower.includes("midday") || descLower.includes("bright day")) {
    lighting = {
      ambient: 0.6,
      directional: 1.2,
      backgroundColor: "#87CEEB" // Sky blue
    };
  }
  else if (descLower.includes("evening") || descLower.includes("sunset") || descLower.includes("dusk")) {
    lighting = {
      ambient: 0.4,
      directional: 0.7,
      backgroundColor: "#FFA07A" // Light salmon
    };
  }
  else if (descLower.includes("night") || descLower.includes("dark")) {
    lighting = {
      ambient: 0.3,
      directional: 0.4,
      backgroundColor: "#191970" // Midnight blue
    };
  }
  
  // Brightness adjustments
  if (descLower.includes("bright") || descLower.includes("well-lit") || descLower.includes("sunny")) {
    lighting.ambient += 0.1;
    lighting.directional += 0.2;
  }
  else if (descLower.includes("dim") || descLower.includes("dark") || descLower.includes("moody")) {
    lighting.ambient -= 0.1;
    lighting.directional -= 0.2;
  }
  
  // Ensure values are within reasonable ranges
  lighting.ambient = Math.max(0.2, Math.min(0.8, lighting.ambient));
  lighting.directional = Math.max(0.3, Math.min(1.5, lighting.directional));
  
  return lighting;
};
