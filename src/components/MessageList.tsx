import { useEffect, useRef, useState } from 'react';
import { Bot, ExternalLink, LoaderCircle, User } from 'lucide-react';
import { useAppSelector } from '../hooks/redux-hooks';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Lightbox from './Lightbox';
import CodeBlock from './CodeBlock';

const formatTime = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};

const MessageList = () => {
  const { messages, loading } = useAppSelector((state) => state.message);

  const bottomRef = useRef<HTMLDivElement>(null);

  const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (loading) {
    return (
      <div className='flex-1 h-full flex items-center justify-center'>
        <LoaderCircle size={24} className='animate-spin text-text-muted' />
      </div>
    );
  }

  if (!loading && !messages.length) {
    return (
      <div className='flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center'>
        <div className='w-12 h-12 rounded-2xl bg-linear-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/20'>
          <Bot size={22} className='text-white' />
        </div>
        <h2 className='text-3xl font-semibold text-white tracking-tight'>Hey, what's on your mind?</h2>
        <p className='text-sm text-text-muted'>Ask me anything, or give me a task to get started.</p>
      </div>
    );
  }

  return (
    <div className='flex-1 overflow-y-auto px-6 py-4 space-y-4'>
      {messages.map((msg) => (
        <div key={msg._id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
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
              <Markdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code: CodeBlock,
                  h1: ({ children }) => (<h1 className='text-2xl font-bold mt-5 mb-3'>{children}</h1>),
                  h2: ({ children }) => (<h2 className='text-xl font-semibold mt-4 mb-2'>{children}</h2>),
                  h3: ({ children }) => (<h3 className='text-lg font-semibold mt-3 mb-1'>{children}</h3>),
                  p: ({ children }) => (<p className='mb-3 whitespace-pre-wrap wrap-break-word'>{children}</p>),
                  ul: ({ children }) => (<ul className='list-disc pl-5 space-y-1 my-2'>{children}</ul>),
                  ol: ({ children }) => (<ol className='list-decimal pl-5 space-y-1 my-2'>{children}</ol>),
                  table: ({ children }) => (
                    <div className='overflow-x-auto my-4'>
                      <table className='min-w-full border border-white/10'>
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className='border border-white/10 bg-white/5 px-3 py-2 text-left'>
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className='border border-white/10 px-3 py-2'>
                      {children}
                    </td>
                  ),
                  a: ({ children }) => (
                    <a
                      target='_blank'
                      rel='noreferrer'
                      className='text-primary-light underline inline-flex items-center gap-1'>
                      {children}
                      <ExternalLink size={14} />
                    </a>
                  ),
                }}
              >
                {msg.content}
              </Markdown>
              {msg.images?.length ? (
                <div className='grid grid-cols-3 gap-2 mt-3'>
                  {msg.images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setLightbox({ images: msg.images!, index: i })}
                      className='p-0 border-0 cursor-pointer'
                    >
                      <img
                        src={src}
                        alt={`result ${i + 1}`}
                        className='w-full h-30 object-cover rounded-lg border border-white/10'
                      />
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
            <p className={`text-[11px] text-text-muted mt-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
              {formatTime(msg.createdAt)}
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
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          initialIndex={lightbox.index}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
};

export default MessageList;
