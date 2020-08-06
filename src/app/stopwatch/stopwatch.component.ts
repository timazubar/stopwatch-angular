import { Component, OnInit, SimpleChanges } from '@angular/core';
import { interval, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss'],
})
export class StopwatchComponent implements OnInit {
  counter$ = interval(1000);
  sub: Subscription;

  hours = 0;
  minutes = 0;
  seconds;

  constructor() {}

  start() {
    if (!this.sub) {
      this.sub = this.counter$
        .pipe(
          map((value) => (value < 10 ? '0' + value : value)),
          map((seconds) => (seconds > 60 ? this.minutes++ : seconds))
        )
        .subscribe((sec) => (this.seconds = sec));
      console.log(this.sub);
    } else {
      this.sub.closed = false;
    }
  }

  stop() {
    if (this.sub) {
      console.log(this.sub);
      this.sub.unsubscribe();
    }
  }

  reset() {
    this.stop();
    this.start();
  }

  wait() {
    this.stop();
  }

  ngOnInit(): void {}
}
