require('dotenv').config();
const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post('/generate', async (req, res) => {
    try {
        const { productName, category, features, targetAudience, priceRange, additionalInfo } = req.body;

        if (!productName || !category) {
            return res.status(400).json({ error: 'Product name and category are required' });
        }

        const model = genAI.getGenerativeModel ? genAI.getGenerativeModel({ model: 'gemini-pro' }) : genAI;

        const prompt = `Generate a high-quality, SEO-optimized product description for the following product. The description should be suitable for Amazon, Shopify, and Flipkart. Focus on English language only. Make it engaging, persuasive, and include relevant keywords for search optimization.

Product Name: ${productName}
Category: ${category}
Key Features: ${features || 'N/A'}
Target Audience: ${targetAudience || 'General consumers'}
Price Range: ${priceRange || 'N/A'}
Additional Information: ${additionalInfo || 'N/A'}

Structure the description with:
1. A compelling title
2. Key features in bullet points
3. Detailed description
4. SEO keywords
5. Call to action

Ensure the description is between 200-400 words and optimized for e-commerce platforms.`;

        let description = '';

        if (typeof model.generateContent === 'function') {
            const result = await model.generateContent(prompt);
            description = (result && result.response && typeof result.response.text === 'function')
                ? result.response.text()
                : (result && result.output && result.output[0] && result.output[0].content ? result.output[0].content[0].text : '');
        } else if (typeof model.generateText === 'function') {
            const response = await model.generateText({ text: prompt });
            description = response?.text || '';
        } else {
            throw new Error('Incompatible Gemini client SDK.');
        }

        if (!description) {
            throw new Error('Gemini returned empty response');
        }

        res.json({ description });
    } catch (error) {
        console.error('Error generating description:', error);
        res.status(500).json({ error: (error.message || 'Failed to generate description') });
    }
});

app.listen(port, () => {
    console.log(`Product Description Tool running on port ${port}`);
});