function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

/* TOOL SEARCH */
document.getElementById("searchTools")?.addEventListener("input", function () {
  let value = this.value.toLowerCase();
  document.querySelectorAll(".tool-card").forEach(card => {
    card.style.display = card.innerText.toLowerCase().includes(value)
      ? "block"
      : "none";
  });
});
