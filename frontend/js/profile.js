window.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("helpflowUser"));
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  // DOM references
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

  // Load user data into form
  nameInput.value = user.name || "";
  roleInput.value = user.role || "End User";
  categoryInput.value = user.category || "";
  languageSelect.value = user.language || "";

  // Show/hide role-based buttons
  if (user.role === "admin") {
    adminLink.style.display = "inline-block";
  }
  if (user.role === "support") {
    agentLink.style.display = "inline-block";
  }

  // Show upgrade request button only if End User
  if (user.role === "End User") {
    upgradeBtn.style.display = "inline-block";
  } else {
    upgradeBtn.style.display = "none";
  }

  // Handle upgrade request
  upgradeBtn.addEventListener("click", () => {
    alert("Upgrade request sent to Admin.");
    upgradeBtn.disabled = true;
    upgradeBtn.innerText = "Request Sent";
  });

  // Enable name editing
  editNameBtn.addEventListener("click", () => {
    nameInput.removeAttribute("readonly");
    nameInput.focus();
  });

  // Profile image upload + preview
  profileInput.addEventListener("change", () => {
    const file = profileInput.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        profilePreview.src = e.target.result;
        profilePreview.style.display = "block";
        uploadText.style.display = "none";
      };
      reader.readAsDataURL(file);
    }
  });
});

// Logout function
function logout() {
  localStorage.removeItem("helpflowUser");
  window.location.href = "index.html";
}
