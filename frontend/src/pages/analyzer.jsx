import { useState } from "react";
import "../assets/analyzer.css";

export default function AnalyzerView() {
    const [ticker, setTicker] = useState("");
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const handleAnalyze = async () => {
        setError("");
        setResult(null);

        try {
            const res = await fetch("http://localhost:3000/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticker })
            });

            if (!res.ok) {
                throw new Error("Server error");
            }

            const data = await res.json();

            // Handle no articles (e.g., XEQT without .TO)
            if (!data.articles || data.articles.length === 0) {
                setError(
                    `No news found for "${ticker}". Try "${ticker.toUpperCase()}.TO" for Canadian stocks.`
                );
                return;
            }

            setResult(data);

        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="container">
            <div className="main">

                {/* Header */}
                <div className="header">
                    <h1>Stock Analyzer</h1>
                </div>

                {/* Search */}
                <div className="search">
                    <input
                        type="text"
                        placeholder="Enter stock ticker (ex: TSLA)"
                        value={ticker}
                        onChange={(e) => setTicker(e.target.value)}
                    />
                    <button className="btn analyze-btn" onClick={handleAnalyze}>
                        Analyze
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="card" style={{ backgroundColor: "#ffe6e6", color: "#900" }}>
                        <p>{error}</p>
                    </div>
                )}

                {/* Results */}
                {result && (
                    <>
                        <div className="analysis-container">

                            {/* Sentiment */}
                            <div className="card sentiment">
                                <div className="section-title">News Sentiment</div>

                                <p><strong>Ticker:</strong> {result?.ticker}</p>
                                <p><strong>Sentiment Score:</strong> {result?.sentiment?.score}</p>
                                <p>
                                    <strong>Sentiment Label:</strong>{" "}
                                    <span
                                        style={{
                                            color:
                                                result?.sentiment?.label === "Positive"
                                                    ? "green"
                                                    : result?.sentiment?.label === "Negative"
                                                        ? "red"
                                                        : "black"
                                        }}
                                    >
                                        {result?.sentiment?.label}
                                    </span>
                                </p>
                            </div>

                            {/* Report */}
                            <div className="card report">
                                <div className="section-title">Report</div>
                                <p>{result?.sentiment?.summary}</p>
                            </div>

                        </div>

                        {/* Articles */}
                        <div className="card articles">
                            <div className="section-title">Recent News Articles</div>

                            <ul>
                                {result?.articles?.slice(0, 5).map((a, i) => (
                                    <li key={i}>
                                        {a.url ? (
                                            <a
                                                className="news-link"
                                                href={a.url}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                {a.headline}
                                            </a>
                                        ) : (
                                            a.headline
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
}

