import { Input, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notification-list',
  template: `
  <button
    mat-icon-button
    aria-label="Alerts"
    [matMenuTriggerFor]="menu">
    <mat-icon [matBadge]="notifications.length || null" matBadgePosition="after" matBadgeColor="accent">notifications</mat-icon>
  </button>
  <mat-menu #menu="matMenu" xPosition="before">
    <mat-action-list>
      <mat-list-item *ngFor="let notification of notifications">
        <span>{{notification.message}}</span>
        <button mat-icon-button (click)="dismiss(notification.id); $event.stopPropagation()"><mat-icon>close</mat-icon></button>
      </mat-list-item>
      <button mat-list-item *ngIf="notifications.length" (click)="dismissAll(); $event.stopPropagation()">Dismiss All</button>
    </mat-action-list>
    <a class="text" mat-menu-item [routerLink]="['/notifications']">All Notifications</a>
  </mat-menu>
  `,
  styleUrls: ['./notification-list.component.scss']
})
export class NotificationListComponent implements OnInit {

  @Input()
  notifications = [];


  constructor() { }

  ngOnInit(): void {
  }

  dismiss(id) {
    const i = this.notifications.findIndex(n => n.id === id);
    if (i > -1) {
      this.notifications.splice(i, 1);
    }
  }

  dismissAll() {
    this.notifications = [];
  }
}
