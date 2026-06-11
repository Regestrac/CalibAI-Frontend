import { useParams } from 'react-router-dom';
import { Ellipsis } from 'lucide-react';
import { useAppSelector } from '../hooks/redux-hooks';

const Nav = () => {
  const { id } = useParams();
  const conversations = useAppSelector((state) => state.conversation.conversations);
  const conversation = conversations.find((c) => c._id === id);
  const title = conversation?.title || 'New Chat';

  return (
    <div className='flex items-center justify-between px-6 py-3 border-b border-white/6 shrink-0'>
      <h1 className='text-sm font-medium text-white'>{title}</h1>
      <button className='p-1.5 rounded-md text-text-secondary hover:text-white hover:bg-bg-elevated transition-colors cursor-pointer'>
        <Ellipsis size={18} />
      </button>
    </div>
  );
};

export default Nav;
