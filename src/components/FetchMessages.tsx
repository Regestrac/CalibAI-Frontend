import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getMessages } from '../services/getMessages';
import { useAppDispatch, useAppSelector } from '../hooks/redux-hooks';
import { setMessages, setLoading, clearMessages, setArtifacts, setLoadedConversationId } from '../redux/messageSlice';

const FetchMessages = () => {
  const loadedConversationId = useAppSelector((state) => state.message.loadedConversationId);

  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  const id = pathname.includes('/chat/') ? pathname.split('/')?.at(-1) : '';

  const loadedConversationIdRef = useRef(loadedConversationId);

  useEffect(() => {
    loadedConversationIdRef.current = loadedConversationId;
  }, [loadedConversationId]);

  useEffect(() => {
    const fetchMessages = async (chatId: string) => {
      dispatch(setLoading(true));
      const data = await getMessages(chatId);
      dispatch(setMessages(data.messages || data));
      const latestArtifactMessage = [...data].reverse().find((item) => item?.artifacts && item?.artifacts?.length);
      dispatch(setArtifacts(latestArtifactMessage?.artifacts || []));
      dispatch(setLoadedConversationId(chatId));
      dispatch(setLoading(false));
    };

    if (id) {
      if (loadedConversationIdRef.current === id) {
        return;
      }
      fetchMessages(id);
    } else {
      dispatch(clearMessages());
      dispatch(setLoadedConversationId(null));
    }
  }, [dispatch, id]);

  return null;
};

export default FetchMessages;