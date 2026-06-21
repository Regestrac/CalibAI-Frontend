import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Mic, Paperclip, Send } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { addMessage, setArtifacts, setArtifactOpen, type Message } from '../redux/messageSlice';
import { sendMessage } from '../services/sendMessage';
import { createConversation } from '../services/createConversation';
import { addConversation, updateConversationTitle } from '../redux/conversationSlice';
import { updateConversation } from '../services/updateConversation';
import { agents } from '../helpers/constants';

const ChatInput = () => {
  const [input, setInput] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('auto');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const { pathname } = useLocation();
  const urlId = pathname.includes('/chat/') ? pathname.split('/')?.at(-1) : '';

  const reduxId = useAppSelector((s) => s.conversation.activeConversationId);
  const conversationId = reduxId ?? urlId ?? null;

  const currConv = useAppSelector((state) => state.conversation.conversations.find((conv) => conv._id === conversationId));
  const convTitle = currConv?.title;

  const onSend = async (text: string) => {
    const userMsg: Message = {
      _id: Date.now().toString(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };
    dispatch(addMessage(userMsg));

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

      const data = await sendMessage(convId, text, selectedAgent);

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
      }
    } finally {
      if (!conversationId && convId) {
        navigate(`/chat/${convId}`);
      }
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  return (
    <div className="px-4 pb-4 shrink-0">
      <div className='bg-bg-card border border-white/6 rounded-2xl px-3 py-2.5 focus-within:border-primary/50 transition-colors'>
        <div className='flex items-center gap-2 flex-wrap'>
          {agents.map((agent) => {
            const active = selectedAgent === agent.id;
            return (
              <button
                key={agent.id}
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
        <div className='flex items-center gap-2 pt-2.5'>
          <button
            type='button'
            className='p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors cursor-pointer shrink-0'
          >
            <Paperclip size={18} />
          </button>
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder='Ask anything'
            rows={1}
            className='flex-1 bg-transparent text-sm text-white placeholder-text-muted outline-none resize-none max-h-40'
          />
          <button
            type='button'
            className='p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors cursor-pointer shrink-0'
          >
            <Mic size={18} />
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
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
