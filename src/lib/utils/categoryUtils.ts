// Define Word interface locally
interface Word {
  id: string;
  // Add other properties as needed
  [key: string]: unknown;
}

export function getQuestionCount(words: Word[]): number {
  // Fix: Don't subtract 1 from the length
  return words.length;  // Previously this might have been words.length - 1
}