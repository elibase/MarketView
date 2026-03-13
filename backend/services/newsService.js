require('dotenv').config();
const axios = require("axios");

const API_KEY = process.env.NEWS_API_KEY;
// 1. Get Today's date (The "To" date)
const today = new Date();
const toDate = today.toISOString().split('T')[0];

// 2. Calculate 30 days ago (The "From" date)
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(today.getDate() - 30);
const fromDate = thirtyDaysAgo.toISOString().split('T')[0];


async function getNews(ticker) {

    const url = `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${fromDate}&to=${toDate}&token=${API_KEY}`
    console.log(`fetching news from ${fromDate} to ${toDate}`)
    const response = await axios.get(url);

    return response.data.map(article => ({
        headline: article.headline,
        summary: article.summary,
    }));
}

module.exports = {getNews};