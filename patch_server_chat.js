import fs from 'fs';
let code = fs.readFileSync('server.js', 'utf8');

const chatEndpoint = `
// AI Text Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: 'Message is required.' });
    }

    const systemInstruction = "You are the official chat assistant for LoveWeb, a platform for creating relationship and anniversary wishing websites. You must answer questions in Bengali (বাংলা). Only answer questions related to LoveWeb, order status, website packages (Regular, Exclusive, Premium), and general support. NEVER share any information about the admin panel, passwords, database, or anything unrelated to customer help. Keep answers short, polite, and helpful.";

    let formattedHistory = [];
    if (history && Array.isArray(history)) {
       formattedHistory = history.map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }]
       }));
    }

    const chatSession = ai.chats.create({
      model: "gemini-3.1-flash",
      config: {
        systemInstruction,
        temperature: 0.7,
      },
      history: formattedHistory
    });

    const response = await chatSession.sendMessage({ message });
    res.json({ success: true, text: response.text });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ success: false, message: 'Failed to get AI response.' });
  }
});
`;

// Insert it before the fallback app.get('*')
code = code.replace('// Fallback to sign-in for unspecified requests', chatEndpoint + '\n// Fallback to sign-in for unspecified requests');
fs.writeFileSync('server.js', code);
console.log('Added /api/chat endpoint');
