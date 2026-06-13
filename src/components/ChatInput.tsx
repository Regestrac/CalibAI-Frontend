import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Send, Paperclip, Mic } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { addMessage, type Message } from '../redux/messageSlice';
import { sendMessage } from '../services/sendMessage';

const ChatInput = () => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const dispatch = useAppDispatch();

  const { pathname } = useLocation();
  const urlId = pathname.includes('/chat/') ? pathname.split('/')?.at(-1) : '';

  const reduxId = useAppSelector((s) => s.conversation.activeConversationId);
  const conversationId = reduxId ?? urlId ?? null;

  const onSend = async (text: string) => {
    const userMsg: Message = {
      _id: Date.now().toString(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };
    dispatch(addMessage(userMsg));

    if (conversationId) {
      const data = await sendMessage(conversationId, text);

      if (data?.data) {
        const agentMsg: Message = {
          _id: Date.now().toString(),
          role: 'assistant',
          content: data?.data,
          createdAt: new Date().toISOString(),
        };
        dispatch(addMessage(agentMsg));
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
    <div className='px-4 pb-4 shrink-0'>
      <div className='flex items-center gap-2 bg-bg-card border border-white/6 rounded-2xl px-4 py-3 focus-within:border-primary/50 transition-colors'>
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
      <p className='text-[11px] text-text-muted text-center mt-2'>
        CalibAI can make mistakes. Verify important information.
      </p>
    </div>
  );
};

export default ChatInput;
