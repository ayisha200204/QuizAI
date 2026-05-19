from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import UserDB, Attempt
from auth import get_current_user   # function that decodes JWT

router = APIRouter()

@router.get("/dashboard")
def get_dashboard(
    current_user: UserDB = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    # get attempts for this user only
    attempts = db.query(Attempt).filter(Attempt.user_id == current_user.id).all()

    quizzes_taken = len(attempts)

    avg_score = 0
    if quizzes_taken > 0:
        avg_score = sum([a.score for a in attempts]) / quizzes_taken

    return {
        "user": {
            "name": current_user.name,
            "email": current_user.email
        },
        "stats": {
            "quizzes_taken": quizzes_taken,
            "avg_score": round(avg_score, 2)
        },
        "recent_quizzes": []
    }