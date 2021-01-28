import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { CameraViewerComponent } from './components/camera-viewer/camera-viewer.component';
import { CameraViewerPageComponent } from './containers/camera-viewer-page/camera-viewer-page.component';
import { CameraListComponent } from './components/camera-list/camera-list.component';

import { RolesGuard } from '../auth/guards/roles.guard';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material.module';

const routes: Routes = [
  {
    path: '',
    canActivate: [RolesGuard],
    component: CameraViewerPageComponent,
    data: { roles: ['isCameraViewer'] },
  },
];

@NgModule({
  declarations: [
    CameraViewerComponent,
    CameraViewerPageComponent,
    CameraListComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
})
export class CamerasModule {}
