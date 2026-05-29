import { useEffect } from 'react';
import Home from './pages/Home';
import { getCurrentUser } from './services/getCurrentUser';
import { useAppDispatch } from './hooks/redux-hooks';
import { setUserData } from './redux/userSlice';

const App = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const getUser = async () => {
      const userData = await getCurrentUser();
      dispatch(setUserData({ userData }));
    }
    getUser();
  }, [dispatch]);

  return (
    <Home />
  )
};

export default App;