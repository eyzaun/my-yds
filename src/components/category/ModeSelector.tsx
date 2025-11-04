/**
 * ModeSelector Component
 * Reusable mode selector for switching between word list and quiz modes
 * Eliminates duplicate button code with SVG icons across category pages
 */

interface ModeSelectorProps {
  showQuiz: boolean;
  onModeChange: (showQuiz: boolean) => void;
  textColor: string;
  accentColor: string;
  cardBackground: string;
}

export function ModeSelector({
  showQuiz,
  onModeChange,
  textColor,
  accentColor,
  cardBackground,
}: ModeSelectorProps) {
  return (
    <div className="flex justify-center space-x-4 mb-6">
      {/* Word List Button */}
      <button
        onClick={() => onModeChange(false)}
        className="px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-300"
        style={{
          backgroundColor: !showQuiz ? accentColor : cardBackground,
          color: textColor,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
        </svg>
        Kelime Listesi
      </button>

      {/* Quiz Button */}
      <button
        onClick={() => onModeChange(true)}
        className="px-4 py-2 rounded-lg text-sm flex items-center transition-colors duration-300"
        style={{
          backgroundColor: showQuiz ? accentColor : cardBackground,
          color: textColor,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        Test
      </button>
    </div>
  );
}
