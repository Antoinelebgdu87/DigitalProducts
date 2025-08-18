import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";
import { toast } from "sonner";

interface UsernameModalProps {
  onClose: () => void;
}

export const UsernameModal: React.FC<UsernameModalProps> = ({ onClose }) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { createUsername, generateRandomUsername } = useUser();

  const handleSubmit = async (customUsername?: string) => {
    setIsLoading(true);
    try {
      const finalUsername = customUsername || username.trim();
      await createUsername(finalUsername || undefined);
      toast.success(`Welcome, ${finalUsername || "to Key System"}!`);
      onClose();
    } catch (error) {
      console.error("Error creating username:", error);
      toast.error("Failed to create username. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRandomUsername = async () => {
    const randomUsername = generateRandomUsername();
    await handleSubmit(randomUsername);
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      await handleSubmit();
    } else {
      toast.error("Please enter a username or choose random");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 rounded-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-4xl mb-4">🎮</div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Choose Your Username
          </h2>
          <p className="text-gray-400">
            Set your identity for this session
          </p>
        </div>

        <form onSubmit={handleCustomSubmit} className="space-y-6">
          <div>
            <Input
              type="text"
              placeholder="Enter custom username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 text-lg py-3"
              maxLength={20}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 text-lg"
              disabled={isLoading || !username.trim()}
            >
              {isLoading ? "Creating..." : "Use Custom Username"}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 bg-gray-900 text-gray-400">or</span>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleRandomUsername}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 text-lg"
              disabled={isLoading}
            >
              {isLoading ? "Generating..." : "Generate Random Username"}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Your username will be saved for this browser session
          </p>
        </div>
      </div>
    </div>
  );
};
