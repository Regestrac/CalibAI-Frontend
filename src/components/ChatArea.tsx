import { motion } from 'framer-motion';
import Nav from './Nav';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { useAppSelector } from '../hooks/redux-hooks';
import FetchMessages from './FetchMessages';

const ChatArea = () => {
  const isArtifactOpen = useAppSelector((state) => state.message.isArtifactOpen);
  const isArtifactExpanded = useAppSelector((state) => state.message.isArtifactExpanded);

  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const chatWidth = !isDesktop || !isArtifactOpen ? '100%' : isArtifactExpanded ? '40%' : '60%';

  return (
    <motion.div
      className='h-full flex flex-col min-w-0'
      initial={false}
      animate={{ width: chatWidth }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{ flexShrink: 0 }}
    >
      <FetchMessages />
      <Nav />
      <MessageList />
      <ChatInput />
    </motion.div>
  );
};

export default ChatArea;
