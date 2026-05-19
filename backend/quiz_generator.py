import google.genai as genai
import json
import re
import os
from dotenv import load_dotenv
import time

load_dotenv()  # Load environment variables from .env file
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


def normalize_qtype(qtype):
    q = (qtype or "mcq").strip().lower()
    if "mcq" in q:
        return "mcq"
    if "true" in q:
        return "truefalse"
    if "fill" in q:
        return "fill"
    if "mixed" in q:
        return "mixed"
    return "mcq"


def build_type_rules(qtype):
    if qtype == "mcq":
        return """
- Each question must have exactly 4 unique options.
- Only one correct answer.
- The type field must be "mcq".
- The answer must match one of the options exactly.
"""
    if qtype == "truefalse":
        return """
- Each question must have options ["True", "False"].
- The answer must be either "True" or "False".
- The type field must be "truefalse".
"""
    if qtype == "fill":
        return """
- Do not include an options field.
- The question must contain a blank such as "_____".
- The answer must be a short word or phrase from the text.
- The type field must be "fill".
"""
    return """
- Include a mix of mcq, truefalse, and fill questions.
- Follow the correct format for each type.
- Include options only for mcq and truefalse questions.
"""


def is_valid_quiz(quiz, qtype, num):
    if not isinstance(quiz, list) or len(quiz) != num:
        return False

    for item in quiz:
        if not isinstance(item, dict):
            return False

        question = item.get("question")
        answer = item.get("answer")
        item_type = normalize_qtype(item.get("type", qtype))

        if not question or answer is None or not item_type:
            return False

        if qtype != "mixed" and item_type != qtype:
            return False

        if item_type == "mcq":
            options = item.get("options")
            if not isinstance(options, list) or len(options) != 4:
                return False
            if answer not in options:
                return False

        if item_type == "truefalse":
            options = item.get("options")
            if options != ["True", "False"]:
                return False
            if str(answer).strip().title() not in ["True", "False"]:
                return False

        if item_type == "fill":
            if "options" in item:
                return False
            if not str(answer).strip():
                return False

    return True


def generate_quiz(transcript, qtype="mcq", bloom="understand", num=5):
    qtype = normalize_qtype(qtype)
    transcript = transcript[:10000]

    type_rules = build_type_rules(qtype)
    prompt = f"""
You are an expert educator and quiz designer. Your task is to generate high-quality quiz questions based ONLY on the provided text segment.

CONTEXT:
This text is a segment from a larger transcript (video or document).

OBJECTIVES:
1. Generate EXACTLY {num} questions.
2. Question type: {qtype}
3. Bloom's Level: {bloom}
4. Focus on core educational concepts, definitions, and explanations.
5. Avoid questions about the video's presentation style.
6. Ensure questions are diverse and not redundant.

RULES:
{type_rules}

STRICT JSON FORMAT:
Return ONLY a JSON array of objects. NO markdown formatting, NO extra text.
[
  {{
    "question": "Clear, concise question?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Correct answer string",
    "type": "mcq / truefalse / fill",
    "level": "{bloom}",
    "explanation": "Briefly explain why the answer is correct based on the text."
  }}
]

IMPORTANT:
- Include "options" ONLY for mcq and truefalse.
- Do NOT include options for fill questions.

TEXT SEGMENT:
{transcript}
"""

    for attempt in range(3):
        try:
            print("🔥 Calling Gemini ONCE")

            response = client.models.generate_content(
                model="gemini-flash-lite-latest",
                contents=prompt
            )

            content = response.text.strip()
            content = re.sub(r"```json|```", "", content).strip()
            quiz = json.loads(content)

            if is_valid_quiz(quiz, qtype, num):
                return quiz

            print("⚠️ Invalid quiz format received, retrying...")

        except Exception as e:
            if "429" in str(e):
                print("❌ Quota exceeded")
                return [
                    {
                        "question": "Quota exceeded. Try again later.",
                        "answer": "",
                        "type": "info",
                        "level": bloom,
                        "explanation": "API quota limit reached."
                    }
                ]

            print("Retrying due to:", e)
            if "503" in str(e):
                print("⚠️ Model overloaded, retrying...")
                time.sleep(2 ** attempt)
            else:
                time.sleep(2)

    return [
        {
            "question": "What is the main idea of the video?",
            "options": ["Concept", "Story", "Experiment", "Data"],
            "answer": "Concept",
            "type": "mcq",
            "level": bloom,
            "explanation": "This is a fallback question."
        },
        {
            "question": "Is the topic explained clearly?",
            "options": ["True", "False"],
            "answer": "True",
            "type": "truefalse",
            "level": bloom,
            "explanation": "Fallback explanation."
        },
        {
            "question": "Fill in the blank: The video discusses ______.",
            "answer": "concept",
            "type": "fill",
            "level": bloom,
            "explanation": "Fallback fill question."
        },
        {
            "question": "Which option best describes the content?",
            "options": ["Theory", "Application", "History", "Math"],
            "answer": "Theory",
            "type": "mcq",
            "level": bloom,
            "explanation": "Fallback."
        },
        {
            "question": "Is this topic practical?",
            "options": ["True", "False"],
            "answer": "True",
            "type": "truefalse",
            "level": bloom,
            "explanation": "Fallback."
        }
    ]
