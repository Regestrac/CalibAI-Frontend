import { useRef, type ReactNode } from 'react';
import { X, FileText } from 'lucide-react';
import { showErrorToast } from '../utils/toast';

type FileUploadProps = {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  disabled?: boolean;
  children: ReactNode;
};

const ACCEPTED_TYPES = 'application/pdf,image/*';
const MAX_SIZE_MB = 10;

const FileUpload = ({ file, onFileSelect, disabled, children }: FileUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      showErrorToast(`File must be under ${MAX_SIZE_MB}MB.`);
      return;
    }

    onFileSelect(selected);
    e.target.value = '';
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onFileSelect(null);
  };

  if (file) {
    const isImage = file.type.startsWith('image/');
    return (
      <div className='group relative inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-bg-elevated border border-white/6 text-sm text-white max-w-50 shrink-0'>
        {isImage ? (
          <img
            src={URL.createObjectURL(file)}
            alt={file.name}
            className='w-10 h-10 rounded object-cover shrink-0'
          />
        ) : (
          <>
            <FileText size={18} className='text-primary-light shrink-0 my-1' />
            <span className='truncate text-xs me-2'>{file.name}</span>
          </>
        )}
        <button
          type='button'
          onClick={handleRemove}
          className='absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-white border border-white/10 text-black/60 hover:text-black transition-colors cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100'
        >
          <X size={13} />
        </button>
      </div>
    );
  }

  return (
    <>
      <input
        ref={inputRef}
        type='file'
        accept={ACCEPTED_TYPES}
        onChange={handleChange}
        className='hidden'
      />
      <button
        type='button'
        disabled={disabled}
        onClick={handleClick}
        className='p-2 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed'
      >
        {children}
      </button>
    </>
  );
};

export default FileUpload;
