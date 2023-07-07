import {exec} from "child_process";
import {BrowserWindow} from "electron";
import {Observable} from "rxjs";


export class HonkaiDetector {
  private count = 0;
  private lastCount = 0;
  private startedAt = new Date(0);


  public start(win: BrowserWindow) {
    setInterval(() => {
      this.countProccesses().subscribe(count => {
        this.count = count;
        if (this.count > this.lastCount) {
          win.webContents.send('honkai-status', {
            'event': 'started',
          })
          console.log(`started`)
          this.startedAt = new Date()
        } else if (this.count < this.lastCount) {
          win.webContents.send('honkai-status', {
            'event': 'stopped',
            'from': this.startedAt.getTime(),
            'to': new Date().getTime()
          })
          console.log(`stopped`)
          this.startedAt = new Date(0)
        }
        this.lastCount = this.count
      })
    }, 5000)
  }

  public getCurrent(): Observable<number> {
    return this.countProccesses()
  }

  private countOccurrences(str: string, value: string) {
    const regExp = new RegExp(value, "gi");
    return (str.match(regExp) || []).length;
  }

  private countProccesses(): Observable<number> {
    return new Observable<number>((sub) => {
      exec('tasklist', (error, stdout, stderr) => {
        sub.next(this.countOccurrences(stdout, 'StarRail.exe'));
        sub.complete();
      });
    });
  }
}

