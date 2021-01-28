import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications-page',
  template: `
    <app-page-title>
      <a routerLink="/notifications">Notifications</a>
    </app-page-title>
    <header>
      <h1>All Notifications</h1>
    </header>
  `,
  styleUrls: ['../../styles/base.scss', './notifications-page.component.scss'],
})
export class NotificationsPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
