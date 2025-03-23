import { Material } from "./stores/useDesign";

// Available material options using the textures from the project
export const materialOptions: Material[] = [
  {
    name: "wood",
    displayName: "Wood",
    texture: "wood.jpg",
    color: "#A0522D",
    scale: 1,
    roughness: 0.5,
    metalness: 0.1
  },
  {
    name: "plaster",
    displayName: "Plaster/Wall",
    texture: "asphalt.png",
    color: "#F5F5F5",
    scale: 2,
    roughness: 0.7,
    metalness: 0.1
  },
  {
    name: "concrete",
    displayName: "Concrete",
    texture: "asphalt.png",
    color: "#808080",
    scale: 1,
    roughness: 0.8,
    metalness: 0.2
  },
  {
    name: "grass",
    displayName: "Grass/Plants",
    texture: "grass.png",
    color: "#006400",
    scale: 1,
    roughness: 0.9,
    metalness: 0.0
  },
  {
    name: "sand",
    displayName: "Sand/Beach",
    texture: "sand.jpg",
    color: "#F5DEB3",
    scale: 1,
    roughness: 0.9,
    metalness: 0.0
  },
  {
    name: "tile",
    displayName: "Tile",
    texture: "asphalt.png",
    color: "#E5E5E5",
    scale: 0.5,
    roughness: 0.3,
    metalness: 0.2
  },
  {
    name: "marble",
    displayName: "Marble",
    texture: "asphalt.png",
    color: "#F0F0F0",
    scale: 1,
    roughness: 0.2,
    metalness: 0.3
  },
  {
    name: "carpet",
    displayName: "Carpet",
    texture: "asphalt.png",
    color: "#A52A2A",
    scale: 0.5,
    roughness: 0.9,
    metalness: 0.0
  },
  {
    name: "brick",
    displayName: "Brick",
    texture: "asphalt.png",
    color: "#8B4513",
    scale: 0.3,
    roughness: 0.8,
    metalness: 0.1
  },
  {
    name: "sky",
    displayName: "Sky",
    texture: "sky.png",
    color: "#87CEEB",
    scale: 1,
    roughness: 0.1,
    metalness: 0.0
  }
];

// Function to get a material by name
export const getMaterialByName = (name: string): Material => {
  const material = materialOptions.find(m => m.name === name);
  if (!material) {
    return materialOptions[0]; // Default to first material if not found
  }
  return material;
};
