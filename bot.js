// ========================================
//   LIET College Bot - Chat Logic (bot.js)
// ========================================

let botData = null;

// ---- Load responses.json ----
async function loadBotData() {
  try {
    const response = await fetch('../data/responses.json');
    botData = await response.json();
    console.log("✅ Bot data loaded successfully!");
  } catch (error) {
    console.error("❌ Error loading bot data:", error);
  }
}

// ---- Find Best Matching Answer ----
function getResponse(userMessage) {
  if (!botData) return "Sorry, I'm having trouble loading data. Please try again!";

  const message = userMessage.toLowerCase().trim();

  // Search through intents
  for (let intent of botData.intents) {
    for (let pattern of intent.patterns) {
      if (message.includes(pattern.toLowerCase())) {
        // Pick a random response if multiple exist
        const responses = intent.responses;
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
  }

  // Keyword based fallback search
  const keywords = {
    "fee": "fees_btech",
    "fees": "fees_btech",
    "cost": "fees_btech",
    "mtech fee": "fees_mtech",
    "pg fee": "fees_mtech",
    "cse": "cse_info",
    "eee": "eee_info",
    "ece": "ece_info",
    "mech": "mech_info",
    "mechanical": "mech_info",
    "css": "css_info",
    "cit": "cit_info",
    "csm": "csm_info",
    "aiml": "csm_info",
    "ai": "csm_info",
    "ml": "csm_info",
    "principal": "principal",
    "hod": "hod_info",
    "placement": "placement",
    "address": "location",
    "location": "location",
    "time": "timings",
    "timing": "timings",
    "hours": "timings",
    "phone": "phone",
    "contact": "phone",
    "course": "btech_courses",
    "branch": "btech_courses",
    "accreditation": "accreditation",
    "naac": "accreditation",
    "nba": "accreditation",
    "exam": "examinations",
    "intake": "intake",
    "seats": "intake",
    "duration": "duration",
    "years": "duration",
    "hi": "greeting",
    "hello": "greeting",
    "bye": "goodbye",
    "thank": "goodbye"
  };

  for (let keyword in keywords) {
    if (message.includes(keyword)) {
      const tag = keywords[keyword];
      const intent = botData.intents.find(i => i.tag === tag);
      if (intent) {
        const responses = intent.responses;
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }
  }

  // Default fallback
  return "I'm sorry, I didn't understand that. You can ask me about:\n• Courses & Fees\n• Departments & HODs\n• Admissions & Contact\n• College Timings & Location";
}

// ---- Add Message to Chat ----
function addMessage(text, sender) {
  const messagesDiv = document.getElementById('chat-messages');

  const msg = document.createElement('div');
  msg.classList.add('msg', sender);
  msg.innerText = text;

  messagesDiv.appendChild(msg);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// ---- Show Typing Indicator ----
function showTyping() {
  const messagesDiv = document.getElementById('chat-messages');
  const typing = document.createElement('div');
  typing.classList.add('typing');
  typing.id = 'typing-indicator';
  typing.innerHTML = '<span></span><span></span><span></span>';
  messagesDiv.appendChild(typing);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// ---- Hide Typing Indicator ----
function hideTyping() {
  const typing = document.getElementById('typing-indicator');
  if (typing) typing.remove();
}

// ---- Send Message ----
function sendMessage() {
  const input = document.getElementById('chat-input');
  const userMessage = input.value.trim();

  if (!userMessage) return;

  // Show user message
  addMessage(userMessage, 'user');
  input.value = '';

  // Show typing indicator
  showTyping();

  // Simulate bot thinking delay
  setTimeout(() => {
    hideTyping();
    const botReply = getResponse(userMessage);
    addMessage(botReply, 'bot');
  }, 800);
}

// ---- Handle Enter Key ----
function handleKey(event) {
  if (event.key === 'Enter') {
    sendMessage();
  }
}

// ---- Toggle Chat Window ----
function toggleChat() {
  const chatWindow = document.getElementById('chat-window');
  const bubbleClose = document.getElementById('bubble-close');

  if (chatWindow.classList.contains('open')) {
    chatWindow.classList.remove('open');
    bubbleClose.style.display = 'none';
  } else {
    chatWindow.classList.add('open');
    bubbleClose.style.display = 'flex';
  }
}

// ---- Close Chat Window ----
function closeChat() {
  const chatWindow = document.getElementById('chat-window');
  const bubbleClose = document.getElementById('bubble-close');
  chatWindow.classList.remove('open');
  bubbleClose.style.display = 'none';
}

// ---- Quick Suggestion Click ----
function sendSuggestion(text) {
  document.getElementById('chat-input').value = text;
  sendMessage();
}

// ---- Create Bot HTML ----
function createBotHTML() {
  const botHTML = `
    <!-- Chat Bubble Button -->
    <div id="chat-bubble">
      <button id="bubble-close" onclick="closeChat()">✕</button>
      <div class="bubble-label">
        <svg viewBox="0 0 100 100">
          <defs>
            <path id="circle-path"
              d="M 50,50 m -30,0 a 30,30 0 1,1 60,0 a 30,30 0 1,1 -60,0"/>
          </defs>
          <text font-size="10.5" font-family="Poppins, sans-serif" fill="#4e2c0e" font-weight="600" letter-spacing="1.5">
            <textPath href="#circle-path">We Are Here! • We Are Here! •</textPath>
          </text>
        </svg>
      </div>
      <span class="bubble-wave">👋</span>
      <button id="chat-bubble-btn" onclick="toggleChat()">
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 2H4C2.9 2 2 2.9 2 4v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
        </svg>
      </button>
    </div>

    <!-- Chat Window -->
    <div id="chat-window">
      <div id="chat-header">
        <div class="bot-avatar">🎓</div>
        <div class="bot-info">
          <h4>LIET Bot</h4>
          <p>Ask me anything about LIET!</p>
        </div>
        <button id="chat-close" onclick="closeChat()">✕</button>
      </div>

      <div id="chat-messages">
        <!-- Welcome message -->
      </div>

      <div id="quick-suggestions">
        <button class="suggestion-btn" onclick="sendSuggestion('What courses are available?')">📚 Courses</button>
        <button class="suggestion-btn" onclick="sendSuggestion('What is the fee?')">💰 Fees</button>
        <button class="suggestion-btn" onclick="sendSuggestion('Who is the principal?')">👨‍💼 Principal</button>
        <button class="suggestion-btn" onclick="sendSuggestion('College timings')">🕐 Timings</button>
      </div>

      <div id="chat-input-area">
        <input
          type="text"
          id="chat-input"
          placeholder="Type your question..."
          onkeypress="handleKey(event)"
        />
        <button id="chat-send" onclick="sendMessage()">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
          </svg>
        </button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML('beforeend', botHTML);
}

// ---- Initialize Bot ----
document.addEventListener('DOMContentLoaded', async () => {
  createBotHTML();
  await loadBotData();

  // Show welcome message
  setTimeout(() => {
    addMessage("👋 Hello! Welcome to Lendi Institute of Engineering and Technology (LIET)!\n\nI'm your college assistant bot. Ask me anything about courses, fees, departments, admissions, and more! 😊", 'bot');
  }, 500);
});