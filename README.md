# Product Description Generator

An AI-powered tool to generate high-quality, SEO-optimized product descriptions using Google's Gemini API. Perfect for Amazon, Shopify, and Flipkart listings.

## Features

- Generate structured product descriptions
- SEO-optimized for e-commerce platforms
- English-only output
- Cost: 500-600 INR per generation
- User-friendly web interface

## Setup

1. Clone or download this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Get a Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
4. Update the `.env` file with your API key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```
5. Start the server:
   ```
   npm start
   ```
6. Open your browser and go to `http://localhost:3000`

## Usage

1. Fill in the product details in the form
2. Click "Generate Description"
3. Wait for the AI to generate the description
4. Copy the generated description for your e-commerce listings

## API

The tool uses the following API endpoint:

- `POST /generate`: Generate a product description

Request body:
```json
{
  "productName": "Wireless Headphones",
  "category": "Electronics",
  "features": "Noise cancelling, Bluetooth 5.0, 30-hour battery",
  "targetAudience": "Music lovers, commuters",
  "priceRange": "2000-5000 INR",
  "additionalInfo": "Compatible with all devices"
}
```

## Technologies Used

- Node.js
- Express.js
- Google Generative AI (Gemini)
- HTML/CSS/JavaScript

## License

ISC