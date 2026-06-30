import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Coins, Ellipsis, LoaderCircle, LogOut, MessageSquare, PanelLeftClose, PanelLeftOpen, Pencil, SquarePen, Trash2, X } from 'lucide-react';
import { getConversations } from '../services/getConversations';
import { deleteConversation } from '../services/deleteConversation';
import { updateConversation } from '../services/updateConversation';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { removeConversation, setConversations, updateConversationTitle } from '../redux/conversationSlice';
import { logout } from '../services/logout';
import { setUserData } from '../redux/userSlice';
import PlansDrawer from './PlansDrawer';
import ConfirmDialog from './ConfirmDialog';

type SidebarProps = {
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

const Sidebar = ({ mobileOpen, onCloseMobile }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPlans, setShowPlans] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState('');

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

  useEffect(() => {
    if (!menuOpenFor) return;
    const closeMenu = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest('[data-chat-menu]')) return;
      setMenuOpenFor(null);
    };
    document.addEventListener('mousedown', closeMenu);
    return () => document.removeEventListener('mousedown', closeMenu);
  }, [menuOpenFor]);

  const handleNewChatClick = async () => {
    navigate("/");
  };

  const handleRename = (id: string) => {
    setMenuOpenFor(null);
    setRenamingId(id);
    setRenameDraft(conversations.find((c) => c._id === id)?.title || '');
  };

  const saveRename = async () => {
    if (!renamingId) return;
    const id = renamingId;
    const title = renameDraft.trim();
    setRenamingId(null);
    setRenameDraft('');
    if (!title) return;
    const current = conversations.find((c) => c._id === id)?.title || '';
    if (title === current) return;
    dispatch(updateConversationTitle({ convId: id, title }));
    await updateConversation(id, title);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveRename();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setRenamingId(null);
    }
  };

  const handleDeleteConversation = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget);
    await deleteConversation(deleteTarget);
    dispatch(removeConversation(deleteTarget));
    if (pathname === `/chat/${deleteTarget}`) {
      navigate("/");
    }
    setDeletingId(null);
    setDeleteTarget(null);
  };

  const handleCloseDeleteDialog = () => {
    if (!deletingId) {
      setDeleteTarget(null);
    }
  };

  const handleCreditsClick = () => {
    setShowPlans(true);
  };

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
                className={`group relative flex items-center gap-3 px-4 py-2.5 transition-colors border-l-2 ${pathname === `/chat/${chat._id}`
                  ? 'bg-primary/10 text-white border-l-primary'
                  : 'text-text-secondary border-l-transparent hover:bg-bg-elevated hover:text-white'
                  }`}
              >
                <MessageSquare size={16} className={`shrink-0 ${pathname === `/chat/${chat._id}` ? 'text-primary-light' : ''}`} />
                {!isCollapsed && renamingId === chat._id ? (
                  <div onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} className='flex-1 min-w-0'>
                    <input
                      autoFocus
                      value={renameDraft}
                      onChange={(e) => setRenameDraft(e.target.value)}
                      onKeyDown={handleRenameKeyDown}
                      onBlur={saveRename}
                      maxLength={100}
                      className='w-full bg-bg-elevated border border-primary/40 rounded px-2 py-1 text-sm text-white outline-none'
                    />
                  </div>
                ) : (
                  <>
                    {!isCollapsed && <span className='flex-1 text-sm truncate'>{chat.title || 'New Chat'}</span>}
                    {!isCollapsed && (
                      <button
                        type='button'
                        onMouseDown={(e) => e.stopPropagation()}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setMenuOpenFor(menuOpenFor === chat._id ? null : chat._id);
                        }}
                        title='More options'
                        className={`text-text-muted hover:text-white transition-opacity cursor-pointer shrink-0 ${menuOpenFor === chat._id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                      >
                        <Ellipsis size={16} />
                      </button>
                    )}
                  </>
                )}
                {menuOpenFor === chat._id && !isCollapsed && (
                  <div data-chat-menu className='absolute right-2 top-full mt-1 z-30 w-36 bg-bg-elevated border border-white/6 rounded-lg shadow-xl overflow-hidden py-1'>
                    <button
                      type='button'
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRename(chat._id); }}
                      className='w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors cursor-pointer'
                    >
                      <Pencil size={14} />
                      Rename
                    </button>
                    <button
                      type='button'
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setDeleteTarget(chat._id); }}
                      className='w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors cursor-pointer'
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                )}
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
      <PlansDrawer isOpen={showPlans} onClose={() => setShowPlans(false)} />
      <ConfirmDialog
        open={!!deleteTarget}
        title='Delete conversation'
        message='This conversation and its messages will be permanently deleted. This action cannot be undone.'
        confirmLabel='Delete'
        loading={!!deletingId}
        onConfirm={handleDeleteConversation}
        onClose={handleCloseDeleteDialog}
      />
    </>
  );
};

export default Sidebar;