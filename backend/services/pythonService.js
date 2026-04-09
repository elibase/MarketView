const axios = require("axios");
const PYTHON_API = process.env.PYTHON_API;

async function analyzeSentiment(articles) {

  const response = await axios.post(
    process.env.PYTHON_API,
    { articles }
  );

  return response.data;
}

module.exports = { analyzeSentiment };