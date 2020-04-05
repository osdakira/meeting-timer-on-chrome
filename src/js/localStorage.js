class LocalStorage {
  playNow() {
    this.set("meetingStartAt", Date.now());
    this.set("issueStartAt", Date.now());
  }
  stop() {
    this.set("meetingStartAt", null);
    this.set("issueStartAt", null);
  }
  isPlayed(callback) {
    this.get("meetingStartAt", callback);
  }

  issueLloop() {
    this.set("issueStartAt", Date.now());
  }

  updateTimes(times) {
    this.setLocalStorage({
      meetingTime: times.meetingTime,
      issueTime: times.issueTime,
    });
  }

  async getTimes() {
    const result = await this.getLocalStorage();
    return {
      meetingTime: result["meetingTime"] ? result["meetingTime"] : "",
      issueTime: result["issueTime"] ? result["issueTime"] : "",
    };
  }

  async getRestTime() {
    const meetingStartMSec = await this.getLocalStorage("meetingStartAt");
    const meetingTimeString = await this.getLocalStorage("meetingTime");
    const restMeetingTime = this.calcRestEndMSec(meetingStartMSec, meetingTimeString);

    const issueStartMSec = await this.getLocalStorage("issueStartAt");
    const issueTimeString = await this.getLocalStorage("issueTime");
    const restIssueTime = this.calcRestEndMSec(issueStartMSec, issueTimeString);

    return {
      restMeetingTime: restMeetingTime.restTime,
      restMeetingRatio: restMeetingTime.restRatio,
      restIssueTime: restIssueTime.restTime,
      restIssueRatio: restIssueTime.restRatio,
    };
  }

  calcRestEndMSec(startMSec, timeString) {
    if (!timeString) {
      return {
        restTime: "",
        restRatio: 0,
      };
    }

    const mSec = this.toMSec(timeString);
    const endMSec = startMSec + mSec;
    const restEndMSec = endMSec - Date.now();
    return {
      restTime: this.toHHMMSS(restEndMSec / 1000),
      restRatio: (restEndMSec / mSec * 100),
    };
  }

  toMSec(timeString) {
    const hms = timeString.split(':');
    const seconds = (+hms[0]) * 60 * 60 + (+hms[1]) * 60 + (+hms[2]);
    return seconds * 1000;
  }

  toHHMMSS(sec) {
    // Copy from https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss
    var sec_num = parseInt(sec, 10);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (-10 < hours && hours   < 0) { hours   = "-0" + -hours; }
    if (0 <= hours && hours   < 10) { hours   = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
  }

  set(key, val, callback) {
    chrome.storage.local.set({ [key]: val }, callback);
  }

  get(key, callback) {
    chrome.storage.local.get([key], (result) => {
      callback(result[key]);
    });
  }

  setLocalStorage(obj) {
    return new Promise((resolve) => {
      chrome.storage.local.set(obj, () => resolve());
    });
  }

  getLocalStorage(key = null) {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (item) => {
        key ? resolve(item[key]) : resolve(item);
      });
    });
  }
}

export default new LocalStorage();
