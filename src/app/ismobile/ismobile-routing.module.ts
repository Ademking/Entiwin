import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IsmobileComponent } from './ismobile.component';


const routes: Routes = [
  { path: '' , component: IsmobileComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IsmobileRoutingModule { }
