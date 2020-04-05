class LocalStorage {
  setMeetingTime(timeString) {
    this.set("MeetingTime", timeString);
  }
  getMeetingTime(callback) {
    this.get("MeetingTime", callback);
  }

  playNow() {
    this.set("play", Date.now());
  }
  stop() {
    this.set("play", null);
  }
  isPlayed(callback) {
    this.get("play", callback);
  }

  async getRestTime() {
    const startMilliseconds = await this.getLocalStorage("play");
    if(!startMilliseconds) { return ""; }

    const meetingTimeString = await this.getLocalStorage("MeetingTime");
    if(!meetingTimeString) { return ""; }

    const hms = meetingTimeString.split(':');
    const seconds = (+hms[0]) * 60 * 60 + (+hms[1]) * 60 + (+hms[2]);
    const milliSeconds = seconds * 1000;

    const endMilliseconds = startMilliseconds + milliSeconds;

    const restMilliseconds = endMilliseconds - Date.now();
    return this.toHHMMSS(restMilliseconds / 1000);
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

  getLocalStorage(key = null) {
    return new Promise((resolve) => {
      chrome.storage.local.get(key, (item) => {
        key ? resolve(item[key]) : resolve(item);
      });
    });
  }
}

export default new LocalStorage();
