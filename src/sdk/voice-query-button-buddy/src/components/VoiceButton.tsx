import React, {useEffect, useState, useRef } from "react";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { processMockAudio } from "@/api/mockVoiceApi";
import { ask, getSNS } from "solask-sdk";


interface VoiceButtonProps {
  onResult?: (text: string, transcription?: string) => void;
  apiEndpoint?: string;
}

const VoiceButton: React.FC<VoiceButtonProps> = ({
  onResult,
  apiEndpoint = "http://localhost:3001/ask",
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const speechRecognitionRef = useRef<SpeechRecognition | null>(null);
  const transcriptRef = useRef<string>("");

//   		useEffect(() => {
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

  const startListening = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // Set up speech recognition if available
      if (
        "SpeechRecognition" in window ||
        "webkitSpeechRecognition" in window
      ) {
        const SpeechRecognition =
          window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0].transcript)
            .join("");

          // Convert spoken punctuation names to actual punctuation
          const processedTranscript =
            convertSpokenPunctuationToSymbols(transcript);
          transcriptRef.current = processedTranscript;
          console.log("transcript: ", processedTranscript);
        };

        recognition.start();
        speechRecognitionRef.current = recognition;
      }

      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunksRef.current.push(event.data);
      });

      mediaRecorder.addEventListener("stop", async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        await sendAudioToBackend(audioBlob);

        // Stop all tracks to release the microphone
        stream.getTracks().forEach((track) => track.stop());

        // Stop speech recognition
        if (speechRecognitionRef.current) {
          speechRecognitionRef.current.stop();
        }
      });

      mediaRecorder.start();
      setIsListening(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Could not access microphone. Please check permissions.");
    }
  };

  // Function to convert spoken punctuation to symbols
const convertSpokenPunctuationToSymbols = (text: string): string => {
  // Handle domain-like patterns: "raj dot sol" => "raj.sol"
  text = text.replace(/\b(\w+)\s+(dot|period|full stop)\s+(\w+)\b/gi, (match, w1, _, w2) => {
    return `${w1}.${w2}`;
  });

  const punctuationMap: Record<string, string> = {
    period: ".",
    dot: ".",
    "full stop": ".",
    comma: ",",
    "question mark": "?",
    "exclamation mark": "!",
    "exclamation point": "!",
    colon: ":",
    semicolon: ";",
    dash: "-",
    hyphen: "-",
    quote: '"',
    "quotation mark": '"',
    "single quote": "'",
    apostrophe: "'",
    "left parenthesis": "(",
    "right parenthesis": ")",
    "open parenthesis": "(",
    "close parenthesis": ")",
    "open bracket": "[",
    "close bracket": "]",
    "left bracket": "[",
    "right bracket": "]",
    "open brace": "{",
    "close brace": "}",
    "left brace": "{",
    "right brace": "}",
    underscore: "_",
    ampersand: "&",
    "at sign": "@",
    hashtag: "#",
    percent: "%",
    "dollar sign": "$",
    plus: "+",
    equals: "=",
    "equal sign": "=",
    asterisk: "*",
    star: "*",
    "forward slash": "/",
    backslash: "\\",
    "vertical bar": "|",
    pipe: "|",
    tilde: "~",
    caret: "^",
    "less than": "<",
    "greater than": ">",
  };

  const regex = new RegExp(
    "\\b(" + Object.keys(punctuationMap).join("|") + ")\\b",
    "gi"
  );

  // Replace spoken punctuation
  text = text.replace(regex, (match) => {
    return punctuationMap[match.toLowerCase()];
  });

  // Return final lowercase string
  return text.toLowerCase();
};


  const stopListening = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
      setIsProcessing(true);
    }
  };

  const sendAudioToBackend = async (audioBlob: Blob) => {
    try {
      let data;

      // Check if we're testing (no actual backend)
      //   if (window.location.hostname === 'localhost' || window.location.hostname.includes('lovableproject')) {
      //     console.log("Using mock API for testing");
      //     // Use mock API for testing
      //     data = await processMockAudio(audioBlob);

      //     // Use the real transcript if available
      //     if (transcriptRef.current) {
      //       data.transcription = transcriptRef.current;
      //     }

      //     toast.success('Mock API response received!');
      //   } else {
      // Use real API endpoint
      const transcript = transcriptRef.current.trim();

      if (!transcript) {
        toast.error("No voice input captured.");
        return;
      }

      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: transcript }),
      });

      if (!response.ok) {
        throw new Error("Failed to process audio");
      }

      data = await response.json();

	  console.log("backend data received: ", data)
      toast.success("Voice processed successfully!");
      //   }

      if (onResult) {
        // Pass both the response and the actual transcription
        onResult(data.text, data.transcription || transcriptRef.current);
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      toast.error("Failed to process your voice query.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={isProcessing}
      className={cn(
        "fixed bottom-8 right-8 w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
        isListening
          ? "bg-gradient-to-r from-red-500 to-red-600 animate-pulse"
          : isProcessing
          ? "bg-gradient-to-r from-amber-400 to-amber-500"
          : "bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
      )}
    >
      {isListening ? (
        <MicOff className="h-7 w-7 text-white" />
      ) : (
        <Mic
          className={cn("h-7 w-7 text-white", isProcessing && "animate-spin")}
        />
      )}
      <span className="sr-only">
        {isListening
          ? "Stop recording"
          : isProcessing
          ? "Processing"
          : "Start recording"}
      </span>
      {isListening && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping" />
      )}
    </button>
  );
};

export default VoiceButton;
