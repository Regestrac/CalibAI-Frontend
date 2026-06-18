import { useParams } from 'react-router-dom';
import { Ellipsis, PanelRightClose, PanelRightOpen } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { setArtifactOpen } from '../redux/messageSlice';

const Nav = () => {
  const { id } = useParams();
  const conversations = useAppSelector((state) => state.conversation.conversations);
  const conversation = conversations.find((c) => c._id === id);
  const title = conversation?.title || 'New Chat';

  const isArtifactOpen = useAppSelector((state) => state.message.isArtifactOpen);
  const artifactCount = useAppSelector((state) => state.message.artifacts.length);

  const dispatch = useAppDispatch();

  return (
    <div className='flex items-center justify-between px-6 py-3 border-b border-white/6 shrink-0'>
      <h1 className='text-sm font-medium text-white'>{title}</h1>
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
        <button className='p-1.5 rounded-md text-text-secondary hover:text-white hover:bg-bg-elevated transition-colors cursor-pointer'>
          <Ellipsis size={18} />
        </button>
      </div>
    </div>
  );
};

export default Nav;
