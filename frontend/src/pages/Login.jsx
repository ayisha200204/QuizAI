import React, { useState, useEffect } from "react";

export default function Login({ setScreen, token, setToken, darkMode, setDarkMode }) {

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = "http://127.0.0.1:8000";

  // ✅ Auto login if token exists
  useEffect(() => {
    if (token && setScreen) {
      setScreen("home");
    }
  }, [token, setScreen]);

  // 🔐 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (identifier.trim().length < 3) {
      return setError("Enter valid email or username");
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: identifier,
          password: password,
        }),
      });

      const data = await res.json();

      if (res.ok && data.access_token) {

        if (remember) {
          localStorage.setItem("token", data.access_token);
        } else {
          sessionStorage.setItem("token", data.access_token);
        }

        setToken(data.access_token);

        setScreen("home");
      } else {
        setError(data.detail || "Invalid credentials");
      }

    } catch {
      setError("Backend not running");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">

        {/* LOGIN FORM */}
        <div className="flex items-center justify-center px-6 min-h-[calc(100vh-80px)] relative z-10">

          <div className="relative w-full max-w-md p-8 rounded-3xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-xl shadow-2xl border border-white/20">

            {loading && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-3xl">
                <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full"></div>
              </div>
            )}

            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
              Welcome Back
            </h2>

            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">

              <input
                type="text"
                placeholder="Email or Username"
                disabled={loading}
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full p-3 rounded-xl border bg-white/70 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  disabled={loading}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-xl border bg-white/70 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-sm text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    onChange={(e) => setRemember(e.target.checked)}
                  />
                  Remember me
                </label>

                <span
                  onClick={() => setScreen("forgot")}
                  className="text-blue-500 cursor-pointer hover:underline"
                >
                  Forgot Password?
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl text-white 
                bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 
                transition shadow-lg
                ${loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}`}
              >
                Login
              </button>

              {/* GOOGLE LOGIN */}
              <button
                type="button"
                onClick={() => (window.location.href = `${API_URL}/auth/google`)}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl 
                bg-white text-gray-700 shadow-md hover:shadow-lg 
                border hover:scale-105 transition-all duration-300"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="google"
                  className="w-5 h-5"
                />
                Continue with Google
              </button>

            </form>

            <p className="text-center text-sm mt-6 text-gray-700 dark:text-gray-300">
              Don't have an account?{" "}
              <span
                onClick={() => setScreen("signup")}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                Signup
              </span>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}