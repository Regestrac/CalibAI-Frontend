import Artifact from '../components/Artifact';
import ChatArea from '../components/ChatArea';
import Sidebar from '../components/Sidebar';
import SignupPage from './SignupPage';

const userData = true;

const Home = () => {
  return (
    <div className='h-screen flex bg-linear-to-br from-bg-primary via-[#0c0b20] to-bg-primary text-white overflow-hidden'>

      <Sidebar />
      <ChatArea />
      <Artifact />

      {!userData ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-overlay backdrop-blur-sm'>
          <SignupPage />
        </div>
      ) : null}
    </div>
  );
};

export default Home;