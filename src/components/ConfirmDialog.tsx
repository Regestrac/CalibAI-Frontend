import { useEffect, useState } from 'react';
import { AlertTriangle, LoaderCircle, X } from 'lucide-react';

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  loading,
  onConfirm,
  onClose,
}: ConfirmDialogProps) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 200);
      return () => clearTimeout(timer);
    }
  }, [open]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (open) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open, onClose]);

  if (!shouldRender) return null;

  return (
    <div className='fixed inset-0 z-100 flex items-center justify-center p-4'>
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-sm bg-bg-card border border-white/6 rounded-2xl p-5 shadow-2xl transition-all duration-200 ease-in-out ${isAnimating ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
      >
        <div className='flex items-start gap-3'>
          <div className='w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0'>
            <AlertTriangle size={18} className='text-red-400' />
          </div>
          <div className='flex-1 min-w-0'>
            <h2 className='text-base font-semibold text-white'>{title}</h2>
            <p className='mt-1 text-sm text-text-secondary'>{message}</p>
          </div>
          <button onClick={onClose} className='p-1.5 -m-1 rounded-md text-text-secondary hover:text-white hover:bg-bg-elevated transition-colors cursor-pointer shrink-0'>
            <X size={18} />
          </button>
        </div>
        <div className='mt-5 flex gap-2 justify-end'>
          <button
            type='button'
            onClick={onClose}
            disabled={loading}
            className='px-4 py-2 rounded-lg text-sm font-medium text-text-secondary hover:text-white hover:bg-bg-elevated border border-white/6 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'
          >
            {cancelLabel}
          </button>
          <button
            type='button'
            onClick={onConfirm}
            disabled={loading}
            className='flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed'
          >
            {loading && <LoaderCircle size={14} className='animate-spin' />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;