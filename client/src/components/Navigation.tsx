import { useEffect, useState } from "react";
import { useKeyboardControls } from "@react-three/drei";
import { useDesign } from "../lib/stores/useDesign";

// Control key enumeration
export enum Controls {
  forward = 'forward',
  backward = 'backward',
  left = 'left',
  right = 'right',
  up = 'up',
  down = 'down',
  faster = 'faster',
  slower = 'slower'
}

// Navigation information component
export const NavigationInfo = () => {
  const [showControls, setShowControls] = useState(false);
  const { viewMode, setViewMode } = useDesign();
  
  // Add keyboard event listener for help toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyH') {
        setShowControls(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Toggle between first-person and orbit controls
  const toggleViewMode = () => {
    setViewMode(viewMode === 'firstPerson' ? 'orbit' : 'firstPerson');
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setShowControls(prev => !prev)}
        className="mb-2 bg-primary text-primary-foreground p-2 rounded-md shadow-md"
      >
        {showControls ? 'Hide Controls' : 'Show Controls (H)'}
      </button>
      
      <button
        onClick={toggleViewMode}
        className="ml-2 bg-secondary text-secondary-foreground p-2 rounded-md shadow-md"
      >
        {viewMode === 'firstPerson' ? 'Switch to Orbit Mode' : 'Switch to First Person'}
      </button>
      
      {showControls && (
        <div className="mt-2 bg-card text-card-foreground p-4 rounded-md shadow-md max-w-xs">
          <h3 className="font-bold mb-2">Navigation Controls:</h3>
          <ul className="text-sm">
            <li>W / Up Arrow: Move Forward</li>
            <li>S / Down Arrow: Move Backward</li>
            <li>A / Left Arrow: Move Left</li>
            <li>D / Right Arrow: Move Right</li>
            <li>E / Page Up: Move Up</li>
            <li>Q / Page Down: Move Down</li>
            <li>Shift: Move Faster</li>
            <li>Alt: Move Slower</li>
            <li>H: Toggle Help</li>
          </ul>
          <p className="mt-2 text-xs italic">
            In Orbit Mode: Use mouse to rotate, scroll to zoom
          </p>
        </div>
      )}
    </div>
  );
};

export default NavigationInfo;
