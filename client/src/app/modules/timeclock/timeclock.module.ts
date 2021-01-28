import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material.module';

import { TimeclockPageComponent } from './containers/timeclock-page/timeclock-page.component';
import { TimeclockTableComponent } from './components/timeclock-table/timeclock-table.component';
import { TimeclockStaggeredComponent } from './components/timeclock-staggered/timeclock-staggered.component';
import { TimeclockDatepickerComponent } from './components/timeclock-datepicker/timeclock-datepicker.component';
import { TimeclockShiftDialogComponent } from './components/timeclock-shift-dialog/timeclock-shift-dialog.component';
import { TimeclockFullPageComponent } from './containers/timeclock-full-page/timeclock-full-page.component';
import { SlidyTableComponent } from './components/slidy-table/slidy-table.component';

const routes: Routes = [
  { path: '', component: TimeclockPageComponent },
  { path: 'full', component: TimeclockFullPageComponent },
];

@NgModule({
  declarations: [
    TimeclockPageComponent,
    TimeclockTableComponent,
    TimeclockStaggeredComponent,
    TimeclockDatepickerComponent,
    TimeclockShiftDialogComponent,
    TimeclockFullPageComponent,
    SlidyTableComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
})
export class TimeclockModule {}
