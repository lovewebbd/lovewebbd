import fs from 'fs';
let code = fs.readFileSync('server.js', 'utf8');

// The file is corrupted between line 329 and 400. Let's just rip it out and replace it.
const startMarker = "app.post('/api/generate-page-descriptions', async (req, res) => {";
const endMarker = "app.post('/api/place-order', async (req, res) => {";

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
    const fixedBlock = `app.post('/api/generate-page-descriptions', async (req, res) => {
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
});

`;
    code = code.substring(0, startIndex) + fixedBlock + code.substring(endIndex);
    fs.writeFileSync('server.js', code);
    console.log('Fixed successfully.');
} else {
    console.log('Could not find markers.');
}
