const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  const genAI = new GoogleGenerativeAI("AIzaSyDlcVVOTY8aEtG-BCj6P36hlB4M8SMAceg");
  
  try {
    console.log("Listing models...");
    // In newer SDK, listModels might be on the genAI instance or require a specific fetch
    // Let's try to just fetch one that is VERY likely to exist if the API is working
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent("test");
    console.log("Success with gemini-pro");
  } catch (e) {
    console.error("List or fetch error:", e.message);
  }
}

test();
