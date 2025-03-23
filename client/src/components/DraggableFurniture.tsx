import { useRef, useState, useEffect, Suspense } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { useDrag } from "@use-gesture/react";
import { useGLTF } from "@react-three/drei";
import { useDesign, Furniture } from "../lib/stores/useDesign";
import { GLTF } from "three-stdlib";

interface DraggableFurnitureProps {
  furniture: Furniture;
  index: number;
}

const DraggableFurniture: React.FC<DraggableFurnitureProps> = ({ furniture, index }) => {
  const { updateFurniturePosition } = useDesign();
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [modelLoaded, setModelLoaded] = useState(false);
  const { camera, raycaster, gl, scene } = useThree();
  
  // Track floor position for dragging
  const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
  const planeIntersectPoint = new THREE.Vector3();
  
  // Load 3D model if available
  const modelRef = useRef<THREE.Group | null>(null);
  const customModel = furniture.modelPath ? 
    useGLTF(furniture.modelPath) as GLTF & { scene: THREE.Group } : 
    null;
  
  // Update model loaded state
  useEffect(() => {
    if (customModel) {
      setModelLoaded(true);
      if (furniture.modelPath) {
        console.log(`Model loaded: ${furniture.modelPath}`);
      }
    }
  }, [customModel, furniture.modelPath]);
  
  // Handle dragging logic
  const bind = useDrag(({ active, movement: [x, z], first, last }) => {
    if (furniture.isFixed) return; // Don't allow dragging fixed elements
    
    if (first) {
      setIsDragging(true);
    }
    
    // Update position on drag
    if (active) {
      // Cast ray to get floor intersection
      raycaster.setFromCamera(new THREE.Vector2(), camera);
      raycaster.ray.intersectPlane(floorPlane, planeIntersectPoint);
      
      if (groupRef.current) {
        const newPosition = {
          x: planeIntersectPoint.x,
          y: furniture.position.y,
          z: planeIntersectPoint.z
        };
        
        // Update local position
        groupRef.current.position.x = newPosition.x;
        groupRef.current.position.z = newPosition.z;
        
        // Update global state if this is the last event
        if (last) {
          updateFurniturePosition(index, newPosition);
          setIsDragging(false);
        }
      }
    }
  });
  
  // Set initial position and rotation
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.position.set(
        furniture.position.x,
        furniture.position.y,
        furniture.position.z
      );
      
      groupRef.current.rotation.y = furniture.rotation * (Math.PI / 180);
    }
  }, [furniture]);
  
  return (
    <group 
      ref={groupRef}
      {...(bind() as any)}
      position={[furniture.position.x, furniture.position.y, furniture.position.z]}
      rotation={[0, furniture.rotation * (Math.PI / 180), 0]}
    >
      {modelLoaded && customModel ? (
        // Render the 3D model if available
        <Suspense fallback={
          <mesh castShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#FFFFFF" />
          </mesh>
        }>
          <primitive 
            object={customModel.scene.clone()} 
            scale={[furniture.scale, furniture.scale, furniture.scale]}
            castShadow 
            receiveShadow 
          />
        </Suspense>
      ) : (
        // Render a colored box as fallback
        <mesh 
          ref={meshRef} 
          castShadow 
          receiveShadow
        >
          <boxGeometry args={[
            furniture.productInfo?.dimensions?.width || 1, 
            furniture.productInfo?.dimensions?.height || 1, 
            furniture.productInfo?.dimensions?.depth || 1
          ]} />
          <meshStandardMaterial 
            color={furniture.color} 
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      )}
      
      {/* Visual indicator when dragging */}
      {isDragging && (
        <mesh position={[0, -furniture.position.y + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.5, 1.5]} />
          <meshBasicMaterial 
            color="#4f46e5" 
            transparent={true} 
            opacity={0.3} 
          />
        </mesh>
      )}
    </group>
  );
};

export default DraggableFurniture;