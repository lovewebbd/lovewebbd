import fs from 'fs';
let code = fs.readFileSync('server.js', 'utf8');

const regex = /const session = await ai\.live\.connect\(\{[\s\S]*?\}\);[\s\S]*?clientWs\.on\("message"/;
const replacement = `const session = await ai.live.connect({
      model: "gemini-3.1-flash-live-preview",
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } },
        },
        systemInstruction: "You are the official voice assistant for LoveWeb, a platform for creating relationship and anniversary wishing websites. You must answer questions in Bengali (বাংলা). Only answer questions related to LoveWeb, order status, website packages (Regular, Exclusive, Premium), and general support. NEVER share any information about the admin panel, passwords, database, or anything unrelated to customer help. Keep answers short, polite, and helpful.",
      },
      callbacks: {
        onmessage: (message) => {
          const audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          if (audio) {
            if (clientWs.readyState === 1) clientWs.send(JSON.stringify({ audio }));
          }
          if (message.serverContent?.interrupted) {
            if (clientWs.readyState === 1) clientWs.send(JSON.stringify({ interrupted: true }));
          }
        },
        onclose: () => {
           console.log("Live session closed");
        },
        onerror: (err) => {
           console.error("Live session error:", err);
        }
      }
    });

    clientWs.on("message"`;

code = code.replace(regex, replacement);
fs.writeFileSync('server.js', code);
console.log('Fixed callbacks in server.js');
