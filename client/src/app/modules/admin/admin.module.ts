import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UserListPageComponent } from './containers/user-list-page/user-list-page.component';
import { RolesGuard } from '../../modules/auth/guards/roles.guard';
import { MaterialModule } from '../material.module';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: 'users',
    canActivate: [RolesGuard],
    component: UserListPageComponent,
    data: { roles: ['isAdmin'] },
  },
];

@NgModule({
  declarations: [UserListPageComponent],
  providers: [RolesGuard],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    RouterModule.forChild(routes),
  ],
})
export class AdminModule {}
