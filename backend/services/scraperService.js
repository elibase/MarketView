require('dotenv').config();
const keywords = ["Amazon", "AMZN", "Google", "GOOG", "Tesla", "TSLA"] // Hardcoded

async function getNews(ticker) {

    const url = `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${fromDate}&to=${toDate}&token=${API_KEY}`
    console.log(`fetching news from ${fromDate} to ${toDate}`)
    const response = await axios.get(url);

    return response.data.map(article => ({
        headline: article.headline,
        summary: article.summary,
    }));
}

async function addKeyword(keyword, keywordArray) {

    const url = `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${fromDate}&to=${toDate}&token=${API_KEY}`
    console.log(`fetching news from ${fromDate} to ${toDate}`)
    const response = await axios.get(url);

    return response.data.map(article => ({
        headline: article.headline,
        summary: article.summary,
    }));
}

app.post('/api/addKeyword', (req, res) => {
    const newKeyword = req.body;
    //res.json({successful: newKeyword})

    const keywordIsNew = !(keywords.includes(newKeyword.message));
    if (keywordIsNew) {
        keywords.push(newKeyword.message)
        res.json({ successful: "true" });
    } else {
        res.json({ successful: "false" });
    }
});

app.post('/api/removeKeyword', (req, res) => {
    const keywordToRemove = req.body.message;
    const index = keywords.indexOf(keywordToRemove);

    if (index > -1) {
        keywords.splice(index, 1);
        res.json({ successful: "true" });
    } else {
        res.json({ successful: "false" });
    }
});

app.post('/api/retrieveKeywords', (req, res) => {
    res.json({ message: keywords });
});

module.exports = { keywords };