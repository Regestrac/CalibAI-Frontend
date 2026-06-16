import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

type LightboxProps = {
  images: string[];
  initialIndex: number;
  onClose: () => void;
};

const Lightbox = ({ images, initialIndex, onClose }: LightboxProps) => {
  const [index, setIndex] = useState(initialIndex);

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(images.length - 1, i + 1));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(0, i - 1));
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(images.length - 1, i + 1));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [images.length, onClose]);

  return (
    <div
      className='fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center'
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className='absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors'
        aria-label='Close'
      >
        <X size={20} />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          prev();
        }}
        disabled={index === 0}
        className='absolute left-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors'
        aria-label='Previous image'
      >
        <ChevronLeft size={24} />
      </button>

      <img
        src={images[index]}
        alt={`result ${index + 1}`}
        className='max-w-[85%] max-h-[80vh] object-contain rounded-lg shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      />

      <button
        onClick={(e) => {
          e.stopPropagation();
          next();
        }}
        disabled={index === images.length - 1}
        className='absolute right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-white transition-colors'
        aria-label='Next image'
      >
        <ChevronRight size={24} />
      </button>

      <span className='absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-white/10 text-white text-sm'>
        {index + 1} / {images.length}
      </span>
    </div>
  );
};

export default Lightbox;