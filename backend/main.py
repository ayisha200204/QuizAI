cache = {}
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, UploadFile, File, Depends
from database import engine, get_db
from sqlalchemy.orm import Session
from models import Base, Video, Quiz, Question

from models import UserDB
import shutil
import os
from auth import get_current_user

from video_processor import extract_audio
from transcription import transcribe_audio
from quiz_generator import generate_quiz
from auth import router as auth_router
from segmenter import split_transcript, is_valid_segment, score_segment

from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api._errors import TranscriptsDisabled, NoTranscriptFound

import yt_dlp

app = FastAPI()

Base.metadata.create_all(bind=engine)
UPLOAD_DIR = "../uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.include_router(auth_router)

# =========================
# 🔥 UTILS
# =========================

def extract_video_id(url: str):
    if "watch?v=" in url:
        return url.split("v=")[1].split("&")[0]
    elif "youtu.be/" in url:
        return url.split("youtu.be/")[1].split("?")[0]
    return None


# =========================
# 🧠 SEGMENTED QUIZ GENERATOR
# =========================

def generate_quiz_with_segments(transcript, qtype, bloom, num_questions):
    segments = split_transcript(transcript)

    valid_segments = [
        s for s in segments if is_valid_segment(s) and score_segment(s) > 0
    ]

    # sort best first
    valid_segments.sort(key=lambda x: score_segment(x), reverse=True)

    if not valid_segments:
        return generate_quiz(transcript, qtype, bloom, num_questions)

    # 🔥 LIMIT segments (CRITICAL FIX)
    top_k = 3   # only top 5 segments

    selected_segments = valid_segments[:top_k]

    # 🔥 MERGE into ONE CONTEXT
    combined_text = "\n\n".join(selected_segments)

    # 🔥 SINGLE API CALL
    quiz = generate_quiz(combined_text, qtype, bloom, num_questions)

    return quiz


# =========================
# 🎥 YOUTUBE TRANSCRIPT
# =========================

def get_transcript_from_youtube(url):
    video_id = extract_video_id(url)

    if not video_id:
        raise Exception("Invalid YouTube URL")

    # Try transcript API
    try:
        ytt_api = YouTubeTranscriptApi()
        transcript_list = ytt_api.list(video_id)

        transcript = transcript_list.find_transcript(['en', 'hi'])
        data = transcript.fetch()

        full_text = " ".join([t.text for t in data])

        print("✅ Transcript fetched using API")
        return full_text

    except (TranscriptsDisabled, NoTranscriptFound):
        print("⚠️ No captions available, switching to fallback...")

    except Exception as e:
        print("⚠️ Transcript API error:", e)

    # Fallback: yt-dlp + Whisper
    try:
        output_path = f"{UPLOAD_DIR}/{video_id}.%(ext)s"

        ydl_opts = {
            "format": "bestaudio/best",
            "outtmpl": output_path,
            "quiet": True,
            "postprocessors": [{
                "key": "FFmpegExtractAudio",
                "preferredcodec": "wav",
            }],
        }

        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            ydl.download([url])

        audio_path = f"{UPLOAD_DIR}/{video_id}.wav"

        transcript = transcribe_audio(audio_path)

        print("✅ Transcript generated using Whisper fallback")
        return transcript

    except Exception as e:
        raise Exception(f"Both transcript and fallback failed: {str(e)}")


# =========================
# 📁 VIDEO UPLOAD
# =========================

@app.post("/process-video")
async def process_video(
    file: UploadFile = File(...),
    qtype: str = "mcq",
    bloom: str = "understand",
    num_questions: int = 5,
    current_user: UserDB = Depends(get_current_user)
):
    try:
        video_path = f"{UPLOAD_DIR}/{file.filename}"

        with open(video_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        audio = extract_audio(video_path)
        transcript = transcribe_audio(audio)

        quiz = generate_quiz_with_segments(
            transcript, qtype, bloom, num_questions
        )

        return {
            "transcript": transcript,
            "quiz": quiz
        }

    except Exception as e:
        return {
            "error": str(e),
            "quiz": []
        }


# =========================
# 🚀 YOUTUBE PROCESSING
# =========================

@app.post("/process-youtube")
async def process_youtube(
    data: dict,
    qtype: str = "mcq",
    bloom: str = "understand",
    num_questions: int = 5,
    db: Session = Depends(get_db),
    current_user: UserDB = Depends(get_current_user)
):
    try:
        url = data.get("url")

        transcript = get_transcript_from_youtube(url)

        if not transcript or len(transcript) < 50:
            return {"error": "Transcript too short", "quiz": []}

        quiz = generate_quiz_with_segments(
            transcript, qtype, bloom, num_questions
        )
        video_id = extract_video_id(url)

        if video_id in cache:
            print("⚡ Using cached result")
            return cache[video_id]
    
        result = {
            "transcript": transcript,
            "quiz": quiz
        }

        cache[video_id] = result

        return result

    except Exception as e:
        print("❌ ERROR:", e)
        return {
            "error": str(e),
            "quiz": []
        }



# =========================
# 🧠 EVALUATION
# =========================

@app.post("/evaluate")
async def evaluate(data: dict):
    answers = data.get("answers", {})
    quiz = data.get("quiz", [])

    correct = 0
    total = len(quiz)

    for i in range(total):
        user_ans = answers.get(str(i)) or answers.get(i)
        correct_ans = quiz[i]["answer"]

        if user_ans and user_ans.strip().lower() == correct_ans.strip().lower():
            correct += 1

    return {
        "score": correct,
        "total": total,
        "percentage": (correct / total) * 100 if total > 0 else 0
    }


# =========================
# 🌐 CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)