import { NgModule, ModuleWithProviders } from '@angular/core';
import { TimeclockVisComponent } from './timeclock-vis.component';
import { HttpDataProviderService } from './http-data-provider.service';
import { MockingDataProviderService } from './mocking-data-provider.service';
import { DataProviderService } from './models/data-provider';


@NgModule({
  declarations: [TimeclockVisComponent],
  imports: [],
  exports: [TimeclockVisComponent],
})
export class TimeclockVisModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: TimeclockVisModule,
      providers: [
        // { provide: DataProviderService, useClass: HttpDataProviderService }
        { provide: DataProviderService, useClass: MockingDataProviderService }
      ]
    };
  }
}
