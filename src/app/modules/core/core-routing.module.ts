import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { TypeComparisonComponent } from './type-comparison/type-comparison.component';

const routes: Routes = [
    {
        path: "home",
        component: HomeComponent
    }.
    {
    	path: "types",
    	component: TypeComparisonComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
