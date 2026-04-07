require("dotenv").config()
const express = require('express')
const cors = require('cors')
const { getNews } = require('./services/newsService')
const { keywords } = require('./services/scraperService')
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

// SCRAPER API CALLS START
app.post('/api/addKeyword', (req, res) => {

});

app.post('/api/removeKeyword', (req, res) => {

});

app.post('/api/retrieveKeywords', (req, res) => {
    
});
// SCRAPER API CALLS END

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