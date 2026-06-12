import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import Nav from './Nav';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import { getMessages } from '../services/getMessages';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { setMessages, setLoading, addMessage } from '../redux/messageSlice';
import type { Message } from '../types/chat';

const ChatArea = () => {
  const { pathname } = useLocation();
  const id = pathname.split('/')?.at(-1);

  const dispatch = useAppDispatch();
  const { messages, loading } = useAppSelector((state) => state.message);

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

  const handleSend = (text: string) => {
    const userMsg: Message = {
      _id: Date.now().toString(),
      role: 'user',
      content: text,
      createdAt: new Date().toISOString(),
    };
    dispatch(addMessage(userMsg));
  };

  if (loading) {
    return (
      <div className='flex-1 h-full flex items-center justify-center'>
        <LoaderCircle size={24} className='animate-spin text-text-muted' />
      </div>
    );
  }

  return (
    <div className='flex-1 h-full flex flex-col'>
      <Nav />
      {messages.length === 0 ? (
        <div className='flex-1 flex items-center justify-center text-sm text-text-muted'>
          No messages yet
        </div>
      ) : (
        <MessageList messages={messages} />
      )}
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ChatArea;
