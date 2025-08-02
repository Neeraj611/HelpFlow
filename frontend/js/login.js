// login.js (on successful login)
const user = {
  name: "Samarth Bhatt",
  email: "samarth@example.com",
  role: "admin" // or "support" or "user"
};

localStorage.setItem("helpflowUser", JSON.stringify(user));
window.location.href = "profile.html";