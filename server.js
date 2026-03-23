require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.json());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});
app.use(express.static(path.join(__dirname)));

app.post('/generate', async (req, res) => {
    const { productName, category, features, targetAudience, priceRange, additionalInfo } = req.body;

    if (!productName || !category) {
        return res.status(400).json({ error: 'Product name and category are required' });
    }

    const prompt = `Generate a high-quality, SEO-optimized product description for the following product. The description should be suitable for Amazon, Shopify, and Flipkart. Focus on English language only. Make it engaging, persuasive, and include relevant keywords for search optimization.\n\nProduct Name: ${productName}\nCategory: ${category}\nKey Features: ${features || 'N/A'}\nTarget Audience: ${targetAudience || 'General consumers'}\nPrice Range: ${priceRange || 'N/A'}\nAdditional Information: ${additionalInfo || 'N/A'}\n\nStructure the description with:\n1. A compelling title\n2. Key features in bullet points\n3. Detailed description\n4. SEO keywords\n5. Call to action\n\nEnsure the description is between 200-400 words and optimized for e-commerce platforms.`;

    try {
        let description = '';

        // Preferred new method for @google/generative-ai
        if (typeof genAI.getModel === 'function') {
            const model = genAI.getModel(process.env.GEMINI_MODEL || 'gemini-pro');
            if (typeof model.generateText === 'function') {
                const response = await model.generateText({
                    prompt,
                    temperature: 0.2,
                    maxOutputTokens: 420
                });
                description = response?.text || '';
            }
        }

        // Legacy method compatibility
        if (!description && typeof genAI.generateText === 'function') {
            const response = await genAI.generateText({ text: prompt });
            description = response?.text || '';
        }

        if (!description && typeof genAI.generateContent === 'function') {
            const response = await genAI.generateContent({ prompt });
            if (response?.output && Array.isArray(response.output) && response.output[0]?.content) {
                description = response.output[0].content.map(c => c.text).join('\n');
            }
            if (!description && response?.response?.text) {
                description = response.response.text();
            }
        }

        if (!description) {
            throw new Error('Gemini returned no description. Check API key and model availability.');
        }

        return res.json({ description });
    } catch (error) {
        console.error('Gemini generation failure:', error);
        return res.status(500).json({ error: error.message || 'Failed to generate description' });
    }
});

app.listen(port, () => {
    console.log(`Product Description Tool running on port ${port}`);
});