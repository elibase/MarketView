from fastapi import FastAPI
from pydantic import BaseModel
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

app = FastAPI()
analyzer = SentimentIntensityAnalyzer()

class Article(BaseModel):
    headline: str
    summary: str

class RequestData(BaseModel):
    articles: list[Article]

@app.post("/analyze")
def analyze(data: RequestData):
    scores = []

    for article in data.articles:
        text = article.headline + " " + article.summary
        score = analyzer.polarity_scores(text)["compound"]
        scores.append(score)

    avg_score = sum(scores) / len(scores)

    label = "Neutral"
    if avg_score > 0.3:
        label = "Positive"
    elif avg_score < 0.2:
        label = "Negative"

    return {
        "score": round(avg_score, 2),
        "label": label,
        "summary": f"Overall sentiment is {label.lower()} based on recent news."
    }