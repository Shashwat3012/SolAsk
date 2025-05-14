
/**
 * Mock voice API service for testing the voice UI
 */

// Sample user speech transcriptions to simulate voice recognition
const sampleTranscriptions = [
  "What's the weather today?",
  "Find Italian restaurants near me",
  "When is my next meeting?",
  "What is the capital of France?",
  "I'm looking for coffee shops nearby"
];

// Sample responses to simulate different voice inputs
const sampleResponses = [
  "The weather today is sunny with a high of 75 degrees.",
  "I've found 3 Italian restaurants near you: Pasta Palace, Mamma Mia's, and Trattoria Bella.",
  "Your next meeting is scheduled for 3:00 PM with the marketing team.",
  "The capital of France is Paris.",
  "I'm sorry, I didn't understand your question. Could you please repeat it?"
];

export const processMockAudio = async (audioBlob: Blob): Promise<{ text: string, transcription: string }> => {
  // Simulate API processing time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Select a random index for both arrays
  const randomIndex = Math.floor(Math.random() * sampleResponses.length);
  
  // Mock response - this would be replaced with actual speech-to-text processing
  return { 
    text: sampleResponses[randomIndex],
    transcription: sampleTranscriptions[randomIndex]
  };
};
