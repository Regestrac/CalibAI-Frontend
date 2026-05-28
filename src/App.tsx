import { useEffect } from 'react';
import Home from './pages/Home';
import { getCurrentUser } from './services/getCurrentUser';

const App = () => {
  useEffect(() => {
    const getUser = async () => {
      await getCurrentUser()
    }
    getUser();
  }, []);

  return <Home />
};

export default App;