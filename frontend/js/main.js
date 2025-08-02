// Ensure all button links work properly even if browser blocks default behavior
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".btn");

  buttons.forEach(button => {
    button.addEventListener("click", function (e) {
      const target = this.getAttribute("href");
      if (target) {
        window.location.href = target;
      }
    });
  });
});
