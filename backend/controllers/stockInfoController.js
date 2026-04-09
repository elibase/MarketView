const stockService = require('../services/stockInfoService.js');

exports.getStocks = async (req, res) => {
    try{
        const results = await stockService.getStockData();
        res.status(200).json(results);
    }catch (error){
        res.status(500).json({
            message: error.message
        })
    }
};
