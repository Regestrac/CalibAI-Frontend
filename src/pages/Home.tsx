import SignupPage from './SignupPage'

const Home = () => {
  return (
    <div className='h-screen flex bg-[#0d0f41] text-white overflow-hidden'>
      <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
        <SignupPage />
      </div>
    </div>
  )
}

export default Home