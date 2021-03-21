import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material.module';
import {
  MachinesPageComponent,
  MachinesListComponent,
  MachinesGridComponent,
  MachinesMapComponent,
} from './containers/machines-page/machines-page.component';
import { MapViewerComponent } from './components/map-viewer/map-viewer.component';
import { MachinePageComponent } from './containers/machine-page/machine-page.component';
import { SharedModule } from '../shared/shared.module';
import { MachinesNewPageComponent } from './containers/machines-new-page/machines-new-page.component';

const routes: Routes = [
  {
    path: '',
    component: MachinesPageComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'list' },
      { path: 'map', component: MachinesMapComponent },
      { path: 'list', component: MachinesListComponent },
      { path: 'grid', component: MachinesGridComponent },
      { path: 'new', component: MachinesNewPageComponent },
    ],
  },
  { path: ':id', component: MachinePageComponent },
];

@NgModule({
  declarations: [
    MachinesPageComponent,
    MachinesListComponent,
    MachinesGridComponent,
    MachinesMapComponent,
    MachinePageComponent,
    MapViewerComponent,
    MachinesNewPageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
})
export class MachinesModule {}
