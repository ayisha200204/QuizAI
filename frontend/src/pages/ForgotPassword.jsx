import React, { useState } from "react";

export default function ForgotPassword({ setScreen, darkMode, setDarkMode }) {
  const [identifier, setIdentifier] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://127.0.0.1:8000";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const cleanValue = identifier.trim();

    if (!cleanValue || cleanValue.length < 4) {
      return setError("Enter valid email or phone number");
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier: cleanValue }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setMessage("OTP sent successfully");

        localStorage.setItem("resetIdentifier", cleanValue);

        setTimeout(() => {
          setScreen("otp");
        }, 800);
      } else {
        setError(data.detail || data.message || "Something went wrong");
      }
    } catch {
      setError("Server not reachable");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">

        {/* BACKGROUND BLOBS */}
        <div className="absolute w-[400px] h-[400px] bg-purple-400 opacity-20 rounded-full blur-3xl top-10 left-10"></div>
        <div className="absolute w-[400px] h-[400px] bg-blue-400 opacity-20 rounded-full blur-3xl bottom-10 right-10"></div>
        {/* FORM CARD */}
        <div className="flex items-center justify-center px-6 min-h-[calc(100vh-80px)] relative z-10">
          <div className="w-full max-w-md p-8 bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20">

            <h2 className="text-3xl font-bold text-center mb-4 text-gray-800 dark:text-white">
              Forgot Password
            </h2>

            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded mb-3 text-sm text-center">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-100 text-green-600 p-3 rounded mb-3 text-sm text-center">
                {message}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              <input
                type="text"
                placeholder="Email or Phone"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full p-3 rounded-xl border 
                bg-white/70 dark:bg-gray-700 dark:text-white 
                focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl text-white 
                bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 
                shadow-lg transition
                ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>

            </form>

            <p
              onClick={() => setScreen("login")}
              className="text-center mt-4 text-blue-500 cursor-pointer hover:underline"
            >
              Back to Login
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}