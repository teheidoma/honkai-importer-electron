"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HonkaiDetector = void 0;
const child_process_1 = require("child_process");
const rxjs_1 = require("rxjs");
class HonkaiDetector {
    constructor() {
        this.count = 0;
        this.lastCount = 0;
        this.startedAt = new Date(0);
        this.timer = null;
    }
    start(win) {
        this.timer = setInterval(() => {
            this.countProccesses().subscribe(count => {
                this.count = count;
                if (this.count > this.lastCount) {
                    win.webContents.send('honkai-status', {
                        'event': 'started',
                    });
                    console.log(`started`);
                    this.startedAt = new Date();
                }
                else if (this.count < this.lastCount) {
                    win.webContents.send('honkai-status', {
                        'event': 'stopped',
                        'from': this.startedAt.getTime(),
                        'to': new Date().getTime()
                    });
                    console.log(`stopped`);
                    this.startedAt = new Date(0);
                }
                this.lastCount = this.count;
            });
        }, 5000);
    }
    stop() {
        if (this.timer) {
            this.timer.unref();
            clearInterval(this.timer);
        }
    }
    getCurrent() {
        return this.countProccesses();
    }
    countOccurrences(str, value) {
        const regExp = new RegExp(value, "gi");
        return (str.match(regExp) || []).length;
    }
    countProccesses() {
        return new rxjs_1.Observable((sub) => {
            (0, child_process_1.exec)('tasklist', (error, stdout, stderr) => {
                sub.next(this.countOccurrences(stdout, 'StarRail.exe'));
                sub.complete();
            });
        });
    }
}
exports.HonkaiDetector = HonkaiDetector;
//# sourceMappingURL=honkai-detector.js.map