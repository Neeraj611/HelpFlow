// Placeholder arrays (fetch or manage from backend/localStorage)
const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
const promotionRequests = JSON.parse(localStorage.getItem("promotionRequests")) || [];
const agents = JSON.parse(localStorage.getItem("agents")) || [];
const users = JSON.parse(localStorage.getItem("users")) || [];

window.addEventListener("DOMContentLoaded", () => {
  updateStats();
  renderPromotions();
  renderAgents();
  renderUsers();
  renderRoleManagement();
  renderCategoryList();
});

// Ticket Stats
function updateStats() {
  document.getElementById("total").textContent = tickets.length;
  document.getElementById("open").textContent = tickets.filter(t => t.status === "Open").length;
  document.getElementById("closed").textContent = tickets.filter(t => t.status === "Closed").length;
  document.getElementById("solved").textContent = tickets.filter(t => t.solved).length;
  document.getElementById("unsolved").textContent = tickets.filter(t => !t.solved).length;
}

// Render Promotion Requests
function renderPromotions() {
  const list = document.getElementById("promotionList");
  list.innerHTML = "";

  promotionRequests.forEach(req => {
    const card = document.createElement("div");
    card.className = "promo-card";
    card.innerHTML = `
      <p><strong>Name:</strong> ${req.name}</p>
      <p><strong>Email:</strong> ${req.email}</p>
      <p><strong>Current Role:</strong> ${req.role}</p>

      <label for="role-select-${req.email}">Assign New Role:</label>
      <select id="role-select-${req.email}" class="role-select">
        <option value="End User">End User</option>
        <option value="Support Agent">Support Agent</option>
        <option value="Admin">Admin</option>
      </select>

      <button class="assign-role-btn" onclick="approvePromotion('${req.email}')">Confirm Role</button>
    `;
    list.appendChild(card);
  });
}

function approvePromotion(email) {
  const newRole = document.getElementById(`role-select-${email}`).value;
  let user = users.find(u => u.email === email);
  if (user) {
    user.role = newRole;
    localStorage.setItem("users", JSON.stringify(users));
    alert(`${email} promoted to ${newRole}`);
    renderUsers();
    renderRoleManagement();
  }
}

// Render Support Agents
function renderAgents() {
  const tbody = document.getElementById("agentTable");
  tbody.innerHTML = "";

  agents.forEach(agent => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${agent.name}</td>
      <td>${agent.email}</td>
      <td>${agent.password}</td>
    `;
    tbody.appendChild(row);
  });
}

// Render Users
function renderUsers() {
  const tbody = document.getElementById("userTable");
  tbody.innerHTML = "";

  users.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.password}</td>
      <td>${user.role}</td>
    `;
    tbody.appendChild(row);
  });
}

// Render Role Management Section
function renderRoleManagement() {
  const tbody = document.getElementById("roleTable");
  if (!tbody) return;

  tbody.innerHTML = "";

  users.forEach(user => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>${user.role}</td>
      <td>
        <select onchange="changeUserRole('${user.email}', this.value)" class="role-select">
          <option value="End User" ${user.role === "End User" ? "selected" : ""}>End User</option>
          <option value="Support Agent" ${user.role === "Support Agent" ? "selected" : ""}>Support Agent</option>
          <option value="Admin" ${user.role === "Admin" ? "selected" : ""}>Admin</option>
        </select>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function changeUserRole(email, newRole) {
  const user = users.find(u => u.email === email);
  if (user) {
    user.role = newRole;
    localStorage.setItem("users", JSON.stringify(users));
    alert(`${user.name} updated to ${newRole}`);
    renderUsers();
  }
}

// -------- CATEGORY MANAGEMENT --------
let categories = JSON.parse(localStorage.getItem("categories")) || [];

function renderCategoryList() {
  const list = document.getElementById("categoryList");
  if (!list) return;

  list.innerHTML = "";
  categories.forEach((cat, i) => {
    const li = document.createElement("li");
    li.innerHTML = `
      ${cat} <button onclick="deleteCategory(${i})" style="margin-left:10px; color:red;">✖</button>
    `;
    list.appendChild(li);
  });
}

document.getElementById("addCategoryBtn")?.addEventListener("click", () => {
  const input = document.getElementById("newCategory");
  const value = input.value.trim();
  if (value && !categories.includes(value)) {
    categories.push(value);
    localStorage.setItem("categories", JSON.stringify(categories));
    renderCategoryList();
    input.value = "";
  } else {
    alert("Category is empty or already exists.");
  }
});

function deleteCategory(index) {
  categories.splice(index, 1);
  localStorage.setItem("categories", JSON.stringify(categories));
  renderCategoryList();
}
