
import React, { useEffect, useState } from 'react';
import VoiceButton from './VoiceButton';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ask, getSNS } from "solask-sdk";


interface VoiceQueryInterfaceProps {
  apiEndpoint?: string;
}


const VoiceQueryInterface: React.FC<VoiceQueryInterfaceProps> = ({ 
  apiEndpoint = 'http://localhost:3001/ask' 
}) => {

// 	useEffect(() => {
//   const fetchData = async () => {
//     try {
//       const answer = await ask("Get me the balance of raj.sol");
//       console.log("testing sdk: ", answer);

//     //   const snsInfo = await getSNS("raj.sol");
//     //   console.log(snsInfo);
//     } catch (error) {
//       console.error("Error fetching data:", error);
//     }
//   };

//   fetchData();
// }, []);

  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userSpeech, setUserSpeech] = useState<string>('');

  const handleVoiceResult = (text: string, transcription?: string) => {
    setResult(text);
    if (transcription) {
      setUserSpeech(transcription);
    }
    setIsLoading(false);
  };

  return (
    <div className="relative min-h-[300px]">
      {userSpeech && (
        <Card className="mb-4 w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Your Speech</CardTitle>
            <CardDescription>What you said</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{userSpeech}</p>
          </CardContent>
        </Card>
      )}

      {result && (
        <Card className="mb-8 w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Response</CardTitle>
            <CardDescription>Answer to your query</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{result}</p>
          </CardContent>
        </Card>
      )}
      
      {!result && !userSpeech && !isLoading && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium mb-2">Voice Interface Ready</h3>
          <p className="text-muted-foreground">Click the microphone button to start speaking</p>
        </div>
      )}

      <VoiceButton onResult={handleVoiceResult} apiEndpoint={apiEndpoint} />
    </div>
  );
};

export default VoiceQueryInterface;
