import { useState } from "react";
import { parseTextToDesign } from "../lib/naturalLanguageParser";
import { useDesign } from "../lib/stores/useDesign";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useAudio } from "../lib/stores/useAudio";

const TextToDesign = () => {
  const [designPrompt, setDesignPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const { updateRoomFromDescription, resetRoom } = useDesign();
  const { playSuccess } = useAudio();

  // Example prompts to help users get started
  const examplePrompts = [
    "Create a modern minimalist living room with wood floors, white walls, and large windows",
    "Design a cozy bedroom with blue walls, a queen bed, and reading corner",
    "Make an industrial kitchen with concrete countertops, open shelving, and dark cabinets",
    "Design a small home office with a standing desk, bookshelves, and plants"
  ];

  const handleGenerate = async () => {
    if (!designPrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const designData = await parseTextToDesign(designPrompt);
      updateRoomFromDescription(designData);
      playSuccess();
    } catch (error) {
      console.error("Error generating design:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    resetRoom();
    setDesignPrompt("");
  };

  return (
    <div className="fixed left-4 top-4 z-50">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="secondary"
        className="mb-2 shadow-md"
      >
        {isOpen ? "Hide Design Panel" : "Text to 3D Design"}
      </Button>

      {isOpen && (
        <Card className="w-80 bg-card/90 backdrop-blur-md shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Text to 3D Interior Design</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describe your interior design..."
              className="min-h-24 mb-3"
              value={designPrompt}
              onChange={(e) => setDesignPrompt(e.target.value)}
            />
            
            <div className="grid grid-cols-2 gap-2 mb-4">
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !designPrompt.trim()}
                className="w-full"
              >
                {isGenerating ? "Generating..." : "Generate Design"}
              </Button>
              
              <Button 
                variant="outline"
                onClick={handleReset}
                className="w-full"
              >
                Reset Room
              </Button>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p className="font-medium mb-1">Try these examples:</p>
              <div className="space-y-1">
                {examplePrompts.map((prompt, idx) => (
                  <div 
                    key={idx}
                    className="p-1 rounded cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                    onClick={() => setDesignPrompt(prompt)}
                  >
                    {prompt}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TextToDesign;
