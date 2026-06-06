// chat.js - Frontend logic for AI Chatbot
document.addEventListener('DOMContentLoaded', () => {
  const chatToggle = document.getElementById('chat-toggle');
  const chatContainer = document.getElementById('chat-container');
  const chatClose = document.getElementById('chat-close');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const chatMessages = document.getElementById('chat-messages');
  const badgeDot = document.querySelector('.chat-badge-dot');

  // Maintain conversation history in memory
  let conversationHistory = [];

  // Toggle chat window
  chatToggle.addEventListener('click', () => {
    chatContainer.classList.toggle('open');
    if (chatContainer.classList.contains('open')) {
      // Hide badge dot once opened
      if (badgeDot) badgeDot.style.display = 'none';
      chatInput.focus();
    }
  });

  // Close chat window
  chatClose.addEventListener('click', () => {
    chatContainer.classList.remove('open');
  });

  // Handle send message
  chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageText = chatInput.value.trim();
    if (!messageText) return;

    // Clear input
    chatInput.value = '';

    // Append user message to UI
    appendMessage('user', messageText);

    // Save user message to history
    conversationHistory.push({ role: 'user', content: messageText });

    // Show typing indicator
    const typingIndicator = showTypingIndicator();

    try {
      // Send request to API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: conversationHistory
        })
      });

      // Remove typing indicator
      typingIndicator.remove();

      if (!response.ok) {
        throw new Error('API Request Failed');
      }

      const data = await response.json();
      const assistantText = data.text;

      // Append assistant message to UI
      appendMessage('assistant', assistantText);

      // Save assistant message to history
      conversationHistory.push({ role: 'assistant', content: assistantText });

      // Keep history limited to prevent large payload sizes (last 12 messages)
      if (conversationHistory.length > 12) {
        conversationHistory = conversationHistory.slice(-12);
      }

    } catch (error) {
      console.warn('Backend API key missing or offline. Falling back to local smart assistant:', error);
      
      // Simulate assistant typing for a natural feel
      setTimeout(() => {
        typingIndicator.remove();
        const fallbackText = getLocalFallbackResponse(messageText);
        
        // Append assistant message to UI
        appendMessage('assistant', fallbackText);
        
        // Save assistant message to history
        conversationHistory.push({ role: 'assistant', content: fallbackText });
        
        if (conversationHistory.length > 12) {
          conversationHistory = conversationHistory.slice(-12);
        }
      }, 750);
    }
  });

  // Helper to append message to UI
  function appendMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    
    // Auto scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Helper to show typing indicator
  function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.classList.add('typing-indicator');
    indicator.innerHTML = `
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
      <span class="typing-dot"></span>
    `;
    chatMessages.appendChild(indicator);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return indicator;
  }

  // Handle suggestion chips click
  const chatSuggestions = document.getElementById('chat-suggestions');
  if (chatSuggestions) {
    chatSuggestions.addEventListener('click', (e) => {
      const chip = e.target.closest('.suggestion-chip');
      if (chip) {
        const queryText = chip.getAttribute('data-text');
        if (queryText) {
          chatInput.value = queryText;
          chatForm.dispatchEvent(new Event('submit'));
        }
      }
    });
  }

  // Helper to generate a local fallback response about Prashant Deuja
  function getLocalFallbackResponse(query) {
    const text = query.toLowerCase();
    
    const info = {
      about: "Prashant Deuja is a Frontend Developer based in Kathmandu, Nepal. He specializes in creating responsive, user-friendly websites with clean, efficient, and maintainable code.",
      skills: "Prashant's technical skills include: HTML, CSS, JavaScript, Responsive Design, Web Accessibility, Cross-browser Compatibility, and Performance Optimization.",
      projects: "Prashant has built several projects: \n- E-commerce Website: Responsive online store with modern design.\n- Restaurant Website: Clean and elegant layout for a local restaurant.\n- Photography Portfolio: Minimalist portfolio for a professional photographer.",
      contact: "You can reach Prashant via:\n- Email: deujaprashant21@gmail.com\n- Phone: +977-9876543210\n- Location: Kathmandu, Nepal\nOr use the contact form at the bottom of the page!",
      social: "You can find Prashant on:\n- GitHub: https://github.com/Prashant471-cmd\n- LinkedIn: https://www.linkedin.com/in/prashant-deuja-16a899339/\n- Instagram: https://instagram.com/prashant_deuja\n- Facebook: https://www.facebook.com/pra.shant.363964",
      greeting: "Hello! How can I help you today? You can ask me about Prashant's skills, projects, contact info, or social links."
    };

    if (text.includes('hello') || text.includes('hi ') || text.trim() === 'hi' || text.includes('hey') || text.includes('hola') || text.includes('greet')) {
      return info.greeting;
    }
    if (text.includes('project') || text.includes('work') || text.includes('portfolio') || text.includes('website') || text.includes('build')) {
      return info.projects;
    }
    if (text.includes('skill') || text.includes('tech') || text.includes('know') || text.includes('language') || text.includes('framework')) {
      return info.skills;
    }
    if (text.includes('contact') || text.includes('email') || text.includes('phone') || text.includes('number') || text.includes('reach') || text.includes('mail') || text.includes('address')) {
      return info.contact;
    }
    if (text.includes('about') || text.includes('who') || text.includes('nepal') || text.includes('kathmandu') || text.includes('prashant') || text.includes('deuja')) {
      return info.about;
    }
    if (text.includes('github') || text.includes('linkedin') || text.includes('instagram') || text.includes('facebook') || text.includes('social')) {
      return info.social;
    }
    
    return "I'm Prashant's virtual assistant! I can tell you about his skills, projects, contact details, or social links. What would you like to know?";
  }
});
