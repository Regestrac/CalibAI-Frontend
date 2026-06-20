import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Coins, LoaderCircle, LogOut, MessageSquare, PanelLeftClose, PanelLeftOpen, SquarePen, X } from 'lucide-react';
import { getConversations } from '../services/getConversations';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { setConversations } from '../redux/conversationSlice';
import { logout } from '../services/logout';
import { setUserData } from '../redux/userSlice';

type SidebarProps = {
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

const Sidebar = ({ mobileOpen, onCloseMobile }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);

  const conversations = useAppSelector((state) => state.conversation.conversations);
  const userData = useAppSelector((state) => state.user.userData);

  const { pathname } = useLocation();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getConv = async () => {
      setLoading(true);
      const data = await getConversations();
      dispatch(setConversations(data));
      setLoading(false);
    };
    if (userData?.userId) {
      getConv();
    }
  }, [dispatch, userData?.userId]);

  useEffect(() => {
    if (mobileOpen && isCollapsed) {
      setIsCollapsed(false);
    }
  }, [isCollapsed, mobileOpen]);

  const handleNewChatClick = async () => {
    navigate("/");
  };

  const handleCreditsClick = () => { };

  const handleLogout = async () => {
    await logout();
    dispatch(setUserData({ userData: null }));
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

        <nav className='flex-1 overflow-y-auto min-w-67.5 mt-8'>
          {loading ? (
            !isCollapsed && (
              <div className='flex items-center justify-center gap-2 px-4 py-4 text-sm text-text-muted'>
                <LoaderCircle size={14} className='animate-spin' />
                Loading conversations...
              </div>
            )
          ) : conversations.length === 0 ? (
            !isCollapsed && (
              <p className='px-4 text-sm text-text-muted'>No recent conversations</p>
            )
          ) : (
            conversations.map((chat) => (
              <Link
                key={chat._id}
                to={`/chat/${chat._id}`}
                onClick={() => { onCloseMobile(); }}
                className={`flex items-center gap-3 px-4 py-2.5 transition-colors border-l-2 ${pathname === `/chat/${chat._id}`
                  ? 'bg-primary/10 text-white border-l-primary'
                  : 'text-text-secondary border-l-transparent hover:bg-bg-elevated hover:text-white'
                  }`}
              >
                <MessageSquare size={16} className={`shrink-0 ${pathname === `/chat/${chat._id}` ? 'text-primary-light' : ''}`} />
                {!isCollapsed && <span className='text-sm truncate'>{chat.title || 'New Chat'}</span>}
              </Link>
            ))
          )}
        </nav>
        <div className='mx-2.5 border-t border-white/6' />
        <div className='flex items-center gap-3 px-3 py-5 min-w-67.5'>
          {isCollapsed ? (
            userData?.avatarUrl ? (
              <img src={userData.avatarUrl} alt='Profile pic' className='w-8 h-8 rounded-full object-cover shrink-0' />
            ) : (
              <div className='w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary-dark flex items-center justify-center text-xs font-medium text-white shrink-0'>
                {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )
          ) : (
            <>
              {userData?.avatarUrl ? (
                <img src={userData.avatarUrl} alt='Profile pic' className='w-8 h-8 rounded-full object-cover shrink-0' />
              ) : (
                <div className='w-8 h-8 rounded-full bg-linear-to-br from-primary to-primary-dark flex items-center justify-center text-xs font-medium text-white shrink-0'>
                  {userData?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
              )}
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-white truncate'>{userData?.name || 'User'}</p>
              </div>
              <div className='flex items-center gap-1'>
                <button onClick={handleCreditsClick} className='p-1.5 rounded-md text-text-secondary hover:text-accent-hover transition-colors cursor-pointer' title='Credits'>
                  <Coins size={18} />
                </button>
                <button onClick={handleLogout} className='p-1.5 rounded-md text-text-secondary hover:text-red-400 transition-colors cursor-pointer' title='Logout'>
                  <LogOut size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;