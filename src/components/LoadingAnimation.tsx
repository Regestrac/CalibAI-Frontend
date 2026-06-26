import { useAppSelector } from '../hooks/redux-hooks';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const thinkingLabels = ['Thinking', 'Analyzing', 'Searching', 'Processing', 'Generating'];

const ShimmerText = ({ text, onCycle }: { text: string; onCycle: () => void }) => {
  const duration = Math.max(1.2, text.length * 0.08);

  useEffect(() => {
    const timeout = setTimeout(onCycle, duration * 1000 + 200);
    return () => clearTimeout(timeout);
  }, [text, onCycle, duration]);

  return (
    <span
      className='text-xs font-medium bg-size-[200%_100%] bg-clip-text text-transparent animate-[shimmer-gradient_2s_linear_infinite]'
      style={{
        backgroundImage: 'linear-gradient(90deg, var(--color-text-muted, #888) 0%, var(--color-text-muted, #888) 40%, var(--color-text, #fff) 50%, var(--color-text-muted, #888) 60%, var(--color-text-muted, #888) 100%)',
        backgroundPosition: '100% 0',
      }}
    >
      {text}
    </span>
  );
};

const LoadingAnimation = () => {
  const { isAnswering } = useAppSelector((state) => state.message);
  const [labelIndex, setLabelIndex] = useState(0);
  const mountedRef = useRef(false);

  useEffect(() => {
    if (!isAnswering) {
      setLabelIndex(0);
      mountedRef.current = false;
      return;
    }
    mountedRef.current = true;
  }, [isAnswering]);

  const handleCycle = () => {
    if (mountedRef.current) {
      setLabelIndex((prev) => (prev + 1) % thinkingLabels.length);
    }
  };

  return (
    isAnswering ? (
      <>
        <style>{`
          @keyframes shimmer-gradient {
            0% { background-position: 100% 0; }
            100% { background-position: -100% 0; }
          }
        `}</style>
        <div className='flex gap-3'>
          <div className='max-w-[75%] flex flex-col'>
            <span className='mb-1 h-4'>
              <AnimatePresence mode='wait'>
                <motion.span
                  key={labelIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className='inline-block'
                >
                  <ShimmerText text={thinkingLabels[labelIndex]} onCycle={handleCycle} />
                </motion.span>
              </AnimatePresence>
            </span>
            <div className='rounded-2xl rounded-bl-md px-4 py-3 bg-bg-card border border-white/6 inline-flex items-center gap-1.5'>
              <span className='w-2 h-2 rounded-full bg-text-muted animate-bounce [animation-delay:0ms]' />
              <span className='w-2 h-2 rounded-full bg-text-muted animate-bounce [animation-delay:150ms]' />
              <span className='w-2 h-2 rounded-full bg-text-muted animate-bounce [animation-delay:300ms]' />
            </div>
          </div>
        </div>
      </>
    ) : null
  );
};

export default LoadingAnimation;