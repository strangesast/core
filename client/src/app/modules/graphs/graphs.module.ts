import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

// modules
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material.module';

// components
import { GraphsPageComponent } from './containers/graphs-page/graphs-page.component';
import { MachineActivityGraphComponent } from './components/machine-activity-graph/machine-activity-graph.component';
import { MachineLiveGraphComponent } from './components/machine-live-graph/machine-live-graph.component';
import { MachineCycleAnalysisGraphComponent } from './components/machine-cycle-analysis-graph/machine-cycle-analysis-graph.component';
import { PartActivityGraphComponent } from './components/part-activity-graph/part-activity-graph.component';
import { ShiftsGraphComponent } from './components/shifts-graph/shifts-graph.component';
import { ShiftCalendarGraphComponent } from './components/shift-calendar-graph/shift-calendar-graph.component';
import { WeeklyShiftGraphComponent } from './components/weekly-shift-graph/weekly-shift-graph.component';
import { ProdScheduleGraphComponent } from './components/prod-schedule-graph/prod-schedule-graph.component';
import { ProdScheduleGraphDialogComponent } from './components/prod-schedule-graph-dialog/prod-schedule-graph-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: GraphsPageComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'machines/activity' },
      { path: 'manufacturing/schedule', component: ProdScheduleGraphComponent },
      { path: 'machines/activity', component: MachineActivityGraphComponent },
      {
        path: 'machines/cycles',
        component: MachineCycleAnalysisGraphComponent,
      },
      { path: 'machines/live', component: MachineLiveGraphComponent },
      {
        path: 'timeclock/shift-calendar',
        component: ShiftCalendarGraphComponent,
      },
      { path: 'timeclock/weekly', component: WeeklyShiftGraphComponent },
      {
        path: 'machines/part-count-activity',
        component: PartActivityGraphComponent,
      },
      { path: 'timeclock/shifts', component: ShiftsGraphComponent },
    ],
  },
];

@NgModule({
  declarations: [
    GraphsPageComponent,
    MachineActivityGraphComponent,
    MachineCycleAnalysisGraphComponent,
    MachineLiveGraphComponent,
    ShiftCalendarGraphComponent,
    WeeklyShiftGraphComponent,
    PartActivityGraphComponent,
    ShiftsGraphComponent,
    ProdScheduleGraphComponent,
    ProdScheduleGraphDialogComponent,
  ],
  entryComponents: [ProdScheduleGraphDialogComponent],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
})
export class GraphsModule {}
