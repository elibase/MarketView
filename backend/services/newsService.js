require('dotenv').config();
const axios = require("axios");
const keywords = ["Amazon", "AMZN", "Google", "GOOG", "Tesla", "TSLA"] // Hardcoded
const API_KEY = process.env.API_KEY;

// 1. Get Today's date (The "To" date)
const today = new Date();
const toDate = today.toISOString().split('T')[0];

// 2. Calculate 30 days ago (The "From" date)
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(today.getDate() - 30);
const fromDate = thirtyDaysAgo.toISOString().split('T')[0];

async function addKeyword(newKeyword, keywordArray) {
    // Assumes that newKeyword is simply a string consisting of a word.
    const keywordIsNew = !(keywordArray.includes(newKeyword));
    if (keywordIsNew) {
        keywordArray.push(newKeyword)
        return true;
    } else {
        return false;
    }
}

async function removeKeyword(keywordToRemove, keywordArray) {
    // Assumes that keywordToRemove is simply a string consisting of a word.
    const index = keywordArray.indexOf(keywordToRemove);

    if (index > -1) {
        keywordArray.splice(index, 1);
        return true;
    } else {
        return false;
    }
}

async function getGeneralNews() {
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
    const category = "general"; // values: general, forex, crypto, or merger
    const url = `https://finnhub.io/api/v1/news?category=${category}&token=${API_KEY}`;
    console.log(`fetching news from ${fromDate} to ${toDate}`);
    const response = await axios.get(url);

    return response.data.map(article => ({
        category: article.category,
        datetime: article.datetime,
        headline: article.headline,
        summary: article.summary,
    }));
}

async function getCompanyNews(ticker) {
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
    const url = `https://finnhub.io/api/v1/company-news?symbol=${ticker}&from=${fromDate}&to=${toDate}&token=${API_KEY}`;
    console.log(`fetching news from ${fromDate} to ${toDate}`);
    const response = await axios.get(url);

    return response.data.map(article => ({
        headline: article.headline,
        summary: article.summary,
    }));
}

module.exports = { keywords, addKeyword, removeKeyword, getGeneralNews, getCompanyNews };