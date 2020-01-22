import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
  <header>
    <a routerLink="/" class="brand">
      <span>CORE</span>
    </a>
    <div>
      <ul class="links">
        <li class="link"><a routerLink="/timesheet">Timesheet</a></li>
      </ul>
      <a mat-flat-button color="primary" routerLink="/login">Login</a>
    </div>
  </header>
  <div class="container">
    <router-outlet></router-outlet>
  </div>
  `,
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'CORE';
}
