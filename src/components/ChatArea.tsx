import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import Nav from './Nav';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { getMessages } from '../services/getMessages';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { useMediaQuery } from '../hooks/useMediaQuery';
import { setMessages, setLoading, clearMessages, setArtifacts } from '../redux/messageSlice';

const ChatArea = () => {
  const isArtifactOpen = useAppSelector((state) => state.message.isArtifactOpen);
  const isArtifactExpanded = useAppSelector((state) => state.message.isArtifactExpanded);

  const { pathname } = useLocation();
  const id = pathname.includes('/chat/') ? pathname.split('/')?.at(-1) : '';

  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const dispatch = useAppDispatch();

  const chatWidth = !isDesktop || !isArtifactOpen ? '100%' : isArtifactExpanded ? '40%' : '60%';

  useEffect(() => {
    const fetchMessages = async () => {
      dispatch(setLoading(true));
      const data = await getMessages(id);
      dispatch(setMessages(data.messages || data));
      const latestArtifactMessage = [...data].reverse().find((item) => item?.artifacts && item?.artifacts?.length);
      dispatch(setArtifacts(latestArtifactMessage?.artifacts || []));
      dispatch(setLoading(false));
    };

    if (id) {
      fetchMessages();
    } else {
      dispatch(clearMessages());
    };
  }, [dispatch, id]);

  return (
    <motion.div
      className='h-full flex flex-col min-w-0'
      initial={false}
      animate={{ width: chatWidth }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{ flexShrink: 0 }}
    >
      <Nav />
      <MessageList />
      <ChatInput />
    </motion.div>
  );
};

export default ChatArea;
