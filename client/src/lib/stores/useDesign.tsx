import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { materialOptions } from "../materialLibrary";
import { defaultRoomConfig } from "../designUtils";

// Camera position type
export type CameraPosition = {
  x: number;
  y: number;
  z: number;
};

// Additional light type
export type AdditionalLight = {
  x: number;
  y: number;
  z: number;
  color: string;
  intensity: number;
  castShadow: boolean;
};

// Material type
export type Material = {
  name: string;
  texture: string;
  color: string;
  scale: number;
  roughness?: number;
  metalness?: number;
};

// Furniture type
export type Furniture = {
  type: string;
  position: {
    x: number;
    y: number;
    z: number;
  };
  rotation: number;
  color: string;
  scale: number;
};

// Window type
export type Window = {
  position: {
    x: number;
    y: number;
    z: number;
  };
  width: number;
  height: number;
  rotation: number;
};

// Door type
export type Door = {
  position: {
    x: number;
    y: number;
    z: number;
  };
  width: number;
  height: number;
  rotation: number;
  color: string;
};

// Room data type
export type RoomData = {
  width: number;
  height: number;
  depth: number;
  wallMaterial: Material;
  floorMaterial: Material;
  ceilingMaterial: Material;
  ambientLightIntensity: number;
  directionalLightIntensity: number;
  additionalLights: AdditionalLight[];
  backgroundColor: string;
  furniture: Furniture[];
  windows: Window[];
  doors: Door[];
};

// Design store state type
interface DesignState {
  roomData: RoomData;
  cameraPosition: CameraPosition;
  viewMode: 'firstPerson' | 'orbit';
  
  // Actions
  initializeDesign: () => void;
  resetRoom: () => void;
  updateRoomDimensions: (width: number, height: number, depth: number) => void;
  updateWallMaterial: (material: Material) => void;
  updateFloorMaterial: (material: Material) => void;
  updateCeilingMaterial: (material: Material) => void;
  updateAmbientLight: (intensity: number) => void;
  updateDirectionalLight: (intensity: number) => void;
  updateBackgroundColor: (color: string) => void;
  addLight: (light: AdditionalLight) => void;
  removeLight: (index: number) => void;
  addFurniture: (furniture: Furniture) => void;
  removeFurniture: (index: number) => void;
  updateFurniturePosition: (index: number, position: { x: number, y: number, z: number }) => void;
  updateFurnitureRotation: (index: number, rotation: number) => void;
  updateFurnitureColor: (index: number, color: string) => void;
  addWindow: (window: Window) => void;
  removeWindow: (index: number) => void;
  addDoor: (door: Door) => void;
  removeDoor: (index: number) => void;
  updateRoomFromDescription: (data: Partial<RoomData>) => void;
  setViewMode: (mode: 'firstPerson' | 'orbit') => void;
  setCameraPosition: (position: CameraPosition) => void;
}

export const useDesign = create<DesignState>()(
  subscribeWithSelector((set) => ({
    roomData: defaultRoomConfig,
    cameraPosition: { x: 0, y: 1.65, z: 5 },
    viewMode: 'orbit',
    
    initializeDesign: () => {
      set({ roomData: defaultRoomConfig });
    },
    
    resetRoom: () => {
      set({ roomData: defaultRoomConfig });
    },
    
    updateRoomDimensions: (width, height, depth) => {
      set((state) => ({
        roomData: {
          ...state.roomData,
          width,
          height,
          depth
        }
      }));
    },
    
    updateWallMaterial: (material) => {
      set((state) => ({
        roomData: {
          ...state.roomData,
          wallMaterial: material
        }
      }));
    },
    
    updateFloorMaterial: (material) => {
      set((state) => ({
        roomData: {
          ...state.roomData,
          floorMaterial: material
        }
      }));
    },
    
    updateCeilingMaterial: (material) => {
      set((state) => ({
        roomData: {
          ...state.roomData,
          ceilingMaterial: material
        }
      }));
    },
    
    updateAmbientLight: (intensity) => {
      set((state) => ({
        roomData: {
          ...state.roomData,
          ambientLightIntensity: intensity
        }
      }));
    },
    
    updateDirectionalLight: (intensity) => {
      set((state) => ({
        roomData: {
          ...state.roomData,
          directionalLightIntensity: intensity
        }
      }));
    },
    
    updateBackgroundColor: (color) => {
      set((state) => ({
        roomData: {
          ...state.roomData,
          backgroundColor: color
        }
      }));
    },
    
    addLight: (light) => {
      set((state) => ({
        roomData: {
          ...state.roomData,
          additionalLights: [...state.roomData.additionalLights, light]
        }
      }));
    },
    
    removeLight: (index) => {
      set((state) => ({
        roomData: {
          ...state.roomData,
          additionalLights: state.roomData.additionalLights.filter((_, i) => i !== index)
        }
      }));
    },
    
    addFurniture: (furniture) => {
      set((state) => ({
        roomData: {
          ...state.roomData,
          furniture: [...state.roomData.furniture, furniture]
        }
      }));
    },
    
    removeFurniture: (index) => {
      set((state) => ({
        roomData: {
          ...state.roomData,
          furniture: state.roomData.furniture.filter((_, i) => i !== index)
        }
      }));
    },
    
    updateFurniturePosition: (index, position) => {
      set((state) => {
        const updatedFurniture = [...state.roomData.furniture];
        if (updatedFurniture[index]) {
          updatedFurniture[index] = {
            ...updatedFurniture[index],
            position
          };
        }
        return {
          roomData: {
            ...state.roomData,
            furniture: updatedFurniture
          }
        };
      });
    },
    
    updateFurnitureRotation: (index, rotation) => {
      set((state) => {
        const updatedFurniture = [...state.roomData.furniture];
        if (updatedFurniture[index]) {
          updatedFurniture[index] = {
            ...updatedFurniture[index],
            rotation
          };
        }
        return {
          roomData: {
            ...state.roomData,
            furniture: updatedFurniture
          }
        };
      });
    },
    
    updateFurnitureColor: (index, color) => {
      set((state) => {
        const updatedFurniture = [...state.roomData.furniture];
        if (updatedFurniture[index]) {
          updatedFurniture[index] = {
            ...updatedFurniture[index],
            color
          };
        }
        return {
          roomData: {
            ...state.roomData,
            furniture: updatedFurniture
          }
        };
      });
    },
    
    addWindow: (window) => {
      set((state) => ({
        roomData: {
          ...state.roomData,
          windows: [...state.roomData.windows, window]
        }
      }));
    },
    
    removeWindow: (index) => {
      set((state) => ({
        roomData: {
          ...state.roomData,
          windows: state.roomData.windows.filter((_, i) => i !== index)
        }
      }));
    },
    
    addDoor: (door) => {
      set((state) => ({
        roomData: {
          ...state.roomData,
          doors: [...state.roomData.doors, door]
        }
      }));
    },
    
    removeDoor: (index) => {
      set((state) => ({
        roomData: {
          ...state.roomData,
          doors: state.roomData.doors.filter((_, i) => i !== index)
        }
      }));
    },
    
    updateRoomFromDescription: (data) => {
      set((state) => ({
        roomData: {
          ...state.roomData,
          ...data,
          // Ensure we maintain any required nested objects that might not be in the data
          furniture: data.furniture || state.roomData.furniture,
          additionalLights: data.additionalLights || state.roomData.additionalLights,
          windows: data.windows || state.roomData.windows,
          doors: data.doors || state.roomData.doors,
          wallMaterial: data.wallMaterial || state.roomData.wallMaterial,
          floorMaterial: data.floorMaterial || state.roomData.floorMaterial,
          ceilingMaterial: data.ceilingMaterial || state.roomData.ceilingMaterial,
        }
      }));
    },
    
    setViewMode: (mode) => {
      set({ viewMode: mode });
    },
    
    setCameraPosition: (position) => {
      set({ cameraPosition: position });
    }
  }))
);
