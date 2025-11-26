// Script to fetch official Sadhguru quotes from Isha Foundation
// Run with: node fetch-quotes.js

const https = require('https');
const fs = require('fs');

const quotes = [];
const totalPages = 50; // Fetch from multiple pages to get ~1000 quotes
let pagesFetched = 0;

function fetchPage(pageNum) {
    return new Promise((resolve, reject) => {
        const url = `https://isha.sadhguru.org/en/wisdom/type/quotes?contentType=quotes&page=${pageNum}`;
        
        https.get(url, (res) => {
            let data = '';
            
            res.on('data', (chunk) => {
                data += chunk;
            });
            
            res.on('end', () => {
                // Extract quotes from HTML using regex
                // Looking for quote text in the HTML structure
                const quoteRegex = /<div[^>]*class="[^"]*quote[^"]*"[^>]*>([^<]+)<\/div>/gi;
                const matches = data.match(/<div[^>]*class="[^"]*quote[^"]*"[^>]*>([^<]+)<\/div>/gi);
                
                if (matches) {
                    matches.forEach(match => {
                        // Extract text content
                        const textMatch = match.match(/>([^<]+)</);
                        if (textMatch && textMatch[1]) {
                            const quoteText = textMatch[1].trim();
                            if (quoteText && quoteText.length > 10 && quoteText.length < 200) {
                                quotes.push({
                                    quote: quoteText,
                                    category: "Wisdom"
                                });
                            }
                        }
                    });
                }
                
                // Also try to find JSON data if available
                const jsonMatch = data.match(/window\.__INITIAL_STATE__\s*=\s*({.+?});/);
                if (jsonMatch) {
                    try {
                        const jsonData = JSON.parse(jsonMatch[1]);
                        // Extract quotes from JSON structure
                        if (jsonData.quotes || jsonData.wisdom) {
                            const quoteData = jsonData.quotes || jsonData.wisdom || [];
                            quoteData.forEach(q => {
                                if (q.quote || q.text) {
                                    quotes.push({
                                        quote: q.quote || q.text,
                                        category: q.category || "Wisdom"
                                    });
                                }
                            });
                        }
                    } catch (e) {
                        // Ignore JSON parse errors
                    }
                }
                
                resolve();
            });
        }).on('error', (err) => {
            console.error(`Error fetching page ${pageNum}:`, err.message);
            resolve(); // Continue even if one page fails
        });
    });
}

async function fetchAllQuotes() {
    console.log('Fetching quotes from Isha Foundation...');
    
    // Fetch quotes from multiple pages
    for (let i = 1; i <= totalPages; i++) {
        await fetchPage(i);
        pagesFetched++;
        console.log(`Fetched page ${i}, total quotes: ${quotes.length}`);
        
        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (quotes.length >= 1000) {
            console.log('Reached 1000 quotes!');
            break;
        }
    }
    
    // Remove duplicates
    const uniqueQuotes = [];
    const seen = new Set();
    
    quotes.forEach(q => {
        const normalized = q.quote.toLowerCase().trim();
        if (!seen.has(normalized)) {
            seen.add(normalized);
            uniqueQuotes.push(q);
        }
    });
    
    console.log(`\nTotal unique quotes: ${uniqueQuotes.length}`);
    
    // Write to file
    const output = `// Sadhguru Official Quotes Database - ${uniqueQuotes.length} quotes
// Fetched from https://isha.sadhguru.org/en/wisdom/type/quotes
// These are authentic quotes from Sadhguru's official teachings

const SADHGURU_QUOTES = ${JSON.stringify(uniqueQuotes, null, 4)};

// Use all quotes (no filtering)
const SADHGURU_QUOTES_FILTERED = SADHGURU_QUOTES;
`;
    
    fs.writeFileSync('quotes-data.js', output);
    console.log('Quotes saved to quotes-data.js');
}

fetchAllQuotes().catch(console.error);

