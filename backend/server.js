require("dotenv").config()
const express = require('express')
const cors = require('cors')
const { getGeneralNews, getCompanyNews } = require('./services/newsService')
const { keywords, addKeyword, removeKeyword } = require('./services/scraperService')
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

// NEWS API CALLS START
app.post('/api/addKeyword', async (req, res) => {
    const keywordToAdd = req.body.message;
    const keywordWasAdded = await addKeyword(keywordToAdd, keywords);
    res.json({ successful: keywordWasAdded });
});

app.post('/api/removeKeyword', async (req, res) => {
    const keywordToRemove = req.body.message;
    const keywordWasRemoved = await removeKeyword(keywordToRemove, keywords);
    res.json({ successful: keywordWasRemoved });
});

app.post('/api/retrieveKeywords', async (req, res) => {
    res.json({ message: keywords });
});
// NEWS API CALLS END

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