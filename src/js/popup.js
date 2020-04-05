import "../css/popup.css";
import "../css/icomoon.css";
import localStorage from "./localStorage";

function $(id) {
  return document.getElementById(id);
}

class MettingTimer {
  constructor() {
    this.$meetingTime = $("js-metting-time");
    this.$meetingTime.addEventListener("change", () => this.updateMeetingTime());
    this.restoreMeetingTime();

    // this.$issueTime = $("js-issue-time");
    // this.$issueTime.addEventListener("change", () => this.updateIssueTime());

    this.$playBtn = $("js-play");
    this.$playBtn.addEventListener("click", () => this.play());

    this.$stopBtn = $("js-stop");
    this.$stopBtn.addEventListener("click", () => this.stop());

    this.$pauseBtn = $("js-pause");
    this.$pauseBtn.addEventListener("click", () => this.pause());

    // this.$issueLoopBtn = $("js-loop");
    // this.$issueLoopBtn.addEventListener("click", () => this.issueLloop());
  }

  updateMeetingTime() {
    localStorage.setMeetingTime(this.$meetingTime.value);
  }

  restoreMeetingTime() {
    localStorage.getMeetingTime((meetingTime) => {
      if (meetingTime) {
        this.$meetingTime.value = meetingTime;
      }
    });
  }

  updateIssueTime() {
    localStorage.setIssueTime(this.$issueTime.value);
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
