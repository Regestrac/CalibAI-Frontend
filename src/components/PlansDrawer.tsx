import { useEffect, useState } from 'react';
import { Crown, X } from 'lucide-react';
import { useAppSelector } from '../hooks/redux-hooks';

type PlansDrawerPropsType = {
  isOpen: boolean;
  onClose: () => void;
};

const PlansDrawer = ({ isOpen, onClose }: PlansDrawerPropsType) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const userData = useAppSelector((state) => state.user.userData);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      });
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return (
    <div className='fixed inset-0 z-100 flex justify-end'>
      <div
        className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />
      <div
        className={`relative w-full max-w-md bg-bg-secondary border-l border-white/6 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isAnimating ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className='flex items-center justify-between p-4 border-b border-white/6'>
          <h2 className='text-lg font-semibold text-white'>Plans & Billing</h2>
          <button onClick={onClose} className='p-1.5 rounded-md text-text-secondary hover:text-white hover:bg-bg-elevated transition-colors cursor-pointer'>
            <X size={20} />
          </button>
        </div>

        <div className='flex-1 overflow-y-auto p-5 space-y-5'>
          <div className='rounded-2xl bg-bg-card border border-white/6 p-5'>
            <div className='flex items-center justify-between'>
              <div className='space-y-1'>
                <p className='text-sm text-text-secondary'>Current Plan</p>
                <h3 className='text-xl font-bold text-white capitalize'>{userData?.plan || 'Free'}</h3>
              </div>
              <div className='w-12 h-12 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center'>
                <Crown size={22} className='text-accent' />
              </div>
            </div>
            <div className='mt-4 pt-4 border-t border-white/6 space-y-3'>
              <div className='flex items-center justify-between'>
                <span className='text-sm text-text-secondary'>Credits</span>
                <span className='text-sm font-semibold text-white'>
                  {userData?.credits ?? 0}/{userData?.totalCredits ?? 0}
                </span>
              </div>
              <div className='w-full h-2 rounded-full bg-white/6 overflow-hidden'>
                <div
                  className='h-full rounded-full bg-linear-to-r from-primary to-primary-light transition-all duration-500 ease-out'
                  style={{
                    width: `${Math.min(
                      ((userData?.credits ?? 0) / (userData?.totalCredits ?? 1)) * 100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansDrawer;
