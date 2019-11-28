import { Component, OnInit } from '@angular/core';
// import { timer, from , concat, of} from 'rxjs';
// import { map, concatMap, filter, take, switchMap, tap, delay, skip } from 'rxjs/operators'
// import { Observable } from 'rxjs';
// import { BehaviorSubject } from 'rxjs';

import { fromEvent, Observable, Subscription } from 'rxjs';



import { concatMap, map, merge, switchMap } from 'rxjs/operators';
import { timer, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'polling';
  yes: number;
  no: number;
  data;
  polled$: Observable<any>;
  load$ = new BehaviorSubject('');

  constructor(private http: HttpClient) {

  }
  ngOnInit() {
    this.data = localStorage.getItem('data');
    console.log(this.data);

    const url$ = this.http.get('http://localhost:3000/poll/');
    this.polled$ = this.load$.pipe(
      switchMap(_ => timer(0, 2000).pipe(
        concatMap(_ => url$),
        map((response: any) => {
          console.log(response);
          this.yes = response.yes;
          this.no = response.no;
        }),
      )
      )
    );
  }

  handlePoll(val) {
    this.http.post(`http://localhost:3000/poll/${val}`, {})
      .subscribe((response: any) => {
        console.log(response);
        localStorage.setItem('data', JSON.stringify(response));
        this.yes = response.yes;
        this.no = response.no;
        this.data = response;
      })
  }
}