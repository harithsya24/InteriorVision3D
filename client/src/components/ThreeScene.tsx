import { useRef, useState, useEffect } from "react";
import * as THREE from "three"; 
import { useFrame, useThree } from "@react-three/fiber";
import { 
  Environment, 
  Grid, 
  OrbitControls, 
  useTexture,
  PerspectiveCamera
} from "@react-three/drei";
import { useDesign } from "../lib/stores/useDesign";
import RoomModel from "../models/RoomModel";
import RoomFurniture from "./RoomFurniture";
import ModelPreloader from "./ModelPreloader";
import { useKeyboardControls } from "@react-three/drei";
import { Controls } from "./Navigation";

const ThreeScene = () => {
  const { scene } = useThree();
  const controlsRef = useRef<any>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { 
    roomData, 
    viewMode,
    cameraPosition,
    setCameraPosition
  } = useDesign();

  // Navigation speeds
  const [moveSpeed, setMoveSpeed] = useState(0.1);
  
  // Keyboard controls state
  const forward = useKeyboardControls<Controls>(state => state.forward);
  const backward = useKeyboardControls<Controls>(state => state.backward);
  const left = useKeyboardControls<Controls>(state => state.left);
  const right = useKeyboardControls<Controls>(state => state.right);
  const up = useKeyboardControls<Controls>(state => state.up);
  const down = useKeyboardControls<Controls>(state => state.down);
  const faster = useKeyboardControls<Controls>(state => state.faster);
  const slower = useKeyboardControls<Controls>(state => state.slower);

  // Set background color based on environment
  useEffect(() => {
    if (scene) {
      scene.background = new THREE.Color(roomData.backgroundColor || "#AAAAAA");
    }
  }, [scene, roomData.backgroundColor]);

  // Camera movement logic
  useFrame(() => {
    if (!cameraRef.current) return;
    
    // Apply speed modifiers
    const currentSpeed = faster 
      ? moveSpeed * 2 
      : slower 
        ? moveSpeed * 0.5 
        : moveSpeed;
    
    // Get camera directions
    const cameraDirection = new THREE.Vector3();
    cameraRef.current.getWorldDirection(cameraDirection);
    
    // Calculate movement vectors
    const forwardVector = cameraDirection.clone().multiplyScalar(currentSpeed);
    const rightVector = new THREE.Vector3()
      .crossVectors(cameraDirection, cameraRef.current.up)
      .normalize()
      .multiplyScalar(currentSpeed);
    
    // Apply movements
    if (forward) {
      cameraRef.current.position.add(forwardVector);
    }
    if (backward) {
      cameraRef.current.position.sub(forwardVector);
    }
    if (right) {
      cameraRef.current.position.add(rightVector);
    }
    if (left) {
      cameraRef.current.position.sub(rightVector);
    }
    if (up) {
      cameraRef.current.position.y += currentSpeed;
    }
    if (down) {
      cameraRef.current.position.y -= currentSpeed;
    }
    
    // Update global camera position state
    if (forward || backward || left || right || up || down) {
      setCameraPosition({
        x: cameraRef.current.position.x,
        y: cameraRef.current.position.y,
        z: cameraRef.current.position.z,
      });
    }
    
    // Enable/disable orbit controls based on view mode
    if (controlsRef.current) {
      controlsRef.current.enabled = viewMode === 'orbit';
    }
  });

  return (
    <>
      {/* Main Camera with Orbit Controls */}
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[cameraPosition.x, cameraPosition.y, cameraPosition.z]}
        fov={75}
      />
      <OrbitControls 
        ref={controlsRef} 
        enableDamping
        dampingFactor={0.1}
        minDistance={1}
        maxDistance={20}
        enabled={viewMode === 'orbit'}
      />
      
      {/* Lighting */}
      <ambientLight intensity={roomData.ambientLightIntensity || 0.5} />
      
      {/* Main directional light (simulates sunlight) */}
      <directionalLight 
        position={[5, 10, 2]} 
        intensity={roomData.directionalLightIntensity || 1} 
        castShadow 
        shadow-mapSize={[2048, 2048]} 
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Additional lights to enhance the scene */}
      {roomData.additionalLights?.map((light, index) => (
        <pointLight
          key={`light-${index}`}
          position={[light.x, light.y, light.z]}
          intensity={light.intensity}
          color={light.color}
          castShadow={light.castShadow}
        />
      ))}
      
      {/* Environment and HDRI for realistic reflections */}
      <Environment preset="apartment" />
      
      {/* Floor grid for spatial reference */}
      <Grid 
        position={[0, -0.01, 0]} 
        args={[20, 20]} 
        cellSize={1} 
        cellThickness={0.5} 
        cellColor="#6f6f6f" 
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#9d4b4b"
        fadeDistance={30}
        fadeStrength={1}
        followCamera={false}
        infiniteGrid
      />
      
      {/* The main room model */}
      <RoomModel />
      
      {/* Furniture items */}
      <RoomFurniture />
      
      {/* Preload 3D models in background */}
      <ModelPreloader />
    </>
  );
};

export default ThreeScene;
