let tickets = [];
const ITEMS_PER_PAGE = 10;
let currentPage = 1;

// Fetch tickets from Flask backend on page load
window.addEventListener("DOMContentLoaded", async () => {
  try {
    const res = await fetch("/api/tickets");
    if (!res.ok) throw new Error("Failed to load tickets");
    tickets = await res.json();
    applyFilters();
  } catch (err) {
    console.error("Error fetching tickets:", err);
    document.getElementById("ticketList").innerHTML = "<p>Error loading tickets.</p>";
  }
});

// Render tickets with pagination
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
      <h3>${ticket.question}</h3>
      <div class="category"><strong>Category:</strong> ${ticket.category || 'General'}</div>
      <div class="author"><strong>Author:</strong> ${ticket.author || 'Unknown'}</div>
      <div class="status"><strong>Status:</strong> ${ticket.status || 'Open'}</div>
      <div class="tags"><strong>Tags:</strong> ${ticket.tags || 'N/A'}</div>
      <button class="toggle-convo" onclick="toggleConversation(${ticket.id})">Show Conversation</button>
      <div class="conversation" id="convo-${ticket.id}" style="display: none;">
        ${(ticket.replies || []).map(reply =>
          `<div class="chat"><strong>${reply.author}:</strong> ${reply.message}</div>`
        ).join("")}
      </div>
    `;

    list.appendChild(div);
  });

  renderPagination(filtered.length);
}

// Render pagination controls
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

// Toggle reply thread
function toggleConversation(ticketId) {
  const convo = document.getElementById(`convo-${ticketId}`);
  if (convo) {
    convo.style.display = convo.style.display === "none" ? "block" : "none";
  }
}

// Apply filters
function applyFilters() {
  const category = document.getElementById("categoryFilter").value;
  const sort = document.getElementById("sortFilter").value;
  const search = document.getElementById("searchBar").value.toLowerCase();

  let filtered = [...tickets];

  if (category) {
    filtered = filtered.filter(t => t.category === category);
  }

  if (search) {
    filtered = filtered.filter(t =>
      (t.question || '').toLowerCase().includes(search) ||
      (t.description || '').toLowerCase().includes(search) ||
      (t.tags || '').toLowerCase().includes(search)
    );
  }

  if (sort === "newest") {
    filtered = filtered.slice().reverse(); // Newest = last added first
  } else if (sort === "oldest") {
    filtered = filtered.slice(); // Natural order
  } else if (sort === "popular") {
    filtered.sort((a, b) => (b.replies?.length || 0) - (a.replies?.length || 0));
  }

  renderTickets(filtered);
}

// Filter event listeners
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
