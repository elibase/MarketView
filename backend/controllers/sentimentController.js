const { getStockNews } = require("../services/newsService.js");
const { analyzeSentiment } = require("../services/pythonService.js");

async function getStockSentiment(req, res) {

  const ticker = req.params.ticker;

  try {

    console.log("Fetching news for:", ticker);

    const articles = await getStockNews(ticker);

    const sentiment = await analyzeSentiment(articles);

    res.json({
      ticker,
      sentiment
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Sentiment analysis failed"
    });

  }
}

module.exports = { getStockSentiment };