/**
 * TestResult Component
 * Reusable test result display card
 * Shows score and retry button
 */

interface TestResultProps {
  score: number;
  questionCount: number;
  onRetry: () => void;
  textColor: string;
  cardBackground: string;
  accentColor: string;
}

export function TestResult({
  score,
  questionCount,
  onRetry,
  textColor,
  cardBackground,
  accentColor,
}: TestResultProps) {
  const percentage = Math.round((score / questionCount) * 100);

  return (
    <div
      className="text-center mt-8 p-6 rounded-lg shadow-md"
      style={{ backgroundColor: cardBackground }}
    >
      <h2 className="text-xl font-semibold mb-4" style={{ color: textColor }}>
        Test Sonucu
      </h2>
      <div
        className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 mx-auto"
        style={{ backgroundColor: accentColor }}
      >
        <span className="text-2xl font-bold" style={{ color: textColor }}>
          %{percentage}
        </span>
      </div>
      <p style={{ color: textColor }}>
        Toplam Doğru: {score} / {questionCount}
      </p>
      <button
        onClick={onRetry}
        className="mt-4 px-6 py-2 rounded-lg hover:bg-opacity-90 transition duration-300"
        style={{ backgroundColor: accentColor, color: textColor }}
      >
        Tekrar Dene
      </button>
    </div>
  );
}
