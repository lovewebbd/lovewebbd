import fs from 'fs';

let code = fs.readFileSync('server.js', 'utf8');

const oldRoute = /app\.post\('\/api\/generate-page-descriptions', async \(req, res\) => \{[\s\S]*?\}\);/;

const newRoute = `app.post('/api/generate-page-descriptions', async (req, res) => {
  try {
    const { idea, packageType, requiredPages, optionalPages } = req.body;
    if (!idea) return res.status(400).json({ success: false, message: 'Idea is required' });
    
    // Randomly decide how many optional pages to fill (between 0 and optionalPages)
    const numOptionalToGenerate = Math.floor(Math.random() * (optionalPages + 1));
    const totalToGenerate = requiredPages + numOptionalToGenerate;

    const prompt = \`The user wants to build a website.
Idea: "\${idea}"
Package: \${packageType}.
You MUST generate detailed descriptions for exactly \${totalToGenerate} pages (e.g., Home, About, Services, Contact, etc.).
Make the descriptions detailed and tailored to the idea. Write in Bengali (বাংলা).

Return a JSON array of strings, where each string is the detailed description of a specific page. The length of the array must be exactly \${totalToGenerate}.\`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING
          },
          description: "An array of page descriptions in Bengali."
        }
      }
    });

    const pages = JSON.parse(response.text.trim());
    res.json({ success: true, pages });
  } catch (error) {
    console.error('Error generating pages:', error);
    res.status(500).json({ success: false, message: 'Failed to generate descriptions.' });
  }
});`;

code = code.replace(oldRoute, newRoute);

fs.writeFileSync('server.js', code);
console.log('server.js updated successfully.');
