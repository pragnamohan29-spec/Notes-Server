const axios = require('axios');

async function test() {
  const apiKey = "AIzaSyDlcVVOTY8aEtG-BCj6P36hlB4M8SMAceg";
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  
  try {
    console.log("Fetching available models from Google API...");
    const response = await axios.get(url);
    console.log("Models available:", JSON.stringify(response.data.models.map(m => m.name), null, 2));
  } catch (e) {
    console.error("Fetch error:", e.response ? e.response.status : e.message);
    if (e.response) console.error("Details:", e.response.data);
  }
}

test();
