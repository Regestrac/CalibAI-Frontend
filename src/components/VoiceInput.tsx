import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { showErrorToast } from '../utils/toast';
import { Mic, Square } from 'lucide-react';
import { useAppSelector } from '../hooks/redux-hooks';

const VoiceInput = ({ setInput }: { setInput: Dispatch<SetStateAction<string>> }) => {
  const [isListening, setIsListening] = useState(false);
  const [isStopping, setIsStopping] = useState(false);

  const isAnswering = useAppSelector((state) => state.message.isAnswering);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const stopListening = () => {
    setIsStopping(true);
    recognitionRef.current?.stop();
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      showErrorToast("Speech recognition not supported.");
      return;
    }

    recognitionRef.current.start();
    setIsListening(true);
  };

  const toggleMic = () => {
    if (isListening) {
      stopListening();
    } else if (!isStopping) {
      startListening();
    }
  };

  useEffect(() => {
    const SpeechRecognition = window?.SpeechRecognition || window?.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let transcript = '';
      for (let index = 0; index <= event?.resultIndex; index++) {
        transcript += event.results[index][0].transcript;
      }
      setInput(transcript);
    };

    recognition.onerror = (event) => {
      const error = event.error;
      console.error('Speech recognition error:', error);
      if (error === 'not-allowed') {
        showErrorToast("Microphone permission denied.");
      } else if (error === 'network') {
        showErrorToast("Speech service unreachable. Check your internet connection or try again later.");
      }
      setIsListening(false);
      setIsStopping(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setIsStopping(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [setInput]);

  return (
    <button
      type='button'
      disabled={isAnswering || isStopping}
      onClick={toggleMic}
      className={`flex items-center gap-1.5 transition-colors cursor-pointer shrink-0 ${isListening || isStopping
        ? 'text-red-500 bg-red-500/20 rounded-full p-2.5'
        : 'text-text-muted hover:text-white hover:bg-white/5 rounded-lg p-2'
        }`}
    >
      {isStopping ? (
        <div className='w-3.5 h-3.5 border-2 border-red-500 border-t-transparent rounded-full animate-spin' />
      ) : isListening ? (
        <Square size={14} fill='currentColor' />
      ) : (
        <Mic size={18} />
      )}
    </button>
  );
};

export default VoiceInput;
