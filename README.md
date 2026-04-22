# 🎓 QuizAI: AI-Powered Video to Quiz Generator

QuizAI is a powerful tool that transforms learning content from videos (uploads or YouTube links) into interactive quizzes. Using state-of-the-art AI, it transcribes audio, segments core educational content, and generates high-quality questions based on Bloom's Taxonomy.

![QuizAI Dashboard Placeholder](https://via.placeholder.com/1200x600/1a1a2e/ffffff?text=QuizAI+Interactive+Dashboard)

## ✨ Features

- **🚀 Dual Input Support**: Process local video files or simply paste a YouTube URL.
- **🧠 Smart AI Generation**: Powered by **Google Gemini** for context-aware quiz generation.
- **🎙️ Whisper Transcription**: High-accuracy audio-to-text conversion using **OpenAI Whisper**.
- **📍 Smart Segmentation**: Automatically filters out "noise" (intros, outros) to focus on core educational content.
- **📉 Bloom's Taxonomy Selection**: Generate questions targeting different cognitive levels (Remember, Understand, Apply, etc.).
- **🔐 Secure Auth**: Built-in user authentication with JWT.
- **📊 Performance Dashboard**: Track your quiz history and performance over time.

## 🛠️ Tech Stack

| Component | Technologies |
| :--- | :--- |
| **Frontend** | React, Tailwind CSS, Framer Motion, Axios, Recharts |
| **Backend** | FastAPI (Python), SQLAlchemy (SQLite) |
| **AI/ML** | Google Generative AI (Gemini), OpenAI Whisper |
| **Processing** | MoviePy, yt-dlp, FFmpeg |

---

## 🚀 Getting Started

### Prerequisites

- **Python**: 3.10 or higher
- **Node.js**: 18.x or higher
- **FFmpeg**: Required for audio/video processing. [Download FFmpeg](https://ffmpeg.org/download.html).

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment and activate it:
    ```bash
    python -m venv venv
    # Windows:
    .\venv\Scripts\activate
    # macOS/Linux:
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Create a `.env` file in the `backend/` folder:
    ```env
    GEMINI_API_KEY=your_google_gemini_key
    SECRET_KEY=your_jwt_secret_key
    ```
5.  Start the FastAPI server:
    ```bash
    uvicorn main:app --reload
    ```

### 2. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm start
    ```

---

## 📖 Usage Guide

1.  **Login/Sign Up**: Create an account to save your progress.
2.  **Input Video**: 
    - Click **Upload** for a local .mp4/.mkv file.
    - Or **Paste YouTube Link** and click process.
3.  **Configure Quiz**: Select the number of questions, question type (MCQ/True-False), and Bloom's level.
4.  **Take Quiz**: Answer the generated questions and get instant feedback.
5.  **Analytics**: View your scores on the dashboard.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

This project is licensed under the MIT License.