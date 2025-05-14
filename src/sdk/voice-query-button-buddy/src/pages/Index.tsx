
import VoiceQueryInterface from '@/components/VoiceQueryInterface';

const Index = () => {
  const isTesting = window.location.hostname === 'localhost' || window.location.hostname.includes('lovableproject');

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Voice Assistant</h1>
      <p className="text-gray-600 max-w-md text-center mb-8">
        Click the microphone button to ask a question with your voice
      </p>
      
      {isTesting && (
        <div className="bg-amber-100 border border-amber-300 text-amber-800 px-4 py-3 rounded mb-8 max-w-md">
          <p className="font-medium">Testing Mode Active</p>
          <p className="text-sm">Using mock API responses. Connect to your real backend in production.</p>
        </div>
      )}
      
      <div className="w-full max-w-3xl">
        <VoiceQueryInterface apiEndpoint="/api/voice-query" />
      </div>
    </div>
  );
};

export default Index;
