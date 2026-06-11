import { useState } from 'react';
import Nav from './Nav';
import MessageList from './MessageList';
import ChatInput from './ChatInput';
import type { Message } from '../types/chat';

const dummyMessages: Message[] = [
  { id: '1', role: 'assistant', content: 'Hello! How can I help you today?', timestamp: new Date(Date.now() - 3600000) },
  { id: '2', role: 'user', content: 'Can you explain how React hooks work?', timestamp: new Date(Date.now() - 3000000) },
  {
    id: '3', role: 'assistant', content: `React hooks are functions that let you use state and other React features in functional components. The most common hooks are:

- **useState**: Manages local state
- **useEffect**: Handles side effects like API calls
- **useRef**: Creates mutable references
- **useCallback**: Memoizes functions
- **useMemo**: Memoizes computed values

Would you like me to dive deeper into any specific hook?`, timestamp: new Date(Date.now() - 2400000)
  },
  { id: '4', role: 'user', content: 'Show me an example of useEffect', timestamp: new Date(Date.now() - 1800000) },
  {
    id: '5', role: 'assistant', content: `Here's a simple useEffect example that fetches data:

\`\`\`tsx
import { useState, useEffect } from 'react';

function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, [userId]);

  if (!user) return <p>Loading...</p>;
  return <h1>{user.name}</h1>;
}
\`\`\`

The dependency array \`[userId]\` ensures the effect only re-runs when \`userId\` changes.`, timestamp: new Date(Date.now() - 1200000)
  },
];

const ChatArea = () => {
  const [messages, setMessages] = useState<Message[]>(dummyMessages);

  const handleSend = (text: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
  };

  return (
    <div className='flex-1 h-full flex flex-col'>
      <Nav />
      <MessageList messages={messages} />
      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default ChatArea;
