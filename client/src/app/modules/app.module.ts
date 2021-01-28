import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PortalModule } from '@angular/cdk/portal';
import { StoreModule } from '@ngrx/store';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// modules
import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { GraphQLModule } from './graphql.module';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';

// ngrx
import { userReducer } from '../reducers/user.reducer';

// directives
import { PropertyValidatorDirective } from '../directives/property-validator.directive';

// components
import { AppComponent } from '../containers/app.component';
import { MainComponent } from '../containers/main/main.component';
import { SummaryPageComponent } from '../containers/summary-page/summary-page.component';
import { ActivityCountPreviewComponent } from '../components/activity-count-preview/activity-count-preview.component';
import { PersonPageComponent } from '../containers/person-page/person-page.component';
import { PersonListPageComponent } from '../containers/person-list-page/person-list-page.component';
import { OrderListPageComponent } from '../containers/order-list-page/order-list-page.component';
import { OrderPageComponent } from '../containers/order-page/order-page.component';
import { PartListPageComponent } from '../containers/part-list-page/part-list-page.component';
import { CustomerListPageComponent } from '../containers/customer-list-page/customer-list-page.component';
import { PartPageComponent } from '../containers/part-page/part-page.component';
import { ToolbarComponent } from '../components/toolbar/toolbar.component';
import { UserAccountPageComponent } from '../containers/user-account-page/user-account-page.component';
import { LayoutComponent } from '../containers/layout/layout.component';
import { InventoryPageComponent } from '../containers/inventory-page/inventory-page.component';
import { NotificationsPageComponent } from '../containers/notifications-page/notifications-page.component';
import { NotificationListComponent } from '../containers/notification-list/notification-list.component';
import { ActiveOrdersPageComponent } from '../containers/active-orders-page/active-orders-page.component';
import { CustomerPageComponent } from '../containers/customer-page/customer-page.component';
import { TimesheetPageComponent } from '../containers/timesheet-page/timesheet-page.component';
import { ForbiddenPageComponent } from '../containers/forbidden-page/forbidden-page.component';
import { NotFoundPageComponent } from '../containers/not-found-page/not-found-page.component';
import { SettingsPageComponent } from '../containers/settings-page/settings-page.component';
import { UserBadgeComponent } from '../components/user-badge/user-badge.component';
import { ColorInputComponent } from '../components/color-input/color-input.component';
import { TimecardComponent } from '../components/timecard/timecard.component';
import { MachineStatusGridComponent } from '../containers/machine-status-grid/machine-status-grid.component';
import { SchedulePageComponent } from '../containers/schedule-page/schedule-page.component';

@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SummaryPageComponent,
    ActivityCountPreviewComponent,
    PersonPageComponent,
    PersonListPageComponent,
    OrderListPageComponent,
    OrderPageComponent,
    PartListPageComponent,
    CustomerListPageComponent,
    PartPageComponent,
    ToolbarComponent,
    UserAccountPageComponent,
    LayoutComponent,
    InventoryPageComponent,
    NotificationsPageComponent,
    NotificationListComponent,
    ActiveOrdersPageComponent,
    CustomerPageComponent,
    PropertyValidatorDirective,
    TimesheetPageComponent,
    ForbiddenPageComponent,
    NotFoundPageComponent,
    SettingsPageComponent,
    UserBadgeComponent,
    ColorInputComponent,
    TimecardComponent,
    MachineStatusGridComponent,
    SchedulePageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    GraphQLModule,
    PortalModule,
    StoreModule.forRoot({ user: userReducer }),
    SharedModule,
    AuthModule.forRoot(),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
