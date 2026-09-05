import fs from 'fs';

let server = fs.readFileSync('server.js', 'utf8');

const oldPrompt = `const prompt = \`The user wants to build a website.
Idea: "\${idea}"
Package: \${packageType}.
You MUST generate detailed descriptions for exactly \${totalToGenerate} pages (e.g., Home, About, Services, Contact, etc.).
Make the descriptions detailed and tailored to the idea. Write in Bengali (বাংলা).

Return a JSON array of strings, where each string is the detailed description of a specific page. The length of the array must be exactly \${totalToGenerate}.\`;`;

const newPrompt = `const prompt = \`The user wants to build a relationship/anniversary wishing website. 
Idea: "\${idea}"
Package: \${packageType}.

IMPORTANT INSTRUCTIONS:
- You MUST generate detailed descriptions for exactly \${totalToGenerate} sections/pages.
- Default to styles like "Auto Queue Theme", "Normal", or "Wishing Website".
- DO NOT suggest or create descriptions for "Home Page", "About Us", "Contact Us", professional portfolios, or corporate websites. LoveWeb ONLY builds wishing websites.
- Make the descriptions detailed, romantic, and tailored to the idea. Write in Bengali (বাংলা).

Return a JSON array of strings, where each string is the detailed description of a specific section/page. The length of the array must be exactly \${totalToGenerate}.\`;`;

if (server.includes(oldPrompt)) {
  server = server.replace(oldPrompt, newPrompt);
  fs.writeFileSync('server.js', server);
  console.log('Prompt updated');
} else {
  console.log('Prompt not found');
}
