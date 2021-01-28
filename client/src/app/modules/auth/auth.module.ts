import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { LoginPageComponent } from './containers/login-page/login-page.component';
import { CreateAccountPageComponent } from './containers/create-account-page/create-account-page.component';
import { LoginBasePageComponent } from './containers/login-base-page/login-base-page.component';

import { AuthService } from './services/auth.service';
import { RolesGuard } from './guards/roles.guard';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material.module';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'login',
    component: LoginBasePageComponent,
    children: [
      { path: '', component: LoginPageComponent },
      { path: 'new', component: CreateAccountPageComponent },
    ],
  },
];

@NgModule({
  declarations: [
    LoginPageComponent,
    CreateAccountPageComponent,
    LoginBasePageComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ],
})
export class AuthModule {
  static forRoot(): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        AuthService,
        RolesGuard,
        // {provide: UserServiceConfig, useValue: config }
      ],
    };
  }
}
