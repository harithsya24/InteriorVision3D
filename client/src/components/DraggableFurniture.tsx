import { useRef, useState, useEffect } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { useDesign, Furniture } from "../lib/stores/useDesign";

interface DraggableFurnitureProps {
  furniture: Furniture;
  index: number;
}

const DraggableFurniture: React.FC<DraggableFurnitureProps> = ({ furniture, index }) => {
  const { camera, scene, raycaster, gl, pointer } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const { updateFurniturePosition } = useDesign();
  
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showControls, setShowControls] = useState(false);
  
  // Floor plane for raycasting during dragging
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const intersectionPoint = new THREE.Vector3();
  
  // Handle hover states
  const handlePointerOver = () => {
    setIsHovered(true);
    document.body.style.cursor = furniture.isFixed ? "not-allowed" : "grab";
  };
  
  const handlePointerOut = () => {
    setIsHovered(false);
    if (!isDragging) {
      document.body.style.cursor = "auto";
    }
  };
  
  // Handle drag start
  const handlePointerDown = (e: any) => {
    // Prevent dragging fixed elements
    if (furniture.isFixed) return;
    
    e.stopPropagation();
    setIsDragging(true);
    document.body.style.cursor = "grabbing";
  };
  
  // Frame-by-frame movement updates
  useFrame(() => {
    if (isDragging && meshRef.current) {
      // Cast a ray from the camera through the mouse pointer
      raycaster.setFromCamera(pointer, camera);
      
      // Get the point where the ray intersects the floor plane
      raycaster.ray.intersectPlane(floorPlane, intersectionPoint);
      
      // Update the furniture position
      updateFurniturePosition(index, {
        x: intersectionPoint.x,
        y: furniture.position.y, // Keep the same height
        z: intersectionPoint.z
      });
    }
  });
  
  // Handle drag end
  useEffect(() => {
    const handlePointerUp = () => {
      if (isDragging) {
        setIsDragging(false);
        document.body.style.cursor = isHovered ? "grab" : "auto";
      }
    };
    
    window.addEventListener("pointerup", handlePointerUp);
    return () => window.removeEventListener("pointerup", handlePointerUp);
  }, [isDragging, isHovered]);
  
  // Simple furniture visualization
  // In a real implementation this would be a more complex 3D model
  const getFurnitureGeometry = () => {
    switch (furniture.type.toLowerCase()) {
      case "sofa":
        return <boxGeometry args={[2, 0.8, 0.9]} />;
      case "chair":
        return <boxGeometry args={[0.8, 1, 0.8]} />;
      case "table":
        return <boxGeometry args={[1.2, 0.75, 0.8]} />;
      case "bed":
        return <boxGeometry args={[1.8, 0.5, 2.1]} />;
      case "bookshelf":
        return <boxGeometry args={[1.2, 2, 0.4]} />;
      case "cabinet":
        return <boxGeometry args={[1, 1.8, 0.5]} />;
      case "desk":
        return <boxGeometry args={[1.4, 0.75, 0.7]} />;
      case "lamp":
        return <cylinderGeometry args={[0.2, 0.3, 1.5, 16]} />;
      default:
        // Default box if no specific geometry
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };
  
  return (
    <group 
      position={[furniture.position.x, furniture.position.y, furniture.position.z]}
      rotation={[0, furniture.rotation * Math.PI / 180, 0]}
    >
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onPointerDown={handlePointerDown}
        castShadow
        receiveShadow
      >
        {getFurnitureGeometry()}
        <meshStandardMaterial 
          color={furniture.color} 
          roughness={0.7}
          metalness={0.1}
          transparent
          opacity={isDragging ? 0.7 : 1}
          emissive={isHovered ? "#555555" : "#000000"}
        />
      </mesh>
      
      {/* Handle hover information */}
      {isHovered && (
        <Html position={[0, furniture.type.toLowerCase() === "lamp" ? 1 : 0.8, 0]} center>
          <div className="bg-black/70 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
            {furniture.type}
            {furniture.isFixed && <span className="ml-1">(Fixed)</span>}
          </div>
        </Html>
      )}
      
      {/* Show move/rotate indicators */}
      {(isHovered || isDragging) && !furniture.isFixed && (
        <Html position={[0, -0.5, 0]} center>
          <div className="bg-black/70 text-white px-2 py-1 rounded text-xs">
            {isDragging ? "Release to place" : "Click and drag to move"}
          </div>
        </Html>
      )}
    </group>
  );
};

export default DraggableFurniture;