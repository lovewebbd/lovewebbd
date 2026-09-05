import fs from 'fs';
let code = fs.readFileSync('server.js', 'utf8');

// Insert tool definitions and helper functions above the chat endpoint
const toolHelpers = `
// AI Helper Functions
async function checkOrderStatus(args) {
  try {
    const { identifier } = args;
    if (!identifier) return { status: 'error', message: 'No identifier provided.' };
    
    // Check by phone
    let snapshot = await db.collection('orders').where('phone', '==', identifier).get();
    if (snapshot.empty) {
      // Check by username
      snapshot = await db.collection('orders').where('username', '==', identifier).get();
    }
    
    if (snapshot.empty) {
      return { status: 'not_found', message: 'আপনার এই নাম্বার বা ইউজারনেম দিয়ে কোনো অর্ডার পাওয়া যায়নি।' };
    }
    
    const orders = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      orders.push({
        orderId: doc.id,
        packageType: data.packageType || 'Unknown',
        status: data.status || 'পেন্ডিং',
        advancePaymentStatus: data.advancePaymentStatus || 'অপেক্ষমান'
      });
    });
    return { status: 'success', message: 'অর্ডার পাওয়া গেছে।', orders };
  } catch (error) {
    console.error('Error checking order status:', error);
    return { status: 'error', message: 'অর্ডার চেক করতে সমস্যা হয়েছে।' };
  }
}

async function placeNewOrder(args) {
  try {
    const newOrder = {
       orderId: 'LWEB' + Date.now().toString().slice(-6),
       username: args.contactPhone,
       phone: args.contactPhone,
       websiteType: args.websiteType || 'Anniversary',
       packageType: args.packageType || 'Regular',
       description: args.description || '',
       contactPhone: args.contactPhone,
       advancePaymentPhone: args.advancePaymentPhone,
       status: 'পেন্ডিং',
       advancePaymentStatus: 'অপেক্ষমান',
       totalPrice: args.packageType === 'Premium' ? '1000' : (args.packageType === 'Exclusive' ? '700' : '400'),
       createdAt: admin.firestore.FieldValue.serverTimestamp()
    };
    await db.collection('orders').add(newOrder);
    return { status: 'success', orderId: newOrder.orderId, message: 'আপনার অর্ডারটি সফলভাবে প্লেস করা হয়েছে। অ্যাডমিন প্যানেল থেকে খুব শীঘ্রই যোগাযোগ করা হবে।' };
  } catch (error) {
    console.error('Error placing new order:', error);
    return { status: 'error', message: 'অর্ডার প্লেস করতে সমস্যা হয়েছে। দয়া করে আবার চেষ্টা করুন।' };
  }
}

const aiTools = [{
  functionDeclarations: [
    {
      name: 'check_order_status',
      description: 'Check the status of an existing order. Requires a phone number or username.',
      parameters: {
        type: Type.OBJECT,
        properties: { identifier: { type: Type.STRING, description: 'Phone number or username of the customer' } },
        required: ['identifier'],
      }
    },
    {
      name: 'place_new_order',
      description: 'Place a new order. MUST ask for websiteType (Anniversary/Birthday etc.), packageType (Regular/Exclusive/Premium), contactPhone, and advancePaymentPhone before calling.',
      parameters: {
        type: Type.OBJECT,
        properties: {
          websiteType: { type: Type.STRING, description: 'Type of website' },
          packageType: { type: Type.STRING, description: 'Package: Regular, Exclusive, or Premium' },
          description: { type: Type.STRING, description: 'Details or idea for the website' },
          contactPhone: { type: Type.STRING, description: 'Contact phone number (11 digits)' },
          advancePaymentPhone: { type: Type.STRING, description: 'Phone number used for advance payment' }
        },
        required: ['websiteType', 'packageType', 'contactPhone', 'advancePaymentPhone']
      }
    }
  ]
}];
`;

code = code.replace("// AI Text Chat Endpoint", toolHelpers + "\n// AI Text Chat Endpoint");

// Update Text Chat endpoint
const oldChatEndpoint = `    const chatSession = ai.chats.create({
      model: "gemini-3.1-flash",
      config: {
        systemInstruction,
        temperature: 0.7,
      },
      history: formattedHistory
    });

    const response = await chatSession.sendMessage({ message });
    res.json({ success: true, text: response.text });`;

const newChatEndpoint = `    const chatSession = ai.chats.create({
      model: "gemini-3.1-flash",
      config: {
        systemInstruction: systemInstruction + " You have tools to place orders and check order status. Always use them if the user asks. Before placing an order, ask for all required details nicely.",
        temperature: 0.7,
        tools: aiTools
      },
      history: formattedHistory
    });

    let response = await chatSession.sendMessage({ message });
    
    // Handle tool calls in text chat
    if (response.functionCalls && response.functionCalls.length > 0) {
       const call = response.functionCalls[0];
       let result = {};
       if (call.name === 'check_order_status') result = await checkOrderStatus(call.args);
       else if (call.name === 'place_new_order') result = await placeNewOrder(call.args);
       
       response = await chatSession.sendMessage([{
          functionResponse: {
             name: call.name,
             response: result
          }
       }]);
    }

    res.json({ success: true, text: response.text });`;

code = code.replace(oldChatEndpoint, newChatEndpoint);

// Update Live WebSocket API
const liveRegex = /config: \{([\s\S]*?systemInstruction:[\s\S]*?)\},/;
const liveReplacement = `config: {
        $1 + " You can place orders and check order status. Use tools when needed.",
        tools: aiTools
      },`;
code = code.replace(liveRegex, liveReplacement);

const callbacksRegex = /onmessage: \(message\) => \{([\s\S]*?)if \(message\.serverContent\?\.interrupted\)/;
const callbacksReplacement = `onmessage: async (message) => {$1
          // Tool call handling for Live API
          const toolCalls = message.serverContent?.modelTurn?.parts?.filter(p => p.functionCall) || [];
          if (toolCalls.length > 0) {
             const responses = [];
             for (const part of toolCalls) {
                const call = part.functionCall;
                let result = {};
                if (call.name === 'check_order_status') result = await checkOrderStatus(call.args);
                else if (call.name === 'place_new_order') result = await placeNewOrder(call.args);
                responses.push({ id: call.id, name: call.name, response: result });
             }
             if (session) {
                session.send({ toolResponse: { functionResponses: responses } });
             }
          }

          if (message.serverContent?.interrupted)`;
code = code.replace(callbacksRegex, callbacksReplacement);

fs.writeFileSync('server.js', code);
console.log('Updated server.js with tools');
