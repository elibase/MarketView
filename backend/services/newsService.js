require('dotenv').config();
const axios = require("axios");
const API_KEY = process.env.API_KEY;
const keywords = ["AMZN", "GOOG", "TSLA"] // Hardcoded


const companyBySymbol = require("../data/company-by-symbol.json");
const symbolsByIndustry = require('../data/symbols-by-industry.json');
const stocksInformation = require('../data/stocks-information.json');
// Code related to Excel file
const XLSX = require('xlsx');
const workbook = XLSX.readFile('./data/stocks-list.xlsx');

// Code to create JSON object from 1st sheet of Excel file
function createCompanyBySymbolJson() { // Service
    const sheetName = workbook.SheetNames[0];
    const obj = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const finalArray = [];

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const line = obj[key];
            const newObj = { "symbol": line.Symbol, "company": line["Company Name"], "both": line.Symbol.concat(" - ", line["Company Name"]) };
            finalArray.push(newObj);
        }
    }

    const fs = require('fs');
    // 1. Convert object to JSON string (with 2-space indentation)
    const jsonData = JSON.stringify(finalArray, null, 2);

    // 2. Write to file
    fs.writeFile('./data/company-by-symbol.json', jsonData, 'utf8', (err) => {
        if (err) {
            console.error("An error occurred while writing JSON Object to File.", err);
            return;
        }
        console.log("JSON file has been saved.");
    });

}
//createCompanyBySymbolJson();

// Code to create JSON object from 1rd sheet of Excel file
function createStocksInformationJson() { // Service
    const sheetName = workbook.SheetNames[0];
    const obj = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    const finalArray = [];

    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const line = obj[key];
            const newObj = { "symbol": line.Symbol, "company": line["Company Name"], "industry": line.Industry };
            finalArray.push(newObj);
        }
    }

    const fs = require('fs');
    // 1. Convert object to JSON string (with 2-space indentation)
    const jsonData = JSON.stringify(finalArray, null, 2);

    // 2. Write to file
    fs.writeFile('./data/stocks-information.json', jsonData, 'utf8', (err) => {
        if (err) {
            console.error("An error occurred while writing JSON Object to File.", err);
            return;
        }
        console.log("JSON file has been saved.");
    });

}
//createStocksInformationJson();

// Code to create JSON object from 3rd sheet of Excel file
function createSymbolsByIndustryJson() { // Service
    const sheetName = workbook.SheetNames[2];
    const obj = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

    const finalArray = [];

    for (const key in obj) {
        var industry = "";
        const array = [];

        if (obj.hasOwnProperty(key)) {
            const line = obj[key];
            for (const key2 in line) {
                if (line.hasOwnProperty(key2)) {
                    if (key2 === "Industry") {
                        industry = line[key2];
                    } else {
                        array.push(line[key2]);
                    }
                }
            }
        }

        const newObj = { "industry": industry, symbols: array };
        finalArray.push(newObj);
    }

    const fs = require('fs');
    // 1. Convert object to JSON string (with 2-space indentation)
    const jsonData = JSON.stringify(finalArray, null, 2);

    // 2. Write to file
    fs.writeFile('./data/symbols-by-industry.json', jsonData, 'utf8', (err) => {
        if (err) {
            console.error("An error occurred while writing JSON Object to File.", err);
            return;
        }
        console.log("JSON file has been saved.");
    });

}
//createSymbolsByIndustryJson();
// End of code related to Excel file



// 1. Get Today's date (The "To" date)
const today = new Date();
const toDate = today.toISOString().split('T')[0];

// 2. Calculate 30 days ago (The "From" date)
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(today.getDate() - 30);
const fromDate = thirtyDaysAgo.toISOString().split('T')[0];

function formatUnixDatetime(datetime) { // Service
    const isoDate = new Date(datetime * 1000).toISOString();
    const dateObj = new Date(isoDate);

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    const readable = new Intl.DateTimeFormat('en-US', options).format(dateObj);
    return readable; // Output: "Monday, May 20, 2024"
}

async function filterByCompanyOrSymbol(stringObj, objType) { // Service
    var filter = "";

    if (objType.toLowerCase() === "symbol") {
        filter = (arr, symbol) => arr.filter(entity => entity["symbol"].toUpperCase() === symbol.toUpperCase());
    } else if (objType.toLowerCase() === "company") {
        filter = (arr, company) => arr.filter(entity => entity["company"].toLowerCase() === company.toLowerCase());
    }

    var entity = filter(stocksInformation, stringObj)[0];
    return entity;
}

async function filterByIndustry(industry, returnObjType) { // Service
    var filter = (arr, industry) => arr.filter(object => object["industry"].toLowerCase() === industry.toLowerCase());
    var filteredArray = filter(stocksInformation, industry);
    const finalArray = [];
    returnObjType = returnObjType.toLowerCase();
    if (returnObjType === "symbol" || returnObjType === "company" || returnObjType === "both") {
        filteredArray.forEach((item) => {
            const finalItem = {};
            if (returnObjType === "symbol") {
                finalArray.push(item.symbol);
            } else if (returnObjType === "company") {
                finalArray.push(item.company);
            } else if (returnObjType === "both") {
                finalItem.symbol = item.symbol;
                finalItem.company = item.company;
                finalArray.push(finalItem);
            }
        });
        return finalArray;
    } else {
        return filteredArray;
    }
}

async function getStockInfo(stringObj) { // Service
    const symbolArgument = filterByCompanyOrSymbol(stringObj, "symbol");
    const companyArgument = filterByCompanyOrSymbol(stringObj, "company");
    var symbolUndefined = false;
    var companyUndefined = false;

    symbolArgument.then(result => {
        if (result === undefined) {
            symbolUndefined = true;
        }
    });

    companyArgument.then(result => {
        if (result === undefined) {
            companyUndefined = true;
        }
    });

    if (symbolUndefined === false) {
        return { successful: true, stock: symbolArgument };
    }

    if (companyUndefined === false) {
        return { successful: true, stock: companyArgument };
    }

    return { successful: false, stock: "" };
}

async function addKeyword(newKeyword, keywordArray) { // Controller
    // Assumes that newKeyword is simply a string consisting of a word.
    const keywordIsNew = !(keywordArray.includes(newKeyword));
    if (keywordIsNew) {
        keywordArray.push(newKeyword)
        keywordArray.sort();
        return true;
    } else {
        return false;
    }
}

async function removeKeyword(keywordToRemove, keywordArray) { // Controller
    // Assumes that keywordToRemove is simply a string consisting of a word.
    const index = keywordArray.indexOf(keywordToRemove);

    if (index > -1) {
        keywordArray.splice(index, 1);
        keywordArray.sort();
        return true;
    } else {
        return false;
    }
}

async function filterArticles(articles, symbol, company, keywords) { // Service
    const wordsToFind = [];
    if (symbol.length > 0) {
        wordsToFind.push(symbol.toLowerCase());
    }

    if (company.length > 0) {
        const companyWords = company.split(" ");
        companyWords.forEach((word) => {
            wordsToFind.push(word.toLowerCase());
        });
        wordsToFind.pop(); // Removes the last company word, which is often something like Inc., Limited, etc.
    }

    if (keywords.length > 0) {
        keywords.forEach((keyword) => {
            wordsToFind.push(keyword.toLowerCase());
        });
    }

    const validArticles = [];

    articles.forEach((article) => {
        var validArticle = false;

        try {
            const headline = article.headline.toLowerCase();
            const summary = article.summary.toLowerCase();
            for (const word in wordsToFind) {
                if (headline.includes(word)) {
                    validArticle = true;
                    break;
                }
                if (summary.includes(word)) {
                    validArticle = true;
                    break;
                }
            }
        } catch {
            // do nothing
        }

        if (validArticle) {
            validArticles.push(article);
        }
    });

    return validArticles;
}

async function getMarketNews() { // Controller
    /*
    List of attributes in response body:
    - category: ex. "technology", "business", "top news"
    - datetime: ex. 1596589501 (???)
    - headline: ex. "Square surges after reporting 64% jump in revenue, more customers using Cash App"
    - id: ex. 5085164
    - image: ex. "https://image.cnbcfm.com/api/v1/image/105569283-1542050972462rts25mct.jpg?v=1542051069"
    - related
    - source: "ex. "CNBC"
    - summary: ex. "Shares of Square soared on Tuesday evening after posting better-than-expected quarterly results and strong growth in its consumer payments app."
    - url: ex. "https://www.cnbc.com/2020/08/04/square-sq-earnings-q2-2020.html"
    */
    const category1 = "general"; // values: general, forex, crypto, or merger
    const category2 = "crypto";
    const category3 = "merger";

    const url1 = `https://finnhub.io/api/v1/news?category=${category1}&token=${API_KEY}`;
    const url2 = `https://finnhub.io/api/v1/news?category=${category2}&token=${API_KEY}`;
    const url3 = `https://finnhub.io/api/v1/news?category=${category3}&token=${API_KEY}`;

    const response1 = await axios.get(url1);
    const response2 = await axios.get(url2);
    const response3 = await axios.get(url3);

    const articles1 = response1.data.map(article => ({
        category: article.category,
        datetime: article.datetime,
        headline: article.headline,
        source: article.source,
        summary: article.summary,
        url: article.url
    }));

    const articles2 = response2.data.map(article => ({
        category: article.category,
        datetime: article.datetime,
        headline: article.headline,
        source: article.source,
        summary: article.summary,
        url: article.url
    }));

    const articles3 = response3.data.map(article => ({
        category: article.category,
        datetime: article.datetime,
        headline: article.headline,
        source: article.source,
        summary: article.summary,
        url: article.url
    }));

    const combinedArticles = [...articles1, articles3]; // Crypto is not included, largely unrelated.
    if (combinedArticles.length > 0) {
        return { successful: true, articles: combinedArticles };
    }

    return { successful: false, articles: "" };
}

async function getCompanyNews(symbol) { // Controller
    /*
    List of attributes in response body:
    - category: ex. "company news",
    - datetime: ex. 1569550360,
    - headline: ex. "More sops needed to boost electronic manufacturing: Top govt official More sops needed to boost electronic manufacturing: Top govt official.  More sops needed to boost electronic manufacturing: Top govt official More sops needed to boost electronic manufacturing: Top govt official",
    - id: ex. 25286,
    - image: ex. "https://img.etimg.com/thumb/msid-71321314,width-1070,height-580,imgsize-481831,overlay-economictimes/photo.jpg",
    - related: ex. "AAPL",
    - source: ex. "The Economic Times India",
    - summary: ex. "NEW DELHI | CHENNAI: India may have to offer electronic manufacturers additional sops such as cheap credit and incentives for export along with infrastructure support in order to boost production and help the sector compete with China, Vietnam and Thailand, according to a top government official.These incentives, over and above the proposed reduction of corporate tax to 15% for new manufacturing units, are vital for India to successfully attract companies looking to relocate manufacturing facilities.“While the tax announcements made last week send a very good signal, in order to help attract investments, we will need additional initiatives,” the official told ET, pointing out that Indian electronic manufacturers incur 8-10% higher costs compared with other Asian countries.Sops that are similar to the incentives for export under the existing Merchandise Exports from India Scheme (MEIS) are what the industry requires, the person said.MEIS gives tax credit in the range of 2-5%. An interest subvention scheme for cheaper loans and a credit guarantee scheme for plant and machinery are some other possible measures that will help the industry, the official added.“This should be 2.0 (second) version of the electronic manufacturing cluster (EMC) scheme, which is aimed at creating an ecosystem with an anchor company plus its suppliers to operate in the same area,” he said.Last week, finance minister Nirmala Sitharaman announced a series of measures to boost economic growth including a scheme allowing any new manufacturing company incorporated on or after October 1, to pay income tax at 15% provided the company does not avail of any other exemption or incentives.",
    - url: ex. "https://economictimes.indiatimes.com/industry/cons-products/electronics/more-sops-needed-to-boost-electronic-manufacturing-top-govt-official/articleshow/71321308.cms"
  
    */
    const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${fromDate}&to=${toDate}&token=${API_KEY}`;
    console.log(`fetching news from ${fromDate} to ${toDate}`);
    const response = await axios.get(url);
    const articles = response.data.map(article => ({
        category: article.category,
        datetime: article.datetime,
        readableDatetime: formatUnixDatetime(article.datetime),
        headline: article.headline,
        source: article.source,
        summary: article.summary,
        url: article.url
    }));


    if (articles.length > 0) {
        return { successful: true, articles: articles };
    }

    return { successful: false, articles: "" };

}

module.exports = { keywords, addKeyword, removeKeyword, getCompanyNews };