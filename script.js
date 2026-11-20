const body = document.body;
const themeToggle = document.querySelector("#theme-toggle");
const scrollProgress = document.querySelector("#scroll-progress");
const sections = [...document.querySelectorAll(".section-anchor")];
const sideLinks = [...document.querySelectorAll(".side-link")];
const filterButtons = [...document.querySelectorAll(".filter-chip")];
const stackItems = [...document.querySelectorAll(".stack-item")];
const searchInput = document.querySelector("#stack-search");
const emptyIndex = document.querySelector("#empty-index");

const savedTheme = localStorage.getItem("asaad-hyperdocs-theme");
if (savedTheme === "light") body.classList.add("light-mode");
updateThemeLabel();

themeToggle.addEventListener("click", () => {
  body.classList.toggle("light-mode");
  localStorage.setItem("asaad-hyperdocs-theme", body.classList.contains("light-mode") ? "light" : "dark");
  updateThemeLabel();
});

function updateThemeLabel() {
  const light = body.classList.contains("light-mode");
  themeToggle.textContent = light ? "moon" : "sun";
  themeToggle.setAttribute("aria-label", light ? "Switch to dark theme" : "Switch to light theme");
  themeToggle.title = light ? "Switch to dark theme" : "Switch to light theme";
}

function updateScrollProgress() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  scrollProgress.style.width = `${Math.min(progress * 100, 100)}%`;
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    sideLinks.forEach((link) => link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`));
  });
}, { rootMargin: "-22% 0px -62% 0px" });

sections.forEach((section) => sectionObserver.observe(section));

function filterStack() {
  const active = document.querySelector(".filter-chip.is-active").dataset.filter;
  const query = searchInput.value.trim().toLowerCase();
  let visible = 0;
  stackItems.forEach((item) => {
    const inFilter = active === "all" || item.dataset.stack.split(" ").includes(active);
    const inSearch = !query || item.dataset.name.includes(query);
    const show = inFilter && inSearch;
    item.hidden = !show;
    if (show) visible += 1;
  });
  emptyIndex.hidden = visible > 0;
}

filterButtons.forEach((button) => button.addEventListener("click", () => {
  filterButtons.forEach((item) => item.classList.toggle("is-active", item === button));
  filterStack();
}));
searchInput.addEventListener("input", filterStack);

document.addEventListener("keydown", (event) => {
  if (event.key === "/" && document.activeElement !== searchInput) {
    event.preventDefault();
    searchInput.focus();
  }
});

const copyButton = document.querySelector("#copy-email");
const copyLabel = document.querySelector("#copy-label");
copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText("assaad2005.fet@gmail.com");
    copyLabel.textContent = "ok";
    setTimeout(() => { copyLabel.textContent = "+"; }, 1600);
  } catch {
    copyLabel.textContent = "!";
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();
