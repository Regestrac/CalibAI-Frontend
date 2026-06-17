import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from './Nav';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { getMessages } from '../services/getMessages';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { setMessages, setLoading, clearMessages, setArtifacts } from '../redux/messageSlice';

const ChatArea = () => {
  const { pathname } = useLocation();
  const id = pathname.includes('/chat/') ? pathname.split('/')?.at(-1) : '';

  const isArtifactExpanded = useAppSelector((state) => state.message.isArtifactOpen && state.message.isArtifactExpanded);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchMessages = async () => {
      dispatch(setLoading(true));
      const data = await getMessages(id);
      dispatch(setMessages(data.messages || data));
      dispatch(setArtifacts(data?.[data?.length - 1]?.artifacts || []));
      dispatch(setLoading(false));
    };

    if (id) {
      fetchMessages();
    } else {
      dispatch(clearMessages());
    };
  }, [dispatch, id]);

  return (
    <div className={`h-full flex flex-col min-w-0 ${isArtifactExpanded ? 'lg:w-180 lg:shrink-0 lg:flex-none' : 'flex-1'}`}>
      <Nav />
      <MessageList />
      <ChatInput />
    </div>
  );
};

export default ChatArea;
