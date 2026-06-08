import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MessageSquare, PanelLeftClose, PanelLeftOpen, SquarePen } from 'lucide-react';

const dummyChats = [
  { id: '1', title: 'Understanding React hooks and their lifecycle' },
  { id: '2', title: 'Building a REST API with Node.js' },
  { id: '3', title: 'CSS Grid vs Flexbox comparison' },
  { id: '4', title: 'Machine learning fundamentals' },
  { id: '5', title: 'Docker deployment strategies' },
  { id: '6', title: 'TypeScript advanced types' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className={`fixed lg:static inset-y-0 left-0 z-50 h-screen shrink-0 bg-bg-secondary border-r border-white/6 transition-all duration-300 overflow-hidden flex flex-col ${!collapsed ? 'w-67.5' : 'w-14'}`}>
      <div className='flex items-center justify-between p-4 min-w-67.5'>
        {!collapsed && (
          <span className='flex items-center gap-2'>
            <span className='font-semibold text-white tracking-tight'>CalibAI</span>
            <span className='text-[10px] font-medium uppercase tracking-wider text-accent border border-accent/20 rounded px-1.5 py-0.5 leading-none'>
              Free
            </span>
          </span>
        )}
        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className='p-1.5 rounded-md text-text-secondary hover:text-white hover:bg-bg-elevated transition-colors cursor-pointer'
        >
          {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>
      <div className={collapsed ? 'flex justify-center' : 'px-4'}>
        <Link
          to='/'
          className={`flex items-center gap-2 p-2 rounded-md bg-linear-to-br from-primary to-primary-dark text-white font-medium hover:opacity-90 transition-all ${!collapsed ? 'w-full' : ''}`}
        >
          <span className='shrink-0'><SquarePen size={18} /></span>
          {!collapsed && <span className='text-sm'>New chat</span>}
        </Link>
      </div>

      <nav className='flex-1 overflow-y-auto min-w-67.5 mt-8'>
        {dummyChats.map((chat) => (
          <Link
            key={chat.id}
            to={`/chat/${chat.id}`}
            className={`flex items-center gap-3 px-4 py-2.5 transition-colors border-l-2 ${
              pathname === `/chat/${chat.id}`
                ? 'bg-primary/10 text-white border-l-primary'
                : 'text-text-secondary border-l-transparent hover:bg-bg-elevated hover:text-white'
            }`}
          >
            <MessageSquare size={16} className='shrink-0' />
            {!collapsed && <span className='text-sm truncate'>{chat.title}</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;