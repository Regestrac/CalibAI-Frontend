import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux-hooks';
import { Ellipsis, LoaderCircle, MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { removeConversation, setConversations, updateConversationTitle } from '../../redux/conversationSlice';
import { updateConversation } from '../../services/updateConversation';
import { getConversations } from '../../services/getConversations';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { deleteConversation } from '../../services/deleteConversation';
import ConfirmDialog from '../ConfirmDialog';

const ConversationList = ({ isCollapsed, onCloseMobile }: { isCollapsed: boolean; onCloseMobile: () => void; }) => {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameDraft, setRenameDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [menuOpenFor, setMenuOpenFor] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const conversations = useAppSelector((state) => state.conversation.conversations);
  const userData = useAppSelector((state) => state.user.userData);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { pathname } = useLocation();

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
    if (!menuOpenFor) return;
    const closeMenu = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest('[data-chat-menu]')) return;
      setMenuOpenFor(null);
    };
    document.addEventListener('mousedown', closeMenu);
    return () => document.removeEventListener('mousedown', closeMenu);
  }, [menuOpenFor]);

  return (
    <>
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

export default ConversationList;