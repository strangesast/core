import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import {
  MachinesPageComponent,
  MachinesListComponent,
  MachinesGridComponent,
  MachinesMapComponent,
} from './containers/machines-page/machines-page.component';
import { MapViewerComponent } from './components/map-viewer/map-viewer.component';
import { MachinePageComponent } from './containers/machine-page/machine-page.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: MachinesPageComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'map' },
      { path: 'map', component: MachinesMapComponent },
      { path: 'list', component: MachinesListComponent },
      { path: 'grid', component: MachinesGridComponent },
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
