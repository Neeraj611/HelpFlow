document.getElementById("createTicketForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("helpflowUser"));
  if (!user) {
    alert("User not logged in.");
    return;
  }

  const question = document.getElementById("question").value.trim();
  const description = document.getElementById("description").value.trim();
  const tags = document.getElementById("tags").value.split(",").map(t => t.trim()).filter(Boolean);
  const category = document.getElementById("category")?.value || "General";

  const ticket = {
    id: Date.now(),
    title: question,
    description,
    tags,
    category,
    status: "Open",
    upvotes: 0,
    comments: 0,
    author: user.name,
    email: user.email,
    assigned: "Unassigned",
    createdAt: new Date().toISOString(),
    conversation: [
      { sender: "User", message: description, timestamp: new Date().toISOString() }
    ]
  };

  const tickets = JSON.parse(localStorage.getItem("tickets")) || [];
  tickets.push(ticket);
  localStorage.setItem("tickets", JSON.stringify(tickets));

  alert("Ticket submitted successfully!");
  this.reset();
  window.location.href = "dashboard.html";
});
