from fastapi import FastAPI
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

app = FastAPI()

analyzer = SentimentIntensityAnalyzer()

@app.post("/analyze")
def analyze(data: dict):

    articles = data["articles"]

    scores = []

    for article in articles:

        text = (article["title"] or "") + " " + (article["description"] or "")

        result = analyzer.polarity_scores(text)

        scores.append(result["compound"])

    avg = sum(scores) / len(scores)

    return {
        "average_sentiment": avg,
        "article_scores": scores
    }