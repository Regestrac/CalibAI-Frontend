import Artifact from '../components/Artifact';
import ChatArea from '../components/ChatArea';
import Sidebar from '../components/Sidebar';
import SignupPage from './SignupPage';

const userData = true;

const Home = () => {
  return (
    <div className='h-screen flex bg-[#0d0f41] text-white overflow-hidden'>

      <Sidebar />
      <ChatArea />
      <Artifact />

      {!userData ? (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
          <SignupPage />
        </div>
      ) : null}
    </div>
  );
};

export default Home;