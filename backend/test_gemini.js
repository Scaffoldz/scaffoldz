require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        console.error('❌ GEMINI_API_KEY is missing or still a placeholder in .env');
        process.exit(1);
    }

    console.log(`🔑 Key found: ${apiKey.slice(0, 8)}...${apiKey.slice(-4)}`);
    console.log('📡 Calling Gemini API...');

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent('Say "Gemini API is working!" and nothing else.');
        const text = result.response.text();
        console.log('✅ Gemini responded:', text.trim());
        process.exit(0);
    } catch (err) {
        console.error('❌ Gemini API call failed:', err.message);
        process.exit(1);
    }
}

testGemini();
