import { useState } from "react";
import "../assets/analyzer.css";

export default function AnalyzerView() {
    const [ticker, setTicker] = useState("");
    const [data, setData] = useState(null);

    const handleAnalyze = async () => {
        try {
            const response = await fetch("http://localhost:3000/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ticker })
            });

            const result = await response.json();
            setData(result);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container">
            <div className="main">

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

                {data && (
                    <>
                        {/* Sentiment */}
                        <div className="analysis-container">
                            <div className="card sentiment">
                                <div className="section-title">News Sentiment</div>

                                <p><strong>Ticker:</strong> {data.ticker}</p>
                                <p><strong>Sentiment Score:</strong> {data.sentiment.score}</p>
                                <p><strong>Sentiment Label:</strong> {data.sentiment.label}</p>
                            </div>

                            {/* Report */}
                            <div className="card report">
                                <div className="section-title">Report</div>
                                <p>{data.sentiment.summary}</p>
                            </div>
                        </div>

                        {/* Articles */}
                        <div className="card articles">
                            <div className="section-title">Recent News Articles</div>

                            <ul>
                                {data.articles.slice(0, 5).map((article, index) => (
                                    <li key={index}>
                                        {article.headline}
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