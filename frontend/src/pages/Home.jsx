import React, { useEffect } from "react";

export default function Home({ setScreen, token, setToken, darkMode, setDarkMode }) {
  const API_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

  // 🔐 VERIFY TOKEN
  useEffect(() => {
    if (!token) return;

    const verifyToken = async () => {
      try {
        const res = await fetch(`${API_URL}/verify`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error();
      } catch {
        localStorage.removeItem("token");
        setToken(null);
      }
    };

    verifyToken();
  }, [token, API_URL, setToken]);

  // 🔄 Sync token when login/logout happens
  useEffect(() => {
    const syncToken = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", syncToken);

    return () => {
      window.removeEventListener("storage", syncToken);
    };
  }, [setToken]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-900 dark:to-gray-800">

      {/* HERO */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-32 relative overflow-hidden min-h-[70vh]">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 opacity-50"></div>

        <div className="relative z-10 max-w-4xl">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-800 dark:text-white mb-8 leading-tight">
            Turn Videos into{" "}
            <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Smart Quizzes
            </span>
          </h1>

          <p className="text-gray-600 dark:text-gray-300 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Upload any video and instantly generate AI-powered quizzes with
            Bloom’s taxonomy. Learn smarter, not harder.
          </p>

          <button
            onClick={() => setScreen("setup")}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-5 rounded-xl text-xl shadow-xl transition-all hover:scale-105 hover:shadow-2xl animate-bounce"
          >
            🚀 Get Started
          </button>
        </div>
      </div>

      {/* FEATURES */}
      <div id="features" className="px-6 max-w-6xl mx-auto mt-10">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-10">
          Powerful Features
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Bloom Levels", desc: "Learn deeply with structured thinking", icon: "🧠" },
            { title: "AI Questions", desc: "Generated instantly from videos", icon: "🤖" },
            { title: "Exam Mode", desc: "Simulate real test experience", icon: "📝" },
            { title: "Learning Mode", desc: "Get explanations instantly", icon: "💡" },
            { title: "Multiple Types", desc: "MCQ, Fill, True/False", icon: "🔄" },
            { title: "Instant Results", desc: "Track your performance quickly", icon: "📊" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition-all hover:shadow-xl"
            >
              <div className="text-3xl mb-3">{item.icon}</div>

              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">
                {item.title}
              </h3>

              <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* QUESTION TYPES */}
      <div className="mt-16 text-center px-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">
          Question Types
        </h2>

        <div className="flex flex-wrap justify-center gap-4">
          {["MCQ", "True/False", "Fill in Blanks", "Mixed"].map((type, i) => (
            <span
              key={type}
              className="px-7 py-3 text-lg bg-gradient-to-r from-blue-100 to-purple-100 dark:from-gray-700 dark:to-gray-600 dark:text-white rounded-full shadow-md hover:scale-105 transition-all"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how-it-works" className="mt-20 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-10">
          How It Works
        </h2>

        <div className="grid md:grid-cols-3 gap-6 text-center">
          {[
            { step: "Upload a Video", icon: "📤" },
            { step: "AI Generates Quiz", icon: "⚡" },
            { step: "Start Learning Instantly", icon: "🚀" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition-all hover:shadow-xl"
            >
              <div className="text-4xl mb-4">{item.icon}</div>

              <p className="font-semibold text-gray-800 dark:text-white">
                {item.step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <div className="mt-20 text-center text-gray-500 dark:text-gray-400 py-6 bg-gray-50 dark:bg-gray-800">
        <p>© 2026 QuizAI</p>
      </div>
    </div>
  );
}