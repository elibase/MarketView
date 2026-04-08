const newsService = require('../services/newsService.js');

exports.addKeyword = async (req, res) => {
    try {
        const keywordToAdd = req.body.message;
        const keywordWasAdded = await addKeyword(keywordToAdd, keywords);
        res.json({ successful: keywordWasAdded });
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
        const keywordWasRemoved = await removeKeyword(keywordToRemove, keywords);
        res.json({ successful: keywordWasRemoved });
    } catch {
        res.status(500).json({
            error: "Failed to remove symbol",
            message: error.message
        });
    }
}

exports.retrieveKeywords = async (req, res) => {
    try {
        res.json({ message: keywords }); // Need keywords reference
    } catch {
        res.status(500).json({
            error: "Failed to fetch symbols",
            message: error.message
        });
    }
}

exports.getArticles = async (req, res) => {
    try {
        const stockSymbol = req.body.message;
        const companyArticlesPromise = await getCompanyNews(stockSymbol);
        const companyArticles = Object.values(companyArticlesPromise)[1];
        res.json({ message: companyArticles });
    } catch {
        res.status(500).json({
            error: "Failed to fetch articles",
            message: error.message
        });
    }
}