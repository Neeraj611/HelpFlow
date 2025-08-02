const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

// Guard: Support Agent only
if (!loggedInUser || loggedInUser.role !== "Support Agent") {
  alert("Access denied. Support Agents only.");
  window.location.href = "index.html";
}

// Sample ticket storage (replace with real backend/API/localStorage)
let tickets = [
  {
    id: 1,
    title: "Reset Password",
    category: "Technical",
    createdBy: "Samarth",
    assignedTo: "Agent A",
    conversation: [{ sender: "user", text: "How do I reset my password?" }],
    solved: false
  },
  {
    id: 2,
    title: "Billing Issue",
    category: "Billing",
    createdBy: "Raj",
    assignedTo: null,
    conversation: [],
    solved: false
  }
];

window.addEventListener("DOMContentLoaded", () => {
  renderTabs();
  renderTickets();
  handleCreateTicket();
});

// Tab switching
function renderTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");
  tabs.forEach(btn => {
    btn.addEventListener("click", () => {
      tabs.forEach(b => b.classList.remove("active"));
      contents.forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });
}

// Ticket rendering
function renderTickets() {
  const my = document.getElementById("myTickets");
  const all = document.getElementById("allTickets");
  my.innerHTML = "";
  all.innerHTML = "";

  tickets.forEach(ticket => {
    const html = `
      <div class="ticket-card">
        <h4>${ticket.title}</h4>
        <p><strong>Category:</strong> ${ticket.category}</p>
        <p><strong>Created by:</strong> ${ticket.createdBy}</p>
        <p><strong>Assigned to:</strong> ${ticket.assignedTo ?? "Unassigned"}</p>
        <div class="conversation">
          ${ticket.conversation.map(c => `<div><strong>${c.sender}:</strong> ${c.text}</div>`).join("")}
        </div>
        <textarea placeholder="Reply..."></textarea>
        <button onclick="sendReply(${ticket.id}, this)">Reply</button>
        <button onclick="shareTicket(${ticket.id})" class="share">Share</button>
        <button onclick="markSolved(${ticket.id})" class="mark">Mark Solved</button>
      </div>
    `;
    all.innerHTML += html;
    if (ticket.assignedTo === loggedInUser.name) {
      my.innerHTML += html;
    }
  });
}

// Reply to ticket
function sendReply(id, btn) {
  const textarea = btn.previousElementSibling;
  const msg = textarea.value.trim();
  if (!msg) return alert("Write a message first.");
  tickets.find(t => t.id === id).conversation.push({ sender: "support", text: msg });
  textarea.value = "";
  renderTickets();
}

// Share ticket (dummy)
function shareTicket(id) {
  alert(`Ticket #${id} shared.`);
}

// Mark as Solved
function markSolved(id) {
  tickets.find(t => t.id === id).solved = true;
  alert("Ticket marked as solved.");
  renderTickets();
}

// Create new ticket
function handleCreateTicket() {
  const form = document.getElementById("createTicketForm");
  form.addEventListener("submit", e => {
    e.preventDefault();
    const newTicket = {
      id: tickets.length + 1,
      title: form.title.value,
      category: form.category.value,
      createdBy: loggedInUser.name,
      assignedTo: null,
      conversation: [],
      solved: false
    };
    tickets.push(newTicket);
    alert("Ticket submitted.");
    form.reset();
    renderTickets();
    document.querySelector('[data-tab="my"]').click(); // Switch to My Tickets
  });
}
