// Dummy Ticket Data
let tickets = [
  {
    id: 1,
    title: "Unable to login after password reset",
    category: "Login",
    votes: 5,
    conversation: [
      { sender: "user", message: "I reset my password but still can't login." },
      { sender: "support", message: "We are checking this issue." }
    ]
  },
  {
    id: 2,
    title: "Billing not updating after renewal",
    category: "Billing",
    votes: 12,
    conversation: [
      { sender: "user", message: "Renewed subscription but still showing expired." },
      { sender: "support", message: "Can you send us the transaction ID?" }
    ]
  },
  // Add more tickets if needed
];

const ITEMS_PER_PAGE = 10;
let currentPage = 1;

function renderTickets(filtered = tickets) {
  const list = document.getElementById("ticketList");
  list.innerHTML = "";

  const start = (currentPage - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const pageTickets = filtered.slice(start, end);

  if (pageTickets.length === 0) {
    list.innerHTML = "<p>No tickets found.</p>";
    return;
  }

  pageTickets.forEach(ticket => {
    const div = document.createElement("div");
    div.classList.add("ticket");

    div.innerHTML = `
      <h3>${ticket.title}</h3>
      <div class="category">Category: ${ticket.category}</div>
      <div class="votes">Votes: ${ticket.votes}</div>
      <button class="toggle-convo" onclick="toggleConversation(${ticket.id})">Show Conversation</button>
      <div class="conversation" id="convo-${ticket.id}">
        ${ticket.conversation.map(chat =>
          `<div class="chat ${chat.sender}"><strong>${chat.sender}:</strong> ${chat.message}</div>`
        ).join("")}
      </div>
    `;

    list.appendChild(div);
  });

  renderPagination(filtered.length);
}

function renderPagination(totalItems) {
  const pages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const container = document.getElementById("pagination");
  container.innerHTML = "";

  for (let i = 1; i <= pages; i++) {
    const btn = document.createElement("span");
    btn.classList.add("page");
    if (i === currentPage) btn.classList.add("active");
    btn.textContent = i;
    btn.onclick = () => {
      currentPage = i;
      applyFilters();
    };
    container.appendChild(btn);
  }
}

function toggleConversation(ticketId) {
  const convo = document.getElementById(`convo-${ticketId}`);
  convo.style.display = convo.style.display === "none" || convo.style.display === "" ? "block" : "none";
}

function applyFilters() {
  const category = document.getElementById("categoryFilter").value;
  const sort = document.getElementById("sortFilter").value;
  const search = document.getElementById("searchBar").value.toLowerCase();

  let filtered = [...tickets];

  if (category) {
    filtered = filtered.filter(t => t.category === category);
  }

  if (search) {
    filtered = filtered.filter(t => t.title.toLowerCase().includes(search));
  }

  if (sort === "newest") {
    filtered.reverse();
  } else if (sort === "popular") {
    filtered.sort((a, b) => b.votes - a.votes);
  }

  renderTickets(filtered);
}

// Event Listeners
document.getElementById("categoryFilter").addEventListener("change", () => {
  currentPage = 1;
  applyFilters();
});
document.getElementById("sortFilter").addEventListener("change", () => {
  currentPage = 1;
  applyFilters();
});
document.getElementById("searchBar").addEventListener("input", () => {
  currentPage = 1;
  applyFilters();
});

// Initial Load
renderTickets();
