require("dotenv").config()
const express = require('express')
const cors = require('cors')
const newsRoutes = require('./routes/newsRoutes.js');
const stockInfoRoutes = require('./routes/stockInfoRoutes.js');
const app = express()
const port = 3000


app.use(express.json());

app.use(cors({
    origin: 'http://localhost:5173'
}));

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/api/message', (req, res) => {
    res.json({ message: "Hello from the Node server!" });
});

// News API calls
app.use('/api/news', newsRoutes);
/*
app.use('/api/news/addKeyword', newsRoutes);
app.use('/api/news/removeKeyword', newsRoutes);
app.use('/api/news/retrieveKeywords', newsRoutes);
app.use('/api/news/getArticles', newsRoutes);
*/

/*
app.post('/api/news/addKeyword', newsRoutes);
app.post('/api/news/removeKeyword', newsRoutes);
app.post('/api/news/retrieveKeywords', newsRoutes);
app.post('/api/news/getArticles', newsRoutes);
*/

// Stock API calls
app.use('/api/stocks', stockInfoRoutes);

app.get('/test-news', async (req, res) => {
    try {
        // 1. Grab the ticker from the URL: http://localhost:3000/test-news?ticker=AAPL
        const ticker = req.query.ticker;

        if (!ticker) {
            return res.status(400).send("Please provide a ticker. Example: /test-news?ticker=TSLA");
        }

        // 2. Call your service function
        const data = await getNews(ticker.toUpperCase());

        // 3. Return the results to your browser/Postman
        res.json({
            status: "Success",
            symbol: ticker.toUpperCase(),
            count: data.length,
            articles: data
        });

    } catch (error) {
        console.error("Test Route Error:", error);
        res.status(500).json({
            error: "Failed to fetch news",
            message: error.message
        });
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})