import { useEffect, useState } from 'react';
import { Check, Crown, Zap, X } from 'lucide-react';
import { useAppSelector } from '../../hooks/redux-hooks';
import { createOrder } from '../../services/createOrder';
import { verifyPayment } from '../../services/verifyPayment';
import { showErrorToast } from '../../utils/toast';

type PlanConfig = {
  id: "starter" | "pro" | "free";
  name: string;
  price: number;
  credits: number;
  features: string[];
};

const plans: PlanConfig[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 199,
    credits: 500,
    features: ['500 credits/month', 'Priority support', 'Standard models'],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 399,
    credits: 1000,
    features: ['1000 credits/month', 'Priority support', 'Advanced models', 'Early access to features'],
  },
];

type PlansDrawerPropsType = {
  isOpen: boolean;
  onClose: () => void;
};

const PlansDrawer = ({ isOpen, onClose }: PlansDrawerPropsType) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const userData = useAppSelector((state) => state.user.userData);

  const handleUpgrade = async (planId: "starter" | "pro" | "free") => {
    try {
      const data = await createOrder({ plan: planId });
      if (!data) {
        return;
      }
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data?.order?.amount,
        currency: data?.order?.currency,
        name: "CalibAI",
        description: `${data?.plan?.name} Plan Subscription`,
        order_id: data?.order?.id,
        handler: async (response: RazorpayResponse) => {
          try {
            await verifyPayment(response);
          } catch (error) {
            showErrorToast(`Verify payment error: ${error instanceof Error ? error.message : error}`);
          }
        },
        theme: {
          color: '#3399cc',
        },
      };
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      showErrorToast(`Upgrade plan error: ${error instanceof Error ? error.message : error}`);
    }
  };

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
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
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

          <h3 className='text-sm font-medium text-text-secondary uppercase tracking-wider'>Available Plans</h3>

          {plans.map((plan) => {
            const isCurrent = userData?.plan?.toLowerCase() === plan.id;
            return (
              <div
                key={plan.id}
                className={`rounded-2xl border p-5 transition-colors ${isCurrent
                  ? 'bg-primary/10 border-primary/30'
                  : 'bg-bg-card border-white/6'
                  }`}
              >
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Zap size={18} className={isCurrent ? 'text-primary-light' : 'text-accent'} />
                    <h4 className='text-base font-semibold text-white'>{plan.name}</h4>
                  </div>
                  <div className='text-right'>
                    <span className='text-lg font-bold text-white'>₹{plan.price}</span>
                    <span className='text-xs text-text-muted'>/month</span>
                  </div>
                </div>
                <p className='mt-1 text-sm text-text-secondary'>{plan.credits} credits</p>
                <ul className='mt-3 space-y-1.5'>
                  {plan.features.map((feature) => (
                    <li key={feature} className='flex items-center gap-2 text-sm text-text-secondary'>
                      <Check size={14} className='shrink-0 text-accent' />
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  disabled={isCurrent}
                  onClick={() => handleUpgrade(plan.id)}
                  className={`mt-4 w-full py-2 rounded-lg text-sm font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${isCurrent
                    ? 'bg-white/5 text-text-secondary'
                    : 'bg-linear-to-br from-primary to-primary-dark text-white hover:opacity-90'
                    }`}
                >
                  {isCurrent ? 'Current Plan' : 'Upgrade'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlansDrawer;
