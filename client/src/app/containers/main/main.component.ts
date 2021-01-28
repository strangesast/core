import {
  HostListener,
  ChangeDetectorRef,
  Component,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';

import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-main',
  template: `
    <mat-sidenav-container>
      <mat-sidenav
        #snav
        [mode]="mobileQuery.matches ? 'over' : 'side'"
        [fixedInViewport]="mobileQuery.matches"
        [opened]="!mobileQuery.matches || opened"
        [disableClose]="!mobileQuery.matches"
      >
        <mat-toolbar>
          <app-brand></app-brand>
        </mat-toolbar>
        <mat-nav-list>
          <div>
            <a mat-list-item [routerLink]="['/timeclock']">Timeclock</a>
            <a mat-list-item [routerLink]="['/machines']">Machines</a>
            <a mat-list-item [routerLink]="['/schedule']">Schedule</a>
            <a mat-list-item [routerLink]="['/orders']">Orders</a>
            <a mat-list-item [routerLink]="['/inventory']">Inventory</a>
            <a mat-list-item [routerLink]="['/parts']">Parts</a>
            <a mat-list-item [routerLink]="['/graphs']">Graphs</a>
            <a mat-list-item [routerLink]="['/objects']">Objects</a>
            <ng-container *ngIf="user$ | async as user">
              <a
                mat-list-item
                [routerLink]="['/cameras']"
                *ngIf="userService.hasRole(user, 'isCameraViewer')"
                >Cameras</a
              >
              <a
                mat-list-item
                [routerLink]="['/admin', 'users']"
                *ngIf="userService.hasRole(user, 'isAdmin')"
                >Users</a
              >
            </ng-container>
            <!-- huh? <a mat-list-item [routerLink]="['/history']">History</a>-->
          </div>
          <div [ngClass]="navStickyClass" class="bottom">
            <a
              mat-list-item
              target="_blank"
              class="flex-between"
              rel="noopener noreferrer"
              href="http://odoo.direktforce.com"
            >
              Odoo<mat-icon>launch</mat-icon>
            </a>
            <a
              mat-list-item
              target="_blank"
              class="flex-between"
              rel="noopener noreferrer"
              href="http://git.direktforce.com/direktforce/programs"
            >
              Programs<mat-icon>launch</mat-icon>
            </a>
            <a
              mat-list-item
              target="_blank"
              class="flex-between"
              rel="noopener noreferrer"
              href="http://direktforce.github.io"
            >
              direktforce.com<mat-icon>launch</mat-icon>
            </a>
          </div>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <app-toolbar>
          <button
            type="button"
            *ngIf="mobileQuery.matches"
            mat-icon-button
            (click)="snav.toggle()"
          >
            <mat-icon>menu</mat-icon>
          </button>
          <div id="cdkPortalOutlet"></div>
          <span class="flex-spacer"></span>
        </app-toolbar>
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit, OnDestroy {
  opened = false;
  navStickyClass = 'bottomRelative';
  mobileQuery: MediaQueryList;
  private mobileQueryListener: () => void;

  user$ = this.userService.user$;

  constructor(
    public userService: UserService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
  }

  @HostListener('window:resize', ['$event'])
  getScreenHeight() {
    if (window.innerHeight <= 412) {
      this.navStickyClass = 'bottomRelative';
    } else {
      this.navStickyClass = 'bottomStick';
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
  }

  ngOnInit(): void {
    this.getScreenHeight();
  }
}
