import { signInWithPopup } from "firebase/auth";
import GoogleIcon from "../assets/icons/GoogleIcon"
import { auth, googleProvider } from "../utils/firebase";
import api from "../utils/axios";

const SignupPage = () => {
  const handleLogin = async (token: string) => {
    try {
      const { data } = await api.post('/auth/login', { token });
      console.log(data);
    } catch (error) {
      console.log(`Login error: ${error}`);
    }
  };

  const handleContinueWithGoogle = async () => {
    const data = await signInWithPopup(auth, googleProvider);
    console.log(data);

    const token = await data?.user?.getIdToken();
    handleLogin(token);
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">Create an account</h1>
        <p className="text-gray-500 text-center mb-8">Sign up to get started</p>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-3 px-4 hover:bg-gray-50 transition-colors cursor-pointer"
          onClick={handleContinueWithGoogle}
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="text-xs text-center text-gray-400 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  )
}

export default SignupPage
