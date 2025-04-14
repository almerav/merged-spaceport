"use client";
import { useState } from "react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error

    console.log("📩 Email submitted:", email);
    setLoading(true);

    try {
      // 🔥 Send the actual request to your backend API
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      console.log("🛠️ Server Response:", data);

      if (res.ok) {
        setSuccess(" Link sent to your email!");
        console.log(` Email sent to ${email}`);
      } else {
        setError(data.error || "Failed to send reset link.");
        console.error(` Error: ${data.error}`);
      }
    } catch (err) {
      console.error("🚫 Something went wrong:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = () => {
    setEmail(""); // Clear the email field
    setSuccess(null); // Reset success message
    setError(null); // Reset error message
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-6">Forgot Password</h2>

      {/* Feedback messages */}
      {success && (
        <div className="text-green-500 mb-4">
          {success}
          <button
            onClick={handleResend}
            className="ml-2 text-blue-400 hover:underline"
          >
            Resend Email
          </button>
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 bg-red-700/20 border border-red-500 text-red-400 text-sm p-3 rounded-lg mb-4">
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
          <p>{error}</p>
        </div>
      )}

      {/* Form */}
      {success === null && (
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-80">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-700 p-3 rounded bg-gray-800 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition flex items-center justify-center disabled:opacity-50"
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </form>
      )}

      <div className="mt-5 text-sm">
        <a href="/login" className="text-blue-400 hover:underline">
          Back to Login
        </a>
      </div>
    </div>
  );
};

export default ForgotPassword;
