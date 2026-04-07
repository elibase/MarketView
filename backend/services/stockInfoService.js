const YahooFinance = require("yahoo-finance2").default;
const yahooFinance = new YahooFinance();

const stockSymbols = require("../data/stocks.json");

function createStock(stock) {
  return {
    symbol: stock.symbol,
    name: stock.displayName,
    price: stock.regularMarketPrice,
    change: stock.regularMarketChange,
    changePercent: stock.regularMarketChangePercent,
    volume: stock.regularMarketVolume,
    marketCap: stock.marketCap,
    earningsDate: stock.earningsTimestamp
  };
}

// Retuns a list of all stock data for each stock contained in ../data/stocks.json
exports.getStockData = async () => {
  const results = [];

  for (const symbol of stockSymbols) {
    try {
      let result = await yahooFinance.quote(symbol);
      result = createStock(result);
      results.push(result);
    } catch (error) {
      if (error instanceof yahooFinance.errors.FailedYahooValidationError) {
        console.error(`Validation error for ${symbol}`);
        // This library exposes partial validated data on error.result
        if (error.result) {
          results.push(error.result);
        }
      } else if (error instanceof yahooFinance.errors.HTTPError) {
        console.warn(`Skipping ${symbol}: ${error.name} ${error.message}`);
        continue;
      } else {
        console.warn(`Skipping ${symbol}: ${error.name} ${error.message}`);
        continue;
      }
    }
  }

  return results;
};
