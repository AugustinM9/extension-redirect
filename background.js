// Gestion de la redirection
chrome.webNavigation.onCompleted.addListener(async (details) => {
  const { url, tabId, frameId } = details;
  if (frameId !== 0) return; // On ne traite que le frame principal

  const { rules = [], enabled = true } = await chrome.storage.local.get(["rules", "enabled"]);
  if (!enabled) return;

  const match = rules.find(rule => rule.source === url);
  if (match && match.destination) {
    chrome.tabs.update(tabId, { url: match.destination });
  }
}, { url: [{ urlMatches: '.*' }] });