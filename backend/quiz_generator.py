import google.genai as genai
import json
import re
import os
from dotenv import load_dotenv
import time
load_dotenv()  # Load environment variables from .env file

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_quiz(transcript, qtype="mcq", bloom="understand", num=5):
    transcript = transcript[:10000]

    prompt = f"""
You are an expert educator and quiz designer. Your task is to generate high-quality quiz questions based ONLY on the provided text segment.

CONTEXT:
This text is a segment from a larger transcript (video or document). 

OBJECTIVES:
1. Generate EXACTLY {num} questions.
2. Type: {qtype}
3. Bloom's Level: {bloom}
4. Focus on core educational concepts, definitions, and "how/why" explanations.
5. Avoid questions about the video's presentation style (e.g., "What did the speaker say first?").
6. Ensure questions are diverse and not redundant.

BLOOM'S LEVEL GUIDE (Target Level: {bloom}):
- Remember: Recall facts, dates, definitions.
- Understand: Explain ideas or concepts.
- Apply: Use information in new situations.
- Analyze: Draw connections among ideas, compare/contrast.
- Evaluate: Justify a stand or decision.
- Create: Produce new or original work.

STRICT JSON FORMAT:
Return ONLY a JSON array of objects. NO markdown formatting, NO extra text.
[
  {{
    "question": "Clear, concise question?",
    "options": ["Option A", "Option B", "Option C", "Option D"], // ONLY for mcq or mixed
    "answer": "Correct answer string",
    "type": "mcq / truefalse / fill",
    "level": "{bloom}",
    "explanation": "Briefly explain why the answer is correct based on the text."
  }}
]

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

            if isinstance(quiz, list) and len(quiz) > 0:
                return quiz

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