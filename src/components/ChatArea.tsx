import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Nav from './Nav';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { getMessages } from '../services/getMessages';
import { useAppDispatch } from '../hooks/redux-hooks';
import { setMessages, setLoading } from '../redux/messageSlice';

const ChatArea = () => {
  const { pathname } = useLocation();
  const id = pathname.includes('/chat/') ? pathname.split('/')?.at(-1) : '';

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!id) return;

    const fetchMessages = async () => {
      dispatch(setLoading(true));
      const data = await getMessages(id);
      dispatch(setMessages(data.messages || data));
      dispatch(setLoading(false));
    };

    fetchMessages();
  }, [dispatch, id]);

  return (
    <div className='flex-1 h-full flex flex-col'>
      <Nav />
      <MessageList />
      <ChatInput />
    </div>
  );
};

export default ChatArea;
