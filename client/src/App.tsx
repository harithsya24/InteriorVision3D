import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect } from "react";
import { KeyboardControls } from "@react-three/drei";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";
import ThreeScene from "./components/ThreeScene";
import DesignControls from "./components/DesignControls";
import TextToDesign from "./components/TextToDesign";
import { useDesign } from "./lib/stores/useDesign";
import { Controls } from "./components/Navigation";

// Main App component
function App() {
  const { initializeDesign } = useDesign();
  const [showCanvas, setShowCanvas] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(true);
  
  // Setup audio
  const { 
    setBackgroundMusic, 
    setHitSound, 
    setSuccessSound 
  } = useAudio();

  useEffect(() => {
    // Initialize the design state
    initializeDesign();
    
    // Load audio assets
    const bgMusic = new Audio("/sounds/background.mp3");
    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    
    const hitSfx = new Audio("/sounds/hit.mp3");
    const successSfx = new Audio("/sounds/success.mp3");
    
    setBackgroundMusic(bgMusic);
    setHitSound(hitSfx);
    setSuccessSound(successSfx);
    
    setLoadingAudio(false);
    setShowCanvas(true);
  }, []);

  // Define keyboard controls for navigation
  const keyMap = [
    { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
    { name: Controls.backward, keys: ['ArrowDown', 'KeyS'] },
    { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
    { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
    { name: Controls.up, keys: ['PageUp', 'KeyE'] },
    { name: Controls.down, keys: ['PageDown', 'KeyQ'] },
    { name: Controls.faster, keys: ['ShiftLeft', 'ShiftRight'] },
    { name: Controls.slower, keys: ['AltLeft', 'AltRight'] },
  ];

  if (loadingAudio) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-xl">Loading Interior Design Visualizer...</div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen">
      {showCanvas && (
        <KeyboardControls map={keyMap}>
          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ 
              position: [0, 1.65, 5],
              fov: 75,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: true,
              powerPreference: "high-performance"
            }}
          >
            <Suspense fallback={null}>
              <ThreeScene />
            </Suspense>
          </Canvas>
          
          <TextToDesign />
          <DesignControls />
        </KeyboardControls>
      )}
    </div>
  );
}

export default App;
