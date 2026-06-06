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
      console.error('Chat error:', error);
      typingIndicator.remove();
      appendMessage('assistant', 'Sorry, I am having trouble connecting right now. Please try again.');
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
});
