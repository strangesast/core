import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { MainComponent } from '../containers/main/main.component';
import { SummaryPageComponent } from '../containers/summary-page/summary-page.component';
import { PersonPageComponent } from '../containers/person-page/person-page.component';
import { PersonListPageComponent } from '../containers/person-list-page/person-list-page.component';
import { OrderListPageComponent } from '../containers/order-list-page/order-list-page.component';
import { OrderPageComponent } from '../containers/order-page/order-page.component';
import { PartListPageComponent } from '../containers/part-list-page/part-list-page.component';
import { PartPageComponent } from '../containers/part-page/part-page.component';
import { CustomerListPageComponent } from '../containers/customer-list-page/customer-list-page.component';
import { InventoryPageComponent } from '../containers/inventory-page/inventory-page.component';
import { NotificationsPageComponent } from '../containers/notifications-page/notifications-page.component';
import { ActiveOrdersPageComponent } from '../containers/active-orders-page/active-orders-page.component';
import { CustomerPageComponent } from '../containers/customer-page/customer-page.component';
import { TimesheetPageComponent } from '../containers/timesheet-page/timesheet-page.component';
import { ForbiddenPageComponent } from '../containers/forbidden-page/forbidden-page.component';
import { NotFoundPageComponent } from '../containers/not-found-page/not-found-page.component';
import { SettingsPageComponent } from '../containers/settings-page/settings-page.component';
import { MachineStatusGridComponent } from '../containers/machine-status-grid/machine-status-grid.component';
import { SchedulePageComponent } from '../containers/schedule-page/schedule-page.component';

// guards
import { InitGuard } from '../guards/init.guard';
import { PersonPageGuard } from '../guards/person-page.guard';
import { RolesGuard } from '../modules/auth/guards/roles.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [InitGuard],
    component: MainComponent,
    children: [
      { path: '', component: SummaryPageComponent },
      { path: 'schedule', component: SchedulePageComponent },
      { path: 'orders', component: ActiveOrdersPageComponent },
      { path: 'orders/historical', component: OrderListPageComponent },
      { path: 'orders/:id', component: OrderPageComponent },
      { path: 'people', component: PersonListPageComponent },
      {
        path: 'people/:id',
        component: PersonPageComponent,
        canActivate: [PersonPageGuard],
        resolve: { data: PersonPageGuard },
      },
      { path: 'customers', component: CustomerListPageComponent },
      { path: 'customers/:id', component: CustomerPageComponent },
      { path: 'inventory', component: InventoryPageComponent },
      { path: 'parts', component: PartListPageComponent },
      { path: 'parts/:id', component: PartPageComponent },
      /* {path: 'history', component: MachinesPageComponent}, */
      { path: 'notifications', component: NotificationsPageComponent },
      {
        path: 'settings',
        canActivate: [RolesGuard],
        component: SettingsPageComponent,
        data: { roles: [] }, // just redirect to /login if no user
      },
      {
        path: 'timesheet',
        canActivate: [RolesGuard],
        component: TimesheetPageComponent,
        data: { roles: ['isPaidHourly'] },
      },
      {
        path: 'cameras',
        loadChildren: () =>
          import('./cameras/cameras.module').then((m) => m.CamerasModule),
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('./admin/admin.module').then((m) => m.AdminModule),
      },
      {
        path: 'timeclock',
        loadChildren: () =>
          import('./timeclock/timeclock.module').then((m) => m.TimeclockModule),
      },
      {
        path: 'machines',
        loadChildren: () =>
          import('./machines/machines.module').then((m) => m.MachinesModule),
      },
      {
        path: 'objects',
        loadChildren: () =>
          import('./objects/objects.module').then((m) => m.ObjectsModule),
      },
    ],
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'graphs',
    loadChildren: () =>
      import('./graphs/graphs.module').then((m) => m.GraphsModule),
  },
  { path: 'machine-status', component: MachineStatusGridComponent },
  { path: 'forbidden', component: ForbiddenPageComponent },
  { path: 'not-found', component: NotFoundPageComponent },
  { path: '**', component: NotFoundPageComponent },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { relativeLinkResolution: 'corrected' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
