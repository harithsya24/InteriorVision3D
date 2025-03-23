import { useRef } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { useDesign } from "../lib/stores/useDesign";
import FurnitureModels from "./FurnitureModels";

// Helper function to create material based on texture settings
const createMaterial = (
  texturePath: string,
  scale: number = 1, 
  color: string = "#ffffff"
) => {
  const texture = new THREE.TextureLoader().load(texturePath);
  
  // Set texture repeat based on scale
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(scale, scale);
  
  return new THREE.MeshStandardMaterial({
    map: texture,
    color: new THREE.Color(color),
    roughness: 0.7,
    metalness: 0.1,
  });
};

const RoomModel = () => {
  const {
    roomData
  } = useDesign();
  
  // Get textures from store
  const wallTexturePath = `/textures/${roomData.wallMaterial.texture}`;
  const floorTexturePath = `/textures/${roomData.floorMaterial.texture}`;
  const ceilingTexturePath = `/textures/${roomData.ceilingMaterial.texture}`;
  
  // Load textures
  const wallTexture = useTexture(wallTexturePath);
  const floorTexture = useTexture(floorTexturePath);
  const ceilingTexture = useTexture(ceilingTexturePath);
  
  // Setup texture properties
  wallTexture.wrapS = wallTexture.wrapT = THREE.RepeatWrapping;
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
  ceilingTexture.wrapS = ceilingTexture.wrapT = THREE.RepeatWrapping;
  
  wallTexture.repeat.set(roomData.wallMaterial.scale, roomData.wallMaterial.scale);
  floorTexture.repeat.set(roomData.floorMaterial.scale, roomData.floorMaterial.scale);
  ceilingTexture.repeat.set(roomData.ceilingMaterial.scale, roomData.ceilingMaterial.scale);
  
  // Create materials
  const wallMaterial = new THREE.MeshStandardMaterial({
    map: wallTexture,
    roughness: roomData.wallMaterial.roughness || 0.7,
    metalness: roomData.wallMaterial.metalness || 0.1,
    color: new THREE.Color(roomData.wallMaterial.color || "#ffffff"),
  });
  
  const floorMaterial = new THREE.MeshStandardMaterial({
    map: floorTexture,
    roughness: roomData.floorMaterial.roughness || 0.5,
    metalness: roomData.floorMaterial.metalness || 0.1,
    color: new THREE.Color(roomData.floorMaterial.color || "#ffffff"),
  });
  
  const ceilingMaterial = new THREE.MeshStandardMaterial({
    map: ceilingTexture,
    roughness: roomData.ceilingMaterial.roughness || 0.7,
    metalness: roomData.ceilingMaterial.metalness || 0.1,
    color: new THREE.Color(roomData.ceilingMaterial.color || "#ffffff"),
  });
  
  // Room dimensions
  const width = roomData.width;
  const height = roomData.height;
  const depth = roomData.depth;
  
  // References for the room parts
  const floorRef = useRef<THREE.Mesh>(null);
  const ceilingRef = useRef<THREE.Mesh>(null);
  const wallNRef = useRef<THREE.Mesh>(null);
  const wallERef = useRef<THREE.Mesh>(null);
  const wallSRef = useRef<THREE.Mesh>(null);
  const wallWRef = useRef<THREE.Mesh>(null);
  
  return (
    <group>
      {/* Floor */}
      <mesh 
        ref={floorRef}
        position={[0, 0, 0]} 
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, depth]} />
        <primitive object={floorMaterial} attach="material" />
      </mesh>
      
      {/* Ceiling */}
      <mesh 
        ref={ceilingRef}
        position={[0, height, 0]} 
        rotation={[Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[width, depth]} />
        <primitive object={ceilingMaterial} attach="material" />
      </mesh>
      
      {/* North Wall (back) */}
      <mesh 
        ref={wallNRef}
        position={[0, height / 2, -depth / 2]} 
        castShadow
        receiveShadow
      >
        <planeGeometry args={[width, height]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
      
      {/* East Wall (right) */}
      <mesh 
        ref={wallERef}
        position={[width / 2, height / 2, 0]} 
        rotation={[0, -Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[depth, height]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
      
      {/* South Wall (front) */}
      <mesh 
        ref={wallSRef}
        position={[0, height / 2, depth / 2]} 
        rotation={[0, Math.PI, 0]}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[width, height]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
      
      {/* West Wall (left) */}
      <mesh 
        ref={wallWRef}
        position={[-width / 2, height / 2, 0]} 
        rotation={[0, Math.PI / 2, 0]}
        castShadow
        receiveShadow
      >
        <planeGeometry args={[depth, height]} />
        <primitive object={wallMaterial} attach="material" />
      </mesh>
      
      {/* Windows - if windows are present */}
      {roomData.windows?.map((window, idx) => (
        <mesh
          key={`window-${idx}`}
          position={[window.position.x, window.position.y, window.position.z]}
          rotation={[0, window.rotation * Math.PI / 180, 0]}
        >
          <boxGeometry args={[window.width, window.height, 0.1]} />
          <meshStandardMaterial 
            color="#aaddff" 
            transparent={true} 
            opacity={0.6} 
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      ))}
      
      {/* Doors - if doors are present */}
      {roomData.doors?.map((door, idx) => (
        <mesh
          key={`door-${idx}`}
          position={[door.position.x, door.position.y, door.position.z]}
          rotation={[0, door.rotation * Math.PI / 180, 0]}
        >
          <boxGeometry args={[door.width, door.height, 0.1]} />
          <meshStandardMaterial 
            color={door.color || "#8B4513"} 
            roughness={0.7}
          />
        </mesh>
      ))}
      
      {/* Furniture */}
      <FurnitureModels />
    </group>
  );
};

export default RoomModel;
