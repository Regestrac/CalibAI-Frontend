import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PanelLeftClose, PanelLeftOpen, SquarePen, X } from 'lucide-react';
import PlansDrawer from './sidebar/PlansDrawer';
import AccountDetails from './sidebar/AccountDetails';
import ConversationList from './sidebar/ConversationList';

type SidebarProps = {
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

const Sidebar = ({ mobileOpen, onCloseMobile }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showPlans, setShowPlans] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (mobileOpen && isCollapsed) {
      setIsCollapsed(false);
    }
  }, [isCollapsed, mobileOpen]);

  const handleNewChatClick = async () => {
    navigate("/");
  };

  return (
    <>
      <div
        className={`
          fixed inset-y-0 left-0 z-50 h-screen shrink-0 bg-bg-secondary border-r border-white/6
          transition-all duration-300 overflow-hidden flex flex-col
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static
          ${isCollapsed ? 'w-14' : 'w-67.5'}
        `}
      >
        <div className='flex items-center justify-between p-4 min-w-67.5'>
          {!isCollapsed && (
            <span className='flex items-center gap-2'>
              <img src='/ai-brain.png' alt='CalibAI' className='size-5 select-none' draggable={false} />
              <span className='font-semibold text-white tracking-tight'>CalibAI</span>
              <span className='text-[10px] font-medium uppercase tracking-wider text-accent border border-accent/20 rounded px-1.5 py-0.5 leading-none'>
                Free
              </span>
            </span>
          )}
          <div className='flex items-center gap-1'>
            <button
              onClick={onCloseMobile}
              className='p-1.5 rounded-md text-text-secondary hover:text-white hover:bg-bg-elevated transition-colors cursor-pointer lg:hidden'
            >
              <X size={20} />
            </button>
            <button
              onClick={() => setIsCollapsed((prev) => !prev)}
              className='p-1.5 rounded-md text-text-secondary hover:text-white hover:bg-bg-elevated transition-colors cursor-pointer max-lg:hidden'
            >
              {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
            </button>
          </div>
        </div>
        <div className={isCollapsed ? 'flex justify-center' : 'px-4'}>
          <button
            onClick={handleNewChatClick}
            className={`flex items-center gap-2 p-2 rounded-md bg-linear-to-br from-primary to-primary-dark text-white font-medium hover:opacity-90 transition-all cursor-pointer ${!isCollapsed ? 'w-full' : ''}`}
          >
            <span className='shrink-0'><SquarePen size={18} /></span>
            {!isCollapsed && <span className='text-sm'>New chat</span>}
          </button>
        </div>

        <ConversationList
          isCollapsed={isCollapsed}
          onCloseMobile={onCloseMobile}
        />

        <div className='mx-2.5 border-t border-white/6' />

        <AccountDetails
          isCollapsed={isCollapsed}
          setShowPlans={setShowPlans}
        />

      </div>
      <PlansDrawer
        isOpen={showPlans}
        onClose={() => setShowPlans(false)}
      />
    </>
  );
};

export default Sidebar;