import React from "react";

export default function Navbar({ screen, token, setToken, setScreen, darkMode, setDarkMode }) {

  const handleLogout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setToken(null);
    setScreen("home");
  };

  const scrollToSection = (section) => {
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="flex flex-wrap justify-between items-center px-6 md:px-10 py-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-lg sticky top-0 z-50 transition-all duration-300">

      {/* LOGO */}
      <h1
        onClick={() => setScreen("home")}
        className="text-xl font-bold text-gray-800 dark:text-white cursor-pointer hover:opacity-80 transition"
      >
        🚀 QuizAI
      </h1>

      <div className="flex gap-4 items-center">

        {/* HOME PAGE LINKS */}
        {screen === "home" && (
          <>
            <button
              onClick={() => scrollToSection("features")}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
            >
              Features
            </button>

            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-gray-700 dark:text-gray-300 hover:text-blue-500"
            >
              How it Works
            </button>
          </>
        )}

        {/* LOGGED OUT */}
        {!token && (
          <>
            {screen !== "login" && (
              <button
                onClick={() => setScreen("login")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Login
              </button>
            )}

            {screen !== "signup" && (
              <button
                onClick={() => setScreen("signup")}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg"
              >
                Signup
              </button>
            )}
          </>
        )}

        {/* LOGGED IN */}
        {token && (
          <>
            {screen !== "dashboard" && (
              <button
                onClick={() => setScreen("dashboard")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Dashboard
              </button>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
            >
              Logout
            </button>
          </>
        )}

        {/* DARK MODE */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-3 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
        >
          {darkMode ? "☀" : "🌙"}
        </button>

      </div>
    </nav>
  );
}