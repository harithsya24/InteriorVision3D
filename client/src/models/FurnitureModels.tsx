import * as THREE from "three";
import { useRef, useState, useEffect, Suspense } from "react";
import { useDesign, Furniture } from "../lib/stores/useDesign";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

// Preload the 3D models for fixed architectural elements
useGLTF.preload('/models/built_in_bookshelf.glb');
useGLTF.preload('/models/kitchen_cabinets.glb');
useGLTF.preload('/models/wall_fireplace.glb');

// Custom model loader component
const Model = ({ modelPath, position, rotation, scale = 1 }: { 
  modelPath: string, 
  position: [number, number, number], 
  rotation: [number, number, number],
  scale?: number 
}) => {
  const { scene } = useGLTF(modelPath) as GLTF & {
    scene: THREE.Group
  };
  
  const clonedScene = scene.clone();
  
  return (
    <primitive 
      object={clonedScene} 
      position={position}
      rotation={rotation}
      scale={[scale, scale, scale]}
      castShadow
      receiveShadow
    />
  );
};

const FurnitureModels = () => {
  const { roomData } = useDesign();
  
  // Create refs for furniture pieces
  const furnitureRefs = useRef<THREE.Mesh[]>([]);
  
  // Function to create a simple sofa model
  const createSofa = (position: any, rotation: number, color: string) => {
    return (
      <group
        position={[position.x, position.y, position.z]}
        rotation={[0, rotation * Math.PI / 180, 0]}
      >
        {/* Base */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2, 0.5, 0.8]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Back */}
        <mesh position={[0, 0.5, -0.3]} castShadow receiveShadow>
          <boxGeometry args={[2, 0.7, 0.2]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Arms */}
        <mesh position={[-0.9, 0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.5, 0.8]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0.9, 0.3, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.5, 0.8]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    );
  };
  
  // Function to create a simple chair model
  const createChair = (position: any, rotation: number, color: string) => {
    return (
      <group
        position={[position.x, position.y, position.z]}
        rotation={[0, rotation * Math.PI / 180, 0]}
      >
        {/* Seat */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.5, 0.1, 0.5]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Back */}
        <mesh position={[0, 0.4, -0.2]} castShadow receiveShadow>
          <boxGeometry args={[0.5, 0.7, 0.1]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Legs */}
        <mesh position={[-0.2, -0.25, -0.2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.5]} />
          <meshStandardMaterial color="#5e5e5e" />
        </mesh>
        <mesh position={[0.2, -0.25, -0.2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.5]} />
          <meshStandardMaterial color="#5e5e5e" />
        </mesh>
        <mesh position={[-0.2, -0.25, 0.2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.5]} />
          <meshStandardMaterial color="#5e5e5e" />
        </mesh>
        <mesh position={[0.2, -0.25, 0.2]} castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.5]} />
          <meshStandardMaterial color="#5e5e5e" />
        </mesh>
      </group>
    );
  };
  
  // Function to create a simple table model
  const createTable = (position: any, rotation: number, color: string) => {
    return (
      <group
        position={[position.x, position.y, position.z]}
        rotation={[0, rotation * Math.PI / 180, 0]}
      >
        {/* Tabletop */}
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.1, 0.8]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Legs */}
        <mesh position={[-0.5, 0.35, -0.3]} castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.8]} />
          <meshStandardMaterial color="#5e5e5e" />
        </mesh>
        <mesh position={[0.5, 0.35, -0.3]} castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.8]} />
          <meshStandardMaterial color="#5e5e5e" />
        </mesh>
        <mesh position={[-0.5, 0.35, 0.3]} castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.8]} />
          <meshStandardMaterial color="#5e5e5e" />
        </mesh>
        <mesh position={[0.5, 0.35, 0.3]} castShadow receiveShadow>
          <cylinderGeometry args={[0.05, 0.05, 0.8]} />
          <meshStandardMaterial color="#5e5e5e" />
        </mesh>
      </group>
    );
  };
  
  // Function to create a simple bed model
  const createBed = (position: any, rotation: number, color: string) => {
    return (
      <group
        position={[position.x, position.y, position.z]}
        rotation={[0, rotation * Math.PI / 180, 0]}
      >
        {/* Base */}
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[2, 0.4, 1.6]} />
          <meshStandardMaterial color="#5e5e5e" />
        </mesh>
        {/* Mattress */}
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.9, 0.1, 1.5]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Pillow */}
        <mesh position={[0, 0.55, -0.5]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.1, 0.4]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Headboard */}
        <mesh position={[0, 0.9, -0.75]} castShadow receiveShadow>
          <boxGeometry args={[2, 1, 0.1]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Blanket */}
        <mesh position={[0, 0.5, 0.2]} castShadow receiveShadow>
          <boxGeometry args={[1.8, 0.05, 1]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    );
  };
  
  // Function to create a simple desk model
  const createDesk = (position: any, rotation: number, color: string) => {
    return (
      <group
        position={[position.x, position.y, position.z]}
        rotation={[0, rotation * Math.PI / 180, 0]}
      >
        {/* Tabletop */}
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.05, 0.7]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Drawer */}
        <mesh position={[0.3, 0.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.4, 0.2, 0.65]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Legs */}
        <mesh position={[-0.55, 0.35, -0.3]} castShadow receiveShadow>
          <boxGeometry args={[0.05, 0.75, 0.05]} />
          <meshStandardMaterial color="#3a3a3a" />
        </mesh>
        <mesh position={[0.55, 0.35, -0.3]} castShadow receiveShadow>
          <boxGeometry args={[0.05, 0.75, 0.05]} />
          <meshStandardMaterial color="#3a3a3a" />
        </mesh>
        <mesh position={[-0.55, 0.35, 0.3]} castShadow receiveShadow>
          <boxGeometry args={[0.05, 0.75, 0.05]} />
          <meshStandardMaterial color="#3a3a3a" />
        </mesh>
        <mesh position={[0.55, 0.35, 0.3]} castShadow receiveShadow>
          <boxGeometry args={[0.05, 0.75, 0.05]} />
          <meshStandardMaterial color="#3a3a3a" />
        </mesh>
      </group>
    );
  };
  
  // Function to create a simple cabinet model
  const createCabinet = (position: any, rotation: number, color: string) => {
    return (
      <group
        position={[position.x, position.y, position.z]}
        rotation={[0, rotation * Math.PI / 180, 0]}
      >
        {/* Main body */}
        <mesh position={[0, 1, 0]} castShadow receiveShadow>
          <boxGeometry args={[1, 2, 0.5]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Door */}
        <mesh position={[0, 1, 0.26]} castShadow receiveShadow>
          <boxGeometry args={[0.95, 1.9, 0.02]} />
          <meshStandardMaterial color={color} metalness={0.2} roughness={0.8} />
        </mesh>
        {/* Handle */}
        <mesh position={[0.4, 1, 0.28]} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.1]} />
          <meshStandardMaterial color="#aaaaaa" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>
    );
  };
  
  // Function to create a simple bookshelf model
  const createBookshelf = (position: any, rotation: number, color: string) => {
    return (
      <group
        position={[position.x, position.y, position.z]}
        rotation={[0, rotation * Math.PI / 180, 0]}
      >
        {/* Main frame */}
        <mesh position={[0, 1, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 2, 0.3]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Shelves */}
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.03, 0.28]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.03, 0.28]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, 1.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.03, 0.28]} />
          <meshStandardMaterial color={color} />
        </mesh>
        <mesh position={[0, 1.9, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.03, 0.28]} />
          <meshStandardMaterial color={color} />
        </mesh>
        
        {/* Books (simplified as colored boxes) */}
        <mesh position={[-0.3, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.4, 0.3, 0.2]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        <mesh position={[0.3, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.4, 0.3, 0.2]} />
          <meshStandardMaterial color="#A52A2A" />
        </mesh>
        <mesh position={[-0.2, 0.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.3, 0.2]} />
          <meshStandardMaterial color="#556B2F" />
        </mesh>
        <mesh position={[0.4, 0.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 0.3, 0.2]} />
          <meshStandardMaterial color="#191970" />
        </mesh>
        <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.8, 0.3, 0.2]} />
          <meshStandardMaterial color="#800000" />
        </mesh>
        <mesh position={[0.1, 1.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.3, 0.2]} />
          <meshStandardMaterial color="#000080" />
        </mesh>
      </group>
    );
  };
  
  // Function to create a simple lamp model
  const createLamp = (position: any, rotation: number, color: string) => {
    return (
      <group
        position={[position.x, position.y, position.z]}
        rotation={[0, rotation * Math.PI / 180, 0]}
      >
        {/* Base */}
        <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.3, 0.1]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        {/* Stand */}
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.3]} />
          <meshStandardMaterial color="#777777" />
        </mesh>
        {/* Lamp shade */}
        <mesh position={[0, 1.4, 0]} rotation={[Math.PI, 0, 0]} castShadow receiveShadow>
          <coneGeometry args={[0.25, 0.4, 32]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Light source */}
        <pointLight position={[0, 1.3, 0]} intensity={0.8} color="#fff9e6" />
      </group>
    );
  };
  
  // Function to create a simple plant model
  const createPlant = (position: any, rotation: number, color: string) => {
    return (
      <group
        position={[position.x, position.y, position.z]}
        rotation={[0, rotation * Math.PI / 180, 0]}
      >
        {/* Pot */}
        <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.15, 0.3]} />
          <meshStandardMaterial color="#964B00" />
        </mesh>
        {/* Plant base */}
        <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.25, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color={color} />
        </mesh>
        {/* Plant top */}
        <mesh position={[0, 0.6, 0]} castShadow receiveShadow>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshStandardMaterial color={color} />
        </mesh>
      </group>
    );
  };
  
  // Function to create a simple rug model
  const createRug = (position: any, rotation: number, color: string) => {
    return (
      <mesh
        position={[position.x, position.y + 0.01, position.z]}
        rotation={[0, rotation * Math.PI / 180, 0]}
        receiveShadow
      >
        <boxGeometry args={[2, 0.02, 1.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
    );
  };
  
  // Function to render a specific furniture item
  const renderFurniture = (item: Furniture, index: number) => {
    // Check if this is a fixed element with a 3D model
    if (item.isFixed && item.modelPath) {
      return (
        <Suspense 
          key={`model-${index}`}
          fallback={
            <mesh 
              position={[item.position.x, item.position.y, item.position.z]}
              castShadow
              receiveShadow
            >
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={item.color} />
            </mesh>
          }
        >
          <Model 
            modelPath={item.modelPath}
            position={[item.position.x, item.position.y, item.position.z]}
            rotation={[0, item.rotation * Math.PI / 180, 0]}
            scale={item.scale}
          />
        </Suspense>
      );
    }
    
    // Otherwise render built-in furniture models
    switch (item.type) {
      case 'sofa':
        return <group key={`furniture-${index}`}>{createSofa(item.position, item.rotation, item.color)}</group>;
      case 'chair':
        return <group key={`furniture-${index}`}>{createChair(item.position, item.rotation, item.color)}</group>;
      case 'table':
        return <group key={`furniture-${index}`}>{createTable(item.position, item.rotation, item.color)}</group>;
      case 'bed':
        return <group key={`furniture-${index}`}>{createBed(item.position, item.rotation, item.color)}</group>;
      case 'desk':
        return <group key={`furniture-${index}`}>{createDesk(item.position, item.rotation, item.color)}</group>;
      case 'cabinet':
        return <group key={`furniture-${index}`}>{createCabinet(item.position, item.rotation, item.color)}</group>;
      case 'bookshelf':
        return <group key={`furniture-${index}`}>{createBookshelf(item.position, item.rotation, item.color)}</group>;
      case 'lamp':
        return <group key={`furniture-${index}`}>{createLamp(item.position, item.rotation, item.color)}</group>;
      case 'plant':
        return <group key={`furniture-${index}`}>{createPlant(item.position, item.rotation, item.color)}</group>;
      case 'rug':
        return <group key={`furniture-${index}`}>{createRug(item.position, item.rotation, item.color)}</group>;
      case 'fireplace':
        // Use a fallback model if no 3D model is specified
        return <group key={`furniture-${index}`}>
          <mesh 
            position={[item.position.x, item.position.y + 0.5, item.position.z]}
            rotation={[0, item.rotation * Math.PI / 180, 0]}
            castShadow 
            receiveShadow
          >
            <boxGeometry args={[1.2, 1, 0.4]} />
            <meshStandardMaterial color={item.color} />
          </mesh>
        </group>;
      default:
        return <group key={`furniture-${index}`}>
          <mesh 
            position={[item.position.x, item.position.y + 0.5, item.position.z]}
            rotation={[0, item.rotation * Math.PI / 180, 0]}
            castShadow 
            receiveShadow
          >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={item.color} />
          </mesh>
        </group>;
    }
  };
  
  // Return the furniture items
  return (
    <group>
      {roomData.furniture.map((item, index) => renderFurniture(item, index))}
    </group>
  );
};

export default FurnitureModels;
