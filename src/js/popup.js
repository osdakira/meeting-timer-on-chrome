import "../css/popup.css";
import "../css/icomoon.css";
import localStorage from "./localStorage";

function $(id) {
  return document.getElementById(id);
}

class MettingTimer {
  constructor() {
    this.$meetingTime = $("js-metting-time");
    this.$meetingTime.addEventListener("change", () => this.updateTimes());

    this.$playBtn = $("js-play");
    this.$playBtn.addEventListener("click", () => this.play());

    this.$stopBtn = $("js-stop");
    this.$stopBtn.addEventListener("click", () => this.stop());

    this.$pauseBtn = $("js-pause");
    this.$pauseBtn.addEventListener("click", () => this.pause());

    this.$issueTime = $("js-issue-time");
    this.$issueTime.addEventListener("change", () => this.updateTimes());

    this.$issueLoopBtn = $("js-loop");
    this.$issueLoopBtn.addEventListener("click", () => this.issueLloop());

    this.restoreTimes();
  }

  updateTimes() {
    localStorage.updateTimes({
      meetingTime: this.$meetingTime.value,
      issueTime: this.$issueTime.value,
    });
  }

  restoreTimes() {
    localStorage.getTimes().then((result) => {
      this.$meetingTime.value = result.meetingTime;
      this.$issueTime.value = result.issueTime;
    });
  }

  play() {
    localStorage.playNow();
    this.showPlayed();
    this.resetMessageToView();
  }

  showPlayed() {
    this.$playBtn.style.display = "none";
    this.$stopBtn.style.display = "block";
  }

  stop() {
    localStorage.stop();

    this.$playBtn.style.display = "block";
    this.$stopBtn.style.display = "none";
  }

  issueLloop() {
    localStorage.issueLloop();
  }

  resetMessageToView() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: "reset" });
    });
  }
}

function init() {
  const timer = new MettingTimer();
  localStorage.isPlayed((startTime) => {
    if(startTime) {
      timer.showPlayed();
    }
  });
}

init();
