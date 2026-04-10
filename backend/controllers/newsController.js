const newsService = require('../services/newsService.js');
const keywords = ["AMZN", "GOOG", "TSLA"] // Hardcoded

exports.addKeyword = async (req, res) => {
    try {
        const keywordToAdd = req.body.message;
        const results = await newsService.addKeyword(keywordToAdd, keywords);
        res.status(200).json({ successful: results });
    } catch {
        res.status(500).json({
            error: "Failed to add symbol",
            message: error.message
        });
    }
}

exports.removeKeyword = async (req, res) => {
    try {
        const keywordToRemove = req.body.message;
        const keywordWasRemoved = await newsService.removeKeyword(keywordToRemove, keywords);
        res.status(200).json({ successful: keywordWasRemoved });
    } catch {
        res.status(500).json({
            error: "Failed to remove symbol",
            message: error.message
        });
    }
}

exports.retrieveKeywords = async (req, res) => {
    try {
        res.status(200).json({ message: keywords }); // Need keywords reference
    } catch {
        res.status(500).json({
            error: "Failed to fetch symbols",
            message: error.message
        });
    }
}

exports.getArticles = async (req, res) => {
    try {
        const stockSymbol = req.body.message; // This runs fine
        const companyArticlesPromise = await newsService.getCompanyNews(stockSymbol); // Error here
        const companyArticles = Object.values(companyArticlesPromise)[1];
        res.json({ message: companyArticles });
    } catch {
        res.status(500).json({
            error: "Failed to fetch articles",
            message: error.message
        });
    }
}