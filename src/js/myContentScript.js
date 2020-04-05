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

  bindTimer(node);

  document.body.appendChild(node);
}

function bindTimer(node) {
  const nodes = node.getElementsByTagName("div");
  window.setInterval(() => { updateTimer(nodes); }, 1000);
}

function updateTimer(nodes) {
  localStorage.getRestTime().then((times) => {
    nodes[0].textContent = times.restMeetingTime;
    nodes[0].style.background = makeBackground(times.restMeetingRatio);

    nodes[1].textContent = times.restIssueTime;
    nodes[1].style.background = makeBackground(times.restIssueRatio);
  });
}

function makeBackground(ratio) {
  if(ratio <= 10) { return "#f33"; }
  if(ratio <= 20) { return "#ff3"; }
  return "#3f3";
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
