import { useEffect, useRef } from 'react';
import { Bot, User } from 'lucide-react';
import type { Message } from '../types/chat';

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const MessageList = ({ messages }: { messages: Message[] }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className='flex-1 overflow-y-auto px-6 py-4 space-y-4'>
      {messages.map((msg) => (
        <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
          {msg.role === 'assistant' && (
            <div className='w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1'>
              <Bot size={16} className='text-primary-light' />
            </div>
          )}
          <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : ''}`}>
            <div
              className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${msg.role === 'user'
                  ? 'bg-primary text-white rounded-br-md'
                  : 'bg-bg-card text-gray-200 rounded-bl-md border border-white/6'
                }`}
            >
              {msg.content}
            </div>
            <p className={`text-[11px] text-text-muted mt-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
              {formatTime(msg.timestamp)}
            </p>
          </div>
          {msg.role === 'user' && (
            <div className='w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary-dark flex items-center justify-center shrink-0 mt-1'>
              <User size={16} className='text-white' />
            </div>
          )}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default MessageList;
