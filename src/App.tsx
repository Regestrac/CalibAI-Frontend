import { useEffect } from 'react';
import Home from './pages/Home';
import { getCurrentUser } from './services/getCurrentUser';
import { Provider } from 'react-redux';
import { store } from './redux/store';

const App = () => {
  useEffect(() => {
    const getUser = async () => {
      await getCurrentUser()
    }
    getUser();
  }, []);

  return (
    <Provider store={store}>
      <Home />
    </Provider>
  )
};

export default App;