import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Setup from "./pages/Setup";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App() {
  const [screen, setScreen] = useState("home");

 // const [file, setFile] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [token, setToken] = useState(
    localStorage.getItem("token") || sessionStorage.getItem("token")
  );

  const [quizType, setQuizType] = useState("mcq");
  const [bloomLevel, setBloomLevel] = useState("understand");
  const [mode, setMode] = useState("quiz");

  useEffect(() => {
    const storedToken = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (storedToken !== token) {
      setToken(storedToken);
    }
  }, [screen, token]);

  useEffect(() => {
    if ((screen === "dashboard" || screen === "setup") && !token) {
      setScreen("login");
    }
  }, [screen, token]);

  return (
    <div className={darkMode ? "dark" : ""}>
      {/* 🌍 Global Background */}
      <div className="min-h-screen transition-all duration-300 bg-gradient-to-br from-blue-100 to-purple-200 dark:from-gray-900 dark:to-gray-800">

        <Navbar
          screen={screen}
          token={token}
          setToken={setToken}
          setScreen={setScreen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />

        <div key={screen} className="page-transition min-h-screen transition-all duration-500 ease-out">
          {screen === "home" && (
            <Home
              setScreen={setScreen}
              screen={screen}
              token={token}
              setToken={setToken}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          )}

          {screen === "login" && (
            <Login
              setScreen={setScreen}
              token={token}
              screen={screen}
              setToken={setToken}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          )}

          {screen === "signup" && (
            <Signup
              setScreen={setScreen}
              token={token}
              screen={screen}
              setToken={setToken}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          )}

          {screen === "dashboard" && (
            <Dashboard
              setScreen={setScreen}
              token={token}
              screen={screen}
              setToken={setToken}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          )}

          {screen === "setup" && (
            <Setup
              setScreen={setScreen}
              quizType={quizType}
              setQuizType={setQuizType}
              bloomLevel={bloomLevel}
              screen={screen}
              setBloomLevel={setBloomLevel}
              mode={mode}
              setMode={setMode}
              setQuiz={setQuiz}
              setQuizId={setQuizId}
              token={token}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          )}

          {screen === "quiz" && (
            <Quiz
              quiz={quiz}
              screen={screen}
              quizId={quizId}
              answers={answers}
              setAnswers={setAnswers}
              setResult={setResult}
              setScreen={setScreen}
              mode={mode}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          )}

          {screen === "result" && (
            <Result
              result={result}
              quiz={quiz}
              screen={screen}
              answers={answers}
              setScreen={setScreen}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;