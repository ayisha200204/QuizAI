import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard({ setScreen, darkMode }) {

  const user = {
    name: "Ayisha",
    email: "ayisha@email.com",
  };

  // Recent quizzes
  const recentQuizzes = [
    { title: "Computer Science Basics", score: 4, total: 5, date: "Today" },
    { title: "Networking Intro", score: 3, total: 5, date: "Yesterday" },
  ];

  // Progress chart data
  const progressData = [
    { quiz: "Quiz 1", score: 60 },
    { quiz: "Quiz 2", score: 70 },
    { quiz: "Quiz 3", score: 80 },
    { quiz: "Quiz 4", score: 78 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-900 dark:to-gray-800">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          📊 Dashboard
        </h1>

        <button
          onClick={() => setScreen("home")}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg"
        >
          🏠 Home
        </button>
      </div>

      {/* PROFILE */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-6 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            👋 Welcome, {user.name}
          </h2>
          <p className="text-gray-500 dark:text-gray-300">{user.email}</p>
        </div>

        <button
          onClick={() => setScreen("setup")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg"
        >
          🚀 New Quiz
        </button>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-6">

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow text-center">
          <h3 className="text-gray-500">Quizzes Taken</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">12</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow text-center">
          <h3 className="text-gray-500">Avg Score</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">78%</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow text-center">
          <h3 className="text-gray-500">Accuracy</h3>
          <p className="text-2xl font-bold text-purple-600 mt-2">82%</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow text-center">
          <h3 className="text-gray-500">Study Streak</h3>
          <p className="text-2xl font-bold text-orange-500 mt-2">🔥 5 Days</p>
        </div>

      </div>

      {/* PROGRESS GRAPH */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          📈 Quiz Progress
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={progressData}>
            <XAxis dataKey="quiz" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* RECENT QUIZZES */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">
          📚 Recent Quizzes
        </h2>

        {recentQuizzes.map((quiz, i) => (
          <div
            key={i}
            className="flex justify-between items-center border-b py-3 last:border-none"
          >
            <div>
              <p className="text-gray-700 dark:text-gray-300">{quiz.title}</p>
              <p className="text-sm text-gray-400">{quiz.date}</p>
            </div>

            <span className="font-semibold text-blue-600">
              {quiz.score}/{quiz.total}
            </span>
          </div>
        ))}
      </div>

    </div>
  );
}