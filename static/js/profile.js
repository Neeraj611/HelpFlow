window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("helpflowUser"));
  if (!user) {
    window.location.href = "/login";
    return;
  }

  // DOM Elements
  const nameInput = document.getElementById("name");
  const roleInput = document.getElementById("role");
  const categoryInput = document.getElementById("category");
  const languageSelect = document.getElementById("language");
  const upgradeBtn = document.getElementById("upgradeBtn");
  const editNameBtn = document.getElementById("editNameBtn");
  const profileInput = document.getElementById("uploadProfile");
  const profilePreview = document.getElementById("profilePreview");
  const uploadText = document.querySelector(".upload-text");
  const adminLink = document.getElementById("adminLink");
  const agentLink = document.getElementById("agentLink");

  // Populate fields
  nameInput.value = user.name || "";
  roleInput.value = user.role || "End User";
  categoryInput.value = user.category || "";
  languageSelect.value = user.language || "";

  const role = (user.role || "").toLowerCase();

  // Role-based access
  if (role === "admin") {
    adminLink.style.display = "inline-block";
  } else if (role === "support agent" || role === "agent") {
    agentLink.style.display = "inline-block";
  }

  // Show upgrade button only for End Users
  if (role === "end user" || role === "") {
    upgradeBtn.style.display = "inline-block";
  }

  // Handle upgrade request
  upgradeBtn?.addEventListener("click", () => {
    alert("Upgrade request sent to Admin.");
    upgradeBtn.disabled = true;
    upgradeBtn.innerText = "Request Sent";

    // Optional: Store request in localStorage
    const requests = JSON.parse(localStorage.getItem("promotionRequests")) || [];
    requests.push({ name: user.name, email: user.email, role: user.role });
    localStorage.setItem("promotionRequests", JSON.stringify(requests));
  });

  // Enable name editing
  editNameBtn?.addEventListener("click", () => {
    nameInput.removeAttribute("readonly");
    nameInput.focus();
  });

  // Save on field change
  [nameInput, categoryInput, languageSelect].forEach(input => {
    input?.addEventListener("change", () => {
      user.name = nameInput.value;
      user.category = categoryInput.value;
      user.language = languageSelect.value;
      localStorage.setItem("helpflowUser", JSON.stringify(user));
    });
  });

  // Profile picture preview
  profileInput?.addEventListener("change", () => {
    const file = profileInput.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = e => {
        profilePreview.src = e.target.result;
        profilePreview.style.display = "block";
        uploadText.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });
});

// Logout
function logout() {
  localStorage.removeItem("helpflowUser");
  window.location.href = "/logout";
}
