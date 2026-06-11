import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

const ChatInput = ({ onSend }: { onSend: (text: string) => void }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      <div className='flex items-end gap-2 bg-bg-card border border-white/6 rounded-2xl px-4 py-3 focus-within:border-primary/50 transition-colors'>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='Type a message...'
          rows={1}
          className='flex-1 bg-transparent text-sm text-white placeholder-text-muted outline-none resize-none max-h-40'
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className='p-2 rounded-lg bg-primary text-white hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shrink-0'
        >
          <Send size={16} />
        </button>
      </div>
      <p className='text-[11px] text-text-muted text-center mt-2'>
        AI responses may be inaccurate. Verify important information.
      </p>
    </div>
  );
};

export default ChatInput;
