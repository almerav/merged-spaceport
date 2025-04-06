"use client";

import { useState, useEffect, useRef } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>(""); // instead of <string | object>
  const [loading, setLoading] = useState(false);

  const { data: session } = useSession();
  const logoutTimer = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const INACTIVITY_TIMEOUT = 30 * 1000; 

  useEffect(() => {
    if (session) {
      resetTimer();
      document.addEventListener("mousemove", resetTimer);
      document.addEventListener("keydown", resetTimer);
      document.addEventListener("click", resetTimer);
    }

    return () => {
      if (logoutTimer.current) clearTimeout(logoutTimer.current);
      document.removeEventListener("mousemove", resetTimer);
      document.removeEventListener("keydown", resetTimer);
      document.removeEventListener("click", resetTimer);
    };
  }, [session]);

  const resetTimer = () => {
    if (logoutTimer.current) clearTimeout(logoutTimer.current);
    logoutTimer.current = setTimeout(() => {
      signOut();
      alert("Session expired due to inactivity.");
    }, INACTIVITY_TIMEOUT);
  };

  useEffect(() => {
    if (searchParams.get("error") === "CredentialsSignin") {
      setError("Invalid email or password. Please try again.");
    }
  }, [searchParams]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const response = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setError(data.message || 'Invalid login');
        return;
      }
  
      // ✅ Store JWT token
      localStorage.setItem('token', data.accessToken);
  
      // ✅ Redirect to dashboard
      router.push('/overview');
  
    } catch (err) {
      setError("Something went wrong. Please try again later.");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex min-h-screen">
      
      {/* Left Section - Blue Background */}
      <div className="w-1/3 bg-blue-500 text-white flex flex-col justify-center pl-12 pr-8 py-8">
        <h1 className="text-4xl font-bold mb-6">Welcome Back</h1>
        <p className="text-lg leading-relaxed mb-10">
          Sign in to continue managing your campaigns efficiently and securely.
        </p>
      </div>

      {/* Right Section - Form */}
      <div className="w-2/3 bg-gray-50 flex flex-col items-center justify-center px-8 py-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Sign In</h2>

        {error && (
          <div className="flex items-center gap-2 bg-red-700/20 border border-red-500 text-red-400 text-sm p-3 rounded-lg mb-3">
            <svg
              className="w-5 h-5 text-red-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9z"
              />
            </svg>
            <p>{typeof error === "string" ? error : error?.message || "Something went wrong"}</p>
          </div>
)}


        <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-xs">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="text-right text-sm">
            <a href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot Password?
            </a>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-center items-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-5 h-5 mr-2" />
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 text-sm text-gray-900">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
}
