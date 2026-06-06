// api/chat.js - Vercel Serverless Function for Gemini Chatbot
module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key is not configured' });
    }

    // Format messages for Gemini API
    const geminiMessages = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const systemInstructionText = `You are a helpful, professional, and friendly AI Assistant for Prashant Deuja's portfolio website. Your goal is to answer questions from visitors about Prashant's background, skills, projects, and contact information.

Here is the key information about Prashant:
- Name: Prashant Deuja
- Role: Frontend Developer (located in Kathmandu, Nepal)
- Email: deujaprashant21@gmail.com
- Phone: +977-9876543210
- Location: Kathmandu, Nepal
- GitHub: https://github.com/Prashant471-cmd
- LinkedIn: https://www.linkedin.com/in/prashant-deuja-16a899339/
- Instagram: https://instagram.com/prashant_deuja
- Facebook: https://www.facebook.com/pra.shant.363964
- Skills: HTML, CSS, JavaScript, Responsive Design, Web Accessibility, Cross-browser Compatibility, Performance Optimization.
- Projects:
  1. E-commerce Website: A responsive online store with modern design and smooth navigation.
  2. Restaurant Website: Clean and elegant design for a local restaurant.
  3. Photography Portfolio: Minimalist portfolio for a professional photographer.

Guidelines:
1. Keep your answers engaging, polite, and relatively concise (usually 1-3 sentences).
2. Answer based ONLY on the facts above. If you don't know the answer or if it's not in the context, politely suggest they contact Prashant directly using the contact form on the website or via email at deujaprashant21@gmail.com.
3. Present yourself as Prashant's virtual assistant. Use "Prashant" or "he/him" when talking about him.
4. Keep the tone professional but welcoming. Do not generate markdown links unless they are the exact URLs provided above.`;

    const payload = {
      contents: geminiMessages,
      systemInstruction: {
        parts: [{ text: systemInstructionText }]
      }
    };

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      return res.status(response.status).json({ error: 'Failed to fetch from Gemini API', details: errorText });
    }

    const data = await response.json();
    const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not generate a response. Please try again.';

    return res.status(200).json({ text: candidateText });
  } catch (error) {
    console.error('Chat error:', error);
    return res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};
