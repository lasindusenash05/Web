let messages = [];
let roleSet = false;

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");

function appendMessage(text, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;
  messageDiv.innerText = text;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function startRoleplay() {
  const character = document.getElementById("character-input").value.trim();
  if (!character) return alert("Please enter a character.");

  const intro = `This is a roleplay conversation. Imagine you are ${character} and let's continue the chat.`;
  messages.push(intro);

  document.getElementById("welcome").style.display = "none";
  document.getElementById("chat-ui").style.display = "block";
  document.getElementById("title").innerText = `🎭 You are: ${character}`;

  appendMessage(`You are now playing as ${character}.`, "bot");

  roleSet = true;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  appendMessage(text, "user");
  userInput.value = "";

  messages.push(text);
  appendMessage("Typing...", "bot");

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });

  const data = await response.json();
  const reply = data.reply || "I couldn't respond.";

  // Remove "Typing..."
  const botTyping = document.querySelector(".bot:last-child");
  if (botTyping) botTyping.remove();

  appendMessage(reply, "bot");
  messages.push(reply);

  const utter = new SpeechSynthesisUtterance(reply);
  speechSynthesis.speak(utter);
}

function startVoiceInput() {
  const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = "en-US";
  recognition.interimResults = false;

  recognition.onresult = (e) => {
    const transcript = e.results[0][0].transcript;
    userInput.value = transcript;
    sendMessage();
  };

  recognition.onerror = (e) => alert("Voice error: " + e.error);
  recognition.start();
    }
