import fs from 'fs';

let code = fs.readFileSync('server.js', 'utf8');

// 1. Add @google/genai import
code = code.replace(
  "import nodemailer from 'nodemailer';",
  "import nodemailer from 'nodemailer';\nimport { GoogleGenAI, Type } from '@google/genai';"
);

// 2. Initialize Gemini
const geminiInit = `
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});
`;
code = code.replace("const app = express();", geminiInit + "\nconst app = express();");

// 3. Add /api/generate-page-descriptions route
const geminiRoute = `
app.post('/api/generate-page-descriptions', async (req, res) => {
  try {
    const { idea, packageType, requiredPages, optionalPages } = req.body;
    if (!idea) return res.status(400).json({ success: false, message: 'Idea is required' });
    
    const totalPages = requiredPages + optionalPages;

    const prompt = \`The user wants to build a website.
Idea: "\${idea}"
Package: \${packageType} (which allows up to \${totalPages} pages).
Please generate detailed descriptions for exactly \${totalPages} pages (e.g., Home, About, Services, Contact, etc.).
Make the descriptions detailed and tailored to the idea. Write in Bengali (বাংলা).

Return a JSON array of strings, where each string is the detailed description of a specific page.\`;

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
code = code.replace("app.post('/api/place-order'", geminiRoute + "\napp.post('/api/place-order'");

// 4. Update /api/place-order payload
code = code.replace(
  "const { username, phone, websiteType, packageType, description, page1Desc, page2Desc, page3Desc, page4Desc, contactPhone, advancePaymentPhone } = req.body;",
  "const { username, phone, websiteType, packageType, description, pages, contactPhone, advancePaymentPhone } = req.body;"
);

code = code.replace(
  "description,\n      page1Desc,\n      page2Desc,\n      page3Desc,\n      page4Desc,",
  "description,\n      pages,"
);

fs.writeFileSync('server.js', code);
console.log('server.js updated successfully.');
