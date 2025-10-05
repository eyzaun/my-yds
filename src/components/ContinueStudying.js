import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUserProgress } from '../contexts/UserProgressContext';
import { useAuth } from '../contexts/AuthContext';
import { getWordsByCategory } from '../services/wordService'; // You'll need to implement this

const ContinueStudying = () => {
  const { user } = useAuth();
  const { studiedWords, loading } = useUserProgress();
  const [nextWord, setNextWord] = useState(null);
  const [categoryProgress, setCategoryProgress] = useState({});
  const router = useRouter();

  useEffect(() => {
    async function findNextWord() {
      if (!user || loading) return;

      try {
        // Get words from all categories
        const categories = ['business', 'nature', 'academic-terms', 'official', 'social-sciences', 'phrasal'];
        const progress = {};
        let nextWordFound = null;

        for (const category of categories) {
          const words = await getWordsByCategory(category);
          const studied = words.filter(word => studiedWords.includes(word.id)).length;
          const total = words.length;
          
          progress[category] = {
            studied,
            total,
            percentage: total > 0 ? Math.round((studied / total) * 100) : 0
          };

          // Find the first unstudied word
          if (!nextWordFound) {
            const unstudiedWord = words.find(word => !studiedWords.includes(word.id));
            if (unstudiedWord) {
              nextWordFound = {
                ...unstudiedWord,
                category
              };
            }
          }
        }

        setCategoryProgress(progress);
        setNextWord(nextWordFound);
      } catch (error) {
        console.error("Error finding next word to study:", error);
      }
    }

    findNextWord();
  }, [user, studiedWords, loading]);

  const handleContinueStudying = () => {
    if (nextWord) {
      router.push(`/${nextWord.category}`);
    }
  };

  if (!user) {
    return (
      <div className="continue-studying-card">
        <h3>Track Your Progress</h3>
        <p>Sign in to track your progress and continue where you left off.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="continue-studying-card">Loading your progress...</div>;
  }

  return (
    <div className="continue-studying-card">
      <h3>Your Learning Progress</h3>
      
      {Object.entries(categoryProgress).map(([category, data]) => (
        <div key={category} className="category-progress">
          <h4>{category.replace('-', ' ')}</h4>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${data.percentage}%` }}
            ></div>
          </div>
          <span>{data.studied}/{data.total} words ({data.percentage}%)</span>
        </div>
      ))}
      
      {nextWord ? (
        <button 
          className="continue-button"
          onClick={handleContinueStudying}
        >
          Continue where you left off
        </button>
      ) : (
        <p>You&apos;ve studied all available words! Check back later for more.</p>
      )}
    </div>
  );
};

export default ContinueStudying;
