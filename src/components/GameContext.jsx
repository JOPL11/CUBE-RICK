import { createContext, useContext, useState } from 'react';

const GameContext = createContext();

export function GameProvider({ children }) {
  const [gameMode, setGameMode] = useState('portfolio');
  
  // Enhanced setGameMode with logging
  const loggedSetGameMode = (newMode) => {
    console.log(`Game mode changing from ${gameMode} to ${newMode}`);
    setGameMode(newMode);
  };

  return (
    <GameContext.Provider value={{ 
      gameMode, 
      setGameMode: loggedSetGameMode  // Using our logged version
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  
  // Optional: Log whenever context is accessed
  if (process.env.NODE_ENV === 'development') {
    console.log('Current game mode:', context.gameMode);
  }
  
  return context;
}