const urlParams = new URLSearchParams(window.location.search);
const ticketId = parseInt(urlParams.get("id"));

const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
const user = JSON.parse(localStorage.getItem("helpflowUser"));

const ticket = tickets.find(t => t.id === ticketId);

if (!ticket) {
  alert("Ticket not found!");
  window.location.href = "dashboard.html";
}

// Render ticket info
document.getElementById("ticketTitle").innerText = ticket.title;
document.getElementById("ticketCategory").innerText = ticket.category;
document.getElementById("ticketStatus").innerText = ticket.status;
document.getElementById("ticketAuthor").innerText = ticket.author;
document.getElementById("ticketTags").innerText = ticket.tags.join(", ");

// Render conversation
function renderConversation() {
  const container = document.getElementById("conversationThread");
  container.innerHTML = "";

  ticket.conversation.forEach(msg => {
    const div = document.createElement("div");
    div.className = msg.sender === user.name ? "message user-msg" : "message agent-msg";
    div.innerHTML = `
      <strong>${msg.sender}</strong>
      <p>${msg.message}</p>
      <small>${new Date(msg.timestamp).toLocaleString()}</small>
    `;
    container.appendChild(div);
  });
}
renderConversation();

// Handle reply
document.getElementById("replyForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const message = document.getElementById("replyMessage").value.trim();
  if (!message) return;

  const newMessage = {
    sender: user.name,
    message: message,
    timestamp: new Date().toISOString()
  };

  ticket.conversation.push(newMessage);
  localStorage.setItem("tickets", JSON.stringify(tickets));

  renderConversation();
  this.reset();
});
