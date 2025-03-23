import { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useDesign, Furniture } from "../lib/stores/useDesign";
import DraggableFurniture from "./DraggableFurniture";

const RoomFurniture: React.FC = () => {
  const { roomData } = useDesign();
  
  // Preload all available fixed element models
  useEffect(() => {
    const modelPaths = [
      "/models/built_in_bookshelf.glb",
      "/models/kitchen_cabinets.glb",
      "/models/wall_fireplace.glb",
      "/models/wall_tv_unit.glb",
      "/models/closet_wardrobe.glb"
    ];
    
    modelPaths.forEach(path => {
      useGLTF.preload(path);
    });
  }, []);
  
  // Render all furniture items
  return (
    <group>
      {roomData.furniture.map((item, index) => (
        <DraggableFurniture 
          key={`furniture-${index}`}
          furniture={item} 
          index={index} 
        />
      ))}
    </group>
  );
};

export default RoomFurniture;