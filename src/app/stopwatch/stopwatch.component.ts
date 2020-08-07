import { Component, OnInit, SimpleChanges } from '@angular/core';
import { fromEvent, interval, Subscription, Subject, NEVER } from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  scan,
  startWith,
  tap,
  switchMap,
  buffer,
} from 'rxjs/operators';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.scss'],
})
export class StopwatchComponent implements OnInit {
  counter$ = interval(1000);
  sub: Subscription;

  running = false;

  seconds;

  private counterSubject: Subject<{
    pause: boolean;
    counterValue?: number;
  }> = new Subject();

  constructor() {}

  private initializeCounter() {
    this.counterSubject
      .pipe(
        startWith({ pause: true, counterValue: 0 }),
        scan((acc, val) => ({ ...acc, ...val })),
        tap((state) => {
          this.seconds = state.counterValue;
        }),
        switchMap((state) =>
          state.pause
            ? NEVER
            : interval(1000).pipe(
                tap(() => {
                  state.counterValue += 1;
                  this.seconds = state.counterValue;
                })
              )
        )
      )
      .subscribe();
  }

  start() {
    this.counterSubject.next({ pause: false });
  }

  stop() {
    this.counterSubject.next({ pause: true, counterValue: 0 });
  }

  reset() {
    this.counterSubject.next({ pause: false, counterValue: 0 });
  }

  wait() {
    const waitButton = document.querySelector('.double');
    const mouse$ = fromEvent(waitButton, 'click');

    const buff$ = mouse$.pipe(debounceTime(300));

    const click$ = mouse$.pipe(
      buffer(buff$),
      map((list) => list.length),
      filter((x) => x === 2)
    );

    click$.subscribe(() => this.counterSubject.next({ pause: true }));
  }

  ngOnInit(): void {
    this.initializeCounter();
  }
}
