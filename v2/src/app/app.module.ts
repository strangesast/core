import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MaterialModule } from './material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MainComponent } from './main/main.component';
import { SummaryPageComponent } from './summary-page/summary-page.component';
import { TimeclockPageComponent } from './timeclock-page/timeclock-page.component';
import { MachinesPageComponent } from './machines-page/machines-page.component';
import { ActivityCountPreviewComponent } from './activity-count-preview/activity-count-preview.component';
import { MachinePageComponent } from './machine-page/machine-page.component';
import { MapViewerComponent } from './map-viewer/map-viewer.component';
import { PersonPageComponent } from './person-page/person-page.component';
import { PersonListPageComponent } from './person-list-page/person-list-page.component';
import { OrderListPageComponent } from './order-list-page/order-list-page.component';
import { OrderPageComponent } from './order-page/order-page.component';
import { GraphQLModule } from './graphql.module';
import { PartListPageComponent } from './part-list-page/part-list-page.component';
import { CustomerListPageComponent } from './customer-list-page/customer-list-page.component';
import { PartPageComponent } from './part-page/part-page.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { UserAccountPageComponent } from './user-account-page/user-account-page.component';
import { TimeclockTableComponent } from './timeclock-table/timeclock-table.component';
import { TimeclockStaggeredComponent } from './timeclock-staggered/timeclock-staggered.component';
import { TimeclockDatepickerComponent } from './timeclock-datepicker/timeclock-datepicker.component';
import { PieComponent } from './pie/pie.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    SummaryPageComponent,
    TimeclockPageComponent,
    MachinesPageComponent,
    ActivityCountPreviewComponent,
    MachinePageComponent,
    MapViewerComponent,
    PersonPageComponent,
    PersonListPageComponent,
    OrderListPageComponent,
    OrderPageComponent,
    PartListPageComponent,
    CustomerListPageComponent,
    PartPageComponent,
    ToolbarComponent,
    LoginPageComponent,
    UserAccountPageComponent,
    TimeclockTableComponent,
    TimeclockStaggeredComponent,
    TimeclockDatepickerComponent,
    PieComponent
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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
