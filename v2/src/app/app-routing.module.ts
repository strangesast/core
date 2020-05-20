import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { SummaryPageComponent } from './summary-page/summary-page.component';
import { MachinesPageComponent } from './machines-page/machines-page.component';
import { MachinePageComponent } from './machine-page/machine-page.component';
import { TimeclockPageComponent } from './timeclock-page/timeclock-page.component';
import { PersonPageComponent } from './person-page/person-page.component';
import { PersonListPageComponent } from './person-list-page/person-list-page.component';
import { OrderListPageComponent } from './order-list-page/order-list-page.component';
import { OrderPageComponent } from './order-page/order-page.component';
import { PartListPageComponent } from './part-list-page/part-list-page.component';
import { PartPageComponent } from './part-page/part-page.component';
import { CustomerListPageComponent } from './customer-list-page/customer-list-page.component';


const routes: Routes = [
  {path: '', component: MainComponent, children: [
    {path:  '', component: SummaryPageComponent},
    {path: 'timeclock', component: TimeclockPageComponent},
    {path: 'machines', component: MachinesPageComponent},
    {path: 'machines/:id', component: MachinePageComponent},
    {path: 'orders', component: OrderListPageComponent},
    {path: 'orders/:id', component: OrderPageComponent},
    {path: 'people', component: PersonListPageComponent},
    {path: 'people/:id', component: PersonPageComponent},
    {path: 'customers', component: CustomerListPageComponent},
    {path: 'inventory', component: MachinesPageComponent},
    {path: 'parts', component: PartListPageComponent},
    {path: 'parts/:id', component: PartPageComponent},
    {path: 'history', component: MachinesPageComponent},
  ] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
