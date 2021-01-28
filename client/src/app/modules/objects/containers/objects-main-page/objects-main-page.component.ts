import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-objects-main-page',
  template: `
    <app-page-title>
      <a [routerLink]="['/objects']">Objects</a>
    </app-page-title>
    <header>
      <h1>Objects</h1>
    </header>
    <app-production-schedule></app-production-schedule>
  `,
  styleUrls: ['./objects-main-page.component.scss'],
})
export class ObjectsMainPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
