// Initialisation de la popup
document.addEventListener("DOMContentLoaded", async () => {
  const rulesList = document.getElementById("rules-list");
  const addForm = document.getElementById("add-rule-form");
  const sourceInput = document.getElementById("source-url");
  const destInput = document.getElementById("destination-url");
  const toggle = document.getElementById("toggle-extension");

  // Charge l'état du toggle et les règles
  async function load() {
    const { rules = [], enabled = true } = await chrome.storage.local.get(["rules", "enabled"]);
    toggle.checked = !!enabled;
    renderRules(rules);
  }

  // Affiche la liste des règles
  function renderRules(rules) {
    rulesList.innerHTML = "";
    rules.forEach((rule, idx) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="rule-source">${rule.source}</span>
        ➔
        <span class="rule-dest">${rule.destination}</span>
        <button class="delete-btn" data-idx="${idx}">✕</button>
      `;
      rulesList.appendChild(li);
    });
  }

  // Ajout d'une règle
  addForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const source = sourceInput.value.trim();
    const destination = destInput.value.trim();
    if (!source || !destination) return;

    let { rules = [] } = await chrome.storage.local.get("rules");
    rules.push({ source, destination });
    await chrome.storage.local.set({ rules });
    sourceInput.value = "";
    destInput.value = "";
    load();
  });

  // Suppression d'une règle
  rulesList.addEventListener("click", async (e) => {
    if (!e.target.classList.contains("delete-btn")) return;
    const idx = Number(e.target.dataset.idx);
    let { rules = [] } = await chrome.storage.local.get("rules");
    rules.splice(idx, 1);
    await chrome.storage.local.set({ rules });
    load();
  });

  // Activation/désactivation de l’extension
  toggle.addEventListener("change", async () => {
    await chrome.storage.local.set({ enabled: toggle.checked });
  });

  load();
});