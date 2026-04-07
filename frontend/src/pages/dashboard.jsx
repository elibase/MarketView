import "../App.css"
export default function DashboardView(){
    return(
        <div class="main">

        {/* Header */}

        <div class="header">
            <h1>Market View Dashboard</h1>
            <p>Analyze market trends, track stocks, and view sentiment insights.</p>
        </div>


        {/* Quick Actions */}

        <div class="cards">

            <div class="card">
                <h3>Stock Database</h3>
                <p>Browse stocks, view prices, and explore trading volume.</p>
                <a class="btn" href="/stocks">View Stocks</a>
            </div>

            <div class="card">
                <h3>News Feed</h3>
                <p>Read the latest financial news related to tracked companies.</p>
                <a class="btn" href="/news">View News</a>
            </div>

            <div class="card">
                <h3>ML Analyzer</h3>
                <p>Run sentiment analysis on stocks using news and market data.</p>
                <a class="btn" href="/analyzer">Analyze Stocks</a>
            </div>

        </div>


        {/* Market News */}

        <div class="news">

            <h3>Latest Market News</h3>

            <ul>
                <li><a class="news-link" href="#">Tech stocks rally as AI demand increases</a></li>
                <li><a class="news-link" href="#">Federal Reserve signals potential rate cuts</a></li>
                <li><a class="news-link" href="#">Electric vehicle market expected to grow in 2026</a></li>
                <li><a class="news-link" href="#">Major semiconductor companies report strong earnings</a></li>
            </ul>

        </div>

    </div>
    );
}