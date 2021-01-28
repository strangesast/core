import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material.module';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { BrandComponent } from './components/brand/brand.component';
import { NoopComponent } from './components/noop/noop.component';
import { PieComponent } from './components/pie/pie.component';

import { DurationPipe } from './pipes/duration.pipe';

const components = [
  PageTitleComponent,
  BrandComponent,
  NoopComponent,
  DurationPipe,
  PieComponent,
];

@NgModule({
  imports: [CommonModule, MaterialModule, RouterModule],
  declarations: components,
  exports: components,
})
export class SharedModule {}
