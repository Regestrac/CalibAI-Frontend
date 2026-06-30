import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Ellipsis, PanelRightClose, PanelRightOpen, Pencil, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { setArtifactOpen } from '../redux/messageSlice';
import { removeConversation, updateConversationTitle } from '../redux/conversationSlice';
import { deleteConversation } from '../services/deleteConversation';
import { updateConversation } from '../services/updateConversation';
import ConfirmDialog from './ConfirmDialog';

const Nav = () => {
  const { pathname } = useLocation();
  const id = pathname.includes('/chat/') ? pathname.split('/')?.at(-1) : '';
  const conversations = useAppSelector((state) => state.conversation.conversations);
  const conversation = conversations.find((c) => c._id === id);
  const title = conversation?.title || 'New Chat';

  const isArtifactOpen = useAppSelector((state) => state.message.isArtifactOpen);
  const artifactCount = useAppSelector((state) => state.message.artifacts.length);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameDraft, setRenameDraft] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const closeMenu = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest('[data-chat-menu]')) return;
      setMenuOpen(false);
    };
    document.addEventListener('mousedown', closeMenu);
    return () => document.removeEventListener('mousedown', closeMenu);
  }, [menuOpen]);

  const handleRename = () => {
    setMenuOpen(false);
    setIsRenaming(true);
    setRenameDraft(conversation?.title || '');
  };

  const saveRename = async () => {
    if (!id) return;
    const newTitle = renameDraft.trim();
    setIsRenaming(false);
    if (!newTitle) return;
    const current = conversation?.title || '';
    if (newTitle === current) return;
    dispatch(updateConversationTitle({ convId: id, title: newTitle }));
    await updateConversation(id, newTitle);
  };

  const handleRenameKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveRename();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsRenaming(false);
    }
  };

  const handleDeleteConversation = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget);
    await deleteConversation(deleteTarget);
    dispatch(removeConversation(deleteTarget));
    setDeletingId(null);
    setDeleteTarget(null);
    navigate("/");
  };

  const handleCloseDeleteDialog = () => {
    if (!deletingId) {
      setDeleteTarget(null);
    }
  };

  return (
    <div className='relative flex items-center justify-between px-6 py-3 border-b border-white/6 shrink-0'>
      {isRenaming ? (
        <input
          autoFocus
          value={renameDraft}
          onChange={(e) => setRenameDraft(e.target.value)}
          onKeyDown={handleRenameKeyDown}
          onBlur={saveRename}
          maxLength={100}
          className='w-full max-w-72 h-7 rounded-md bg-bg-elevated border border-primary/40 px-2 text-sm text-white outline-none'
        />
      ) : (
        <h1 className='text-sm font-medium text-white truncate'>{title}</h1>
      )}
      <div className='flex items-center gap-1'>
        {artifactCount > 0 && (
          <button
            onClick={() => dispatch(setArtifactOpen(!isArtifactOpen))}
            className={`relative p-1.5 rounded-md transition-colors cursor-pointer ${isArtifactOpen
              ? 'text-primary-light bg-primary/10'
              : 'text-text-secondary hover:text-white hover:bg-bg-elevated'}`
            }
            title={isArtifactOpen ? 'Close artifacts' : 'Open artifacts'}
          >
            {isArtifactOpen ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
            {!isArtifactOpen && artifactCount > 0 && (
              <span className='absolute top-1 right-1 w-2 h-2 rounded-full bg-accent' />
            )}
          </button>
        )}
        {id && (
          <div className='relative'>
            <button
              type='button'
              onClick={() => setMenuOpen((prev) => !prev)}
              className='p-1.5 rounded-md text-text-secondary hover:text-white hover:bg-bg-elevated transition-colors cursor-pointer'
            >
              <Ellipsis size={18} />
            </button>
            {menuOpen && (
              <div data-chat-menu className='absolute right-0 top-full mt-1 z-30 w-44 bg-bg-elevated border border-white/6 rounded-lg shadow-xl overflow-hidden py-1'>
                <button
                  type='button'
                  onClick={handleRename}
                  className='w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors cursor-pointer'
                >
                  <Pencil size={14} />
                  Rename
                </button>
                <button
                  type='button'
                  onClick={() => { setMenuOpen(false); setDeleteTarget(id); }}
                  className='w-full flex items-center gap-2 px-3 py-2 text-sm text-text-secondary hover:text-white hover:bg-white/5 transition-colors cursor-pointer'
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <ConfirmDialog
        open={!!deleteTarget}
        title='Delete conversation'
        message='This conversation and its messages will be permanently deleted. This action cannot be undone.'
        confirmLabel='Delete'
        loading={!!deletingId}
        onConfirm={handleDeleteConversation}
        onClose={handleCloseDeleteDialog}
      />
    </div>
  );
};

export default Nav;