import { useState } from 'react';
import { PanelLeftOpen } from 'lucide-react';
import Artifact from '../components/Artifact';
import ChatArea from '../components/ChatArea';
import Sidebar from '../components/Sidebar';
import SignupPage from './SignupPage';
import { useAppSelector } from '../hooks/redux-hooks';

const Home = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const userData = useAppSelector((state) => state.user.userData?.userId);

  return (
    <div className='h-screen flex flex-col bg-linear-to-br from-bg-primary via-[#0c0b20] to-bg-primary text-white overflow-hidden'>
      {userData ? (
        <>
          <header className='flex items-center justify-baseline gap-4 px-4 py-3 border-b border-white/6 lg:hidden shrink-0'>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className='p-1.5 rounded-md text-text-secondary hover:text-white hover:bg-bg-elevated transition-colors cursor-pointer'
            >
              <PanelLeftOpen size={20} />
            </button>
            <span className='font-semibold text-white tracking-tight'>CalibAI</span>
            <div className='w-8' />
          </header>

          <div className='flex flex-1 overflow-hidden'>
            <Sidebar mobileOpen={mobileSidebarOpen} onCloseMobile={() => setMobileSidebarOpen(false)} />
            <div className='flex-1 min-w-0 flex h-full'>
              <ChatArea />
              <Artifact />
            </div>
          </div>
        </>
      ) : (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-overlay backdrop-blur-sm'>
          <SignupPage />
        </div>
      )}
    </div>
  );
};

export default Home;