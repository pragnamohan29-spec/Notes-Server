const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  const genAI = new GoogleGenerativeAI("AIzaSyCTPjxWJIOioLEyqeGFPCEINI6X2ywa1Y0");
  
  const models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro', 'gemini-flash-latest'];
  
  for (const modelName of models) {
    try {
      console.log(`Testing model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello, say 'Test successful'");
      console.log(`Result for ${modelName}:`, result.response.text());
    } catch (error) {
      console.error(`Error for ${modelName}:`, error.message);
    }
  }
}

test();
