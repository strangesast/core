import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-schedule-page',
  template: `
    <app-page-title>
      <a routerLink="/schedule">Schedule</a>
    </app-page-title>
    <div class="container">
      <table mat-table [dataSource]="data">
        <ng-container matColumnDef="category" [sticky]="true">
          <th mat-header-cell *matHeaderCellDef><span>Categories</span></th>
          <td mat-cell *matCellDef="let element">{{ element.category }}</td>
          <td mat-footer-cell *matFooterCellDef></td>
        </ng-container>

        <ng-container
          *ngFor="let component of components"
          [matColumnDef]="component.id"
        >
          <th mat-header-cell *matHeaderCellDef>
            <span>{{ component.name }}</span>
          </th>
          <td mat-cell *matCellDef="let element">
            <mat-icon>check_circle_outline</mat-icon>
          </td>
          <td mat-footer-cell *matFooterCellDef>foot</td>
        </ng-container>

        <tr
          mat-header-row
          *matHeaderRowDef="displayedColumns; sticky: true"
        ></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        <tr mat-footer-row *matFooterRowDef="displayedColumns"></tr>
      </table>
    </div>
  `,
  styleUrls: ['./schedule-page.component.scss'],
})
export class SchedulePageComponent implements OnInit {
  components = Array.from(Array(10)).map((_, i) => {
    const name = `Component ${i + 1}`;
    const id = name.split(' ').join('-').toLowerCase();
    return { id, name };
  });

  categories = Array.from(Array(8)).map((_, i) => `category-${i + 1}`);

  displayedColumns = ['category', ...this.components.map((c) => c.id)];

  data = this.categories.map((category) => ({
    category,
    ...this.components.reduce((acc, c) => ({ ...acc, [c.id]: 'toast' }), {}),
  }));

  constructor() {}

  ngOnInit(): void {}
}
