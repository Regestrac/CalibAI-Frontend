import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { LoaderCircle } from "lucide-react";
import GoogleIcon from "../assets/icons/GoogleIcon";
import { auth, googleProvider } from "../utils/firebase";
import api from "../utils/axios";
import { useAppDispatch } from "../hooks/redux-hooks";
import { setUserData } from "../redux/userSlice";

const SignupPage = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (token: string) => {
    const { data } = await api.post("/api/auth/login", { token });
    dispatch(
      setUserData({
        userData: {
          avatarUrl: data?.user?.avatarUrl,
          email: data?.user?.email,
          name: data?.user?.name,
          userId: data?.user?._id,
          credits: data?.user?.credits,
          plan: data?.user?.plan,
          totalCredits: data?.user?.totalCredits,
          planExpiresAt: data?.user?.planExpiresAt,
        },
      })
    );
  };

  const handleContinueWithGoogle = async () => {
    setError(null);
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const token = await result.user.getIdToken(true);
      await handleLogin(token);
    } catch (err) {
      console.error("Login error:", err);

      const error = err as {
        code?: string;
        response?: { data?: { message?: string }; status?: number };
        message?: string;
      };

      if (error.code === "auth/popup-closed-by-user") {
        setError("Sign-in popup was closed. Please try again.");
      } else if (error.code === "auth/popup-blocked") {
        setError("Popup was blocked by your browser. Please allow popups and try again.");
      } else if (error.code === "auth/cancelled-popup-request") {
        setError("Sign-in was cancelled. Please try again.");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 401) {
        setError("Authentication failed. Please try signing in again.");
      } else if ((error.response?.status ?? 0) >= 500) {
        setError("Server error. Please try again later.");
      } else if (error.message?.includes("network") || error.message?.includes("Network")) {
        setError("Network error. Please check your connection and try again.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center">
      <div className="bg-bg-card rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-2">Create an account</h1>
        <p className="text-text-muted text-center mb-8">Sign up to get started</p>

        {error && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        <button
          type="button"
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 border border-primary/30 rounded-lg py-3 px-4 hover:bg-overlay transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={handleContinueWithGoogle}
        >
          {loading ? (
            <LoaderCircle size={20} className="animate-spin" />
          ) : (
            <>
              <GoogleIcon />
              Continue with Google
            </>
          )}
        </button>

        <p className="text-xs text-center text-text-secondary mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
