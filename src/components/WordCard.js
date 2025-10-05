import React, { useState } from 'react';
import { useUserProgress } from '../contexts/UserProgressContext';
import { useAuth } from '../contexts/AuthContext';

const WordCard = ({ word, id }) => {
  const { user } = useAuth();
  const { markWordAsStudied, isWordStudied } = useUserProgress();
  const [revealed, setRevealed] = useState(false);
  
  // Save progress when user reveals or interacts with the word
  const handleReveal = () => {
    setRevealed(true);
    
    // Save progress when user reveals the word
    if (user) {
      markWordAsStudied(id);
      console.log("Marking word as studied:", id);
    }
  };
  
  // Add debugging to show whether user is logged in
  console.log("User logged in:", !!user);
  
  return (
    <div className="word-card">
      <h3>{word.term}</h3>
      
      {!revealed ? (
        <button onClick={handleReveal}>Reveal meaning</button>
      ) : (
        <>
          <p>{word.meaning}</p>
          <p><i>{word.example}</i></p>
        </>
      )}
      
      {/* Show studied status if user is logged in */}
      {user && isWordStudied(id) && (
        <span className="studied-badge">✓ Studied</span>
      )}
    </div>
  );
};

export default WordCard;