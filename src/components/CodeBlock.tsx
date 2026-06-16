import { useState, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';
import { PrismLight as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

type CodeBlockProps = {
  className?: string;
  children?: ReactNode;
};

const CodeBlock = ({ className, children }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);

  const match = /language-(\w+)/.exec(className ?? '');
  const language = match ? match[1] : 'text';
  const code = String(children).replace(/\n$/, '');
  const isBlock = Boolean(match) || code.includes('\n');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  if (!isBlock) {
    return (
      <code className='px-1.5 py-0.5 rounded-md bg-white/10 text-amber-200 font-mono text-[0.85em]'>
        {children}
      </code>
    );
  }

  return (
    <div className='my-3 rounded-lg overflow-hidden border border-white/10 bg-[#0d1117]'>
      <div className='flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10'>
        <span className='text-xs text-gray-400 font-mono'>{language}</span>
        <button
          onClick={handleCopy}
          className='flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors'
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        customStyle={{
          margin: 0,
          padding: '12px 16px',
          background: 'transparent',
          fontSize: '13px',
          lineHeight: '1.6',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'inherit',
          },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;