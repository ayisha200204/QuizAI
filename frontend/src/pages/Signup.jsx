import React, { useState } from "react";

export default function Signup({ setScreen, token, setToken, darkMode, setDarkMode }) {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.includes("@")) return setError("Enter valid email");
    if (phone.length < 10) return setError("Enter valid phone number");
    if (password.length < 6) return setError("Password must be at least 6 characters");
    if (password !== confirmPassword) return setError("Passwords do not match");

    
setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password, name: name, description: description, phone: phone }),
      });

      const data = await res.json();

      if (data.message) {
        setSuccess(true);

        setTimeout(() => {
          setScreen("login");
        }, 2000);
      } else {
        setError("Signup failed");
      }
    } catch {
      setError("Server error");
    }

    setLoading(false);
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">

        {/* FORM */}
        <div className="flex items-center justify-center px-6 min-h-[calc(100vh-80px)] relative z-10">
          <div className="relative w-full max-w-md p-8 rounded-3xl 
            bg-white/30 dark:bg-gray-800/30 
            backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.2)] 
            border border-white/20 transition-all duration-300 hover:shadow-[0_10px_50px_rgba(0,0,0,0.3)]">

            {/* LOADING */}
            {loading && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-3xl">
                <div className="animate-spin h-10 w-10 border-4 border-white border-t-transparent rounded-full"></div>
              </div>
            )}

            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white tracking-wide">
              Create Account
            </h2>

            {error && (
              <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm text-center animate-pulse">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 text-green-600 dark:bg-green-200 p-3 rounded mb-4 text-sm">
                Signup successful! Redirecting...
              </div>
            )}


            <form onSubmit={handleSignup} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full p-3 rounded-xl border bg-white/70 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                onChange={(e) => setName(e.target.value)}
                /*required*/
              />
              {/* EMAIL */}
              <input
                type="email"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl border bg-white/70 dark:bg-gray-700 dark:text-white 
                focus:ring-2 focus:ring-purple-500 outline-none 
                transition-all duration-200 focus:scale-[1.02]"
              />

              {/* PHONE */}
              <input
                type="tel"
                placeholder="Phone Number"
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-3 rounded-xl border bg-white/70 dark:bg-gray-700 dark:text-white 
                focus:ring-2 focus:ring-purple-500 outline-none 
                transition-all duration-200 focus:scale-[1.02]"
              />

              {/* PASSWORD */}
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 rounded-xl border bg-white/70 dark:bg-gray-700 dark:text-white 
                focus:ring-2 focus:ring-purple-500 outline-none transition focus:scale-[1.02]"
              />

              {/* CONFIRM PASSWORD */}
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 rounded-xl border bg-white/70 dark:bg-gray-700 dark:text-white 
                focus:ring-2 focus:ring-purple-500 outline-none transition focus:scale-[1.02]"
              />
              <input
                type="text"
                placeholder="Share a short paragraph about yourself..."
                className="w-full p-3 rounded-xl border bg-white/70 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                onChange={(e) => setDescription(e.target.value)}
                /*required*/
              />

              {/* SHOW PASSWORD */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-sm text-gray-500 hover:text-purple-600 transition"
              >
                {showPassword ? "Hide Password" : "Show Password"}
              </button>
              
              {/* SIGNUP BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-white 
                bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 
                shadow-lg hover:scale-105 transition-all duration-300"
              >
                Signup
              </button>

              {/* GOOGLE BUTTON */}
              <button
                type="button"
                onClick={() => window.location.href = `${API_URL}/auth/google`}
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
              Already have an account?{" "}
              <span
                onClick={() => setScreen("login")}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                Login
              </span>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}