import localStorage from "./localStorage";

function renderTimerIfPlayed() {
  localStorage.isPlayed((startTime) => {
    if(startTime) {
      renderTimer();
    }
  });
}

function renderTimer() {
  const elementId = "com-github-osdakira-meeting-timer-on-chrome-injectedTimerElement";
  if (!document.getElementById(elementId)) {
    injectHtml("injectedTimerElement.html", elementId);
  }
}

async function injectHtml(resource, elementId) {
  const res = await fetch(chrome.runtime.getURL(resource), { method: "GET" });
  const htmlString = await res.text();
  const doc = new DOMParser().parseFromString(htmlString, "text/html");
  const node = doc.getElementById(elementId);
  const timerNode = node.firstElementChild;

  bindTimer(timerNode);

  document.body.appendChild(node);
}

function bindTimer(node) {
  window.setInterval(() => { updateTimer(node); }, 1000);
}

function updateTimer(node) {
  localStorage.getRestTime().then((timeString) => {
    node.textContent = timeString;
  });
}

chrome.runtime.onMessage.addListener((message) => {
  switch (message.type) {
  case 'reset':
    renderTimerIfPlayed();
    break;
  }

  return;
});

renderTimerIfPlayed();
