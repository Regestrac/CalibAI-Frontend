import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mic, Paperclip, Send } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { addMessage, setArtifacts, setArtifactOpen, type Message, setIsAnswering } from '../redux/messageSlice';
import { sendMessage } from '../services/sendMessage';
import { createConversation } from '../services/createConversation';
import { addConversation, updateConversationTitle } from '../redux/conversationSlice';
import { updateConversation } from '../services/updateConversation';
import { setUserData } from '../redux/userSlice';
import { agents } from '../helpers/constants';
import FileUpload from './FileUpload';
import { showErrorToast } from '../utils/toast';

const ChatInput = () => {
  const [input, setInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('auto');
  const [file, setFile] = useState<File | null>(null);
  const [isListening, setIsListening] = useState(false);

  console.log('isListening: ', isListening);

  const isAnswering = useAppSelector((state) => state.message.isAnswering);
  const userData = useAppSelector((state) => state.user.userData);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { pathname } = useLocation();
  const urlId = pathname.includes('/chat/') ? pathname.split('/')?.at(-1) : '';

  const reduxId = useAppSelector((s) => s.conversation.activeConversationId);
  const conversationId = reduxId ?? urlId ?? null;

  const currConv = useAppSelector((state) => state.conversation.conversations.find((conv) => conv._id === conversationId));
  const convTitle = currConv?.title;

  const onSend = async (text: string, attachment: File | null) => {
    const userMsg: Message = {
      _id: Date.now().toString(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };
    dispatch(addMessage(userMsg));
    dispatch(setIsAnswering(true));

    setFile(null);
    setInput('');

    let convId = conversationId;
    try {
      let title = convTitle;

      if (!convId) {
        const conv = await createConversation();
        if (!conv?._id) {
          return;
        }
        dispatch(addConversation(conv));
        convId = conv._id;
        title = conv.title;
      }

      if (title === "New Chat") {
        dispatch(updateConversationTitle({ convId, title: text?.trim() }));
        await updateConversation(convId, text?.trim());
      }

      const data = await sendMessage(convId, text, selectedAgent, attachment);

      if (data?.data) {
        const agentMsg: Message = {
          _id: Date.now().toString(),
          role: 'assistant',
          content: data?.data,
          images: data?.images,
          createdAt: new Date().toISOString(),
        };
        dispatch(addMessage(agentMsg));
        dispatch(setArtifacts(data?.artifacts || []));
        if (data?.artifacts?.length) {
          dispatch(setArtifactOpen(true));
        }

        if (data?.remainingCredits !== undefined && userData) {
          dispatch(setUserData({
            userData: {
              ...userData,
              credits: data.remainingCredits,
            },
          }));
        }
      }
    } finally {
      dispatch(setIsAnswering(false));
      if (!conversationId && convId) {
        navigate(`/chat/${convId}`);
      }
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed && !file) return;
    const text = trimmed || (file ? `Attached: ${file.name}` : '');
    onSend(text, file);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleMic = () => {
    if (!recognitionRef.current) {
      showErrorToast("Speech recognition not supported.");
      return;
    }

    recognitionRef.current?.start();
    setIsListening(true);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  useEffect(() => {
    const SpeechRecognition = window?.SpeechRecognition || window?.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const SpeechRecognitionResult = window?.SpeechRecognitionResult;
    const res = SpeechRecognitionResult;

    console.log('res: ', res);

    const recognition = new SpeechRecognition();
    console.log('recognition: ', recognition);
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      console.log('event: ', event);
      let transcript = '';
      for (let index = event.resultIndex; index < event?.results?.length; index++) {
        transcript += event.results[index][0].transcript;
      }
      setInput(transcript);
    };

    recognition.onerror = (event) => {
      const error = event.error;
      console.log('error event: ', event);
      console.error('Speech recognition error:', error);
      if (error === 'not-allowed') {
        showErrorToast("Microphone permission denied.");
      } else if (error === 'network') {
        showErrorToast("Speech service unreachable. Check your internet connection or try again later.");
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, []);

  return (
    <div className="px-4 pb-4 shrink-0">
      <div className='bg-bg-card border border-white/6 rounded-2xl px-3 py-2.5 focus-within:border-primary/50 transition-colors'>
        <div className='flex items-center gap-2 flex-wrap'>
          {agents.map((agent) => {
            const active = selectedAgent === agent.id;
            return (
              <button
                key={agent.id}
                disabled={isAnswering}
                type='button'
                onClick={() => setSelectedAgent(agent.id)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium border transition-colors cursor-pointer ${active
                  ? 'bg-primary/15 text-primary-light border-primary/40'
                  : 'text-text-muted  border-primary-light/20 hover:text-white hover:bg-white/5'}`
                }
              >
                <agent.icon size={14} />
                {agent.label}
              </button>
            );
          })}
        </div>
        {file && (
          <div className='pt-2'>
            <FileUpload file={file} onFileSelect={setFile}>
              <Paperclip size={18} />
            </FileUpload>
          </div>
        )}
        <div className='flex items-center gap-2 pt-2.5'>
          {!file && (
            <FileUpload file={file} onFileSelect={setFile} disabled={isAnswering}>
              <Paperclip size={18} />
            </FileUpload>
          )}
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={file ? 'Add a message or send the file' : 'Ask anything'}
            rows={1}
            className='flex-1 bg-transparent text-sm text-white placeholder-text-muted outline-none resize-none max-h-40'
          />
          <button
            type='button'
            disabled={isAnswering}
            onClick={toggleMic}
            className='p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors cursor-pointer shrink-0'
          >
            <Mic size={18} />
          </button>
          <button
            onClick={handleSend}
            disabled={(!input.trim() && !file) || isAnswering}
            className='p-2 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0'
          >
            <Send size={16} />
          </button>
        </div>
      </div>
      <p className='text-[11px] text-text-muted text-center mt-2'>
        CalibAI can make mistakes. Verify important information.
      </p>
    </div>
  );
};

export default ChatInput;
