import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';

import { HomeComponent } from './home/home.component';
import { TypeComparisonComponent } from './type-comparison/type-comparison.component';

@NgModule({
  imports: [
    CommonModule,
    CoreRoutingModule
  ],
  declarations: [
  	HomeComponent,
  	TypeComparisonComponent
  ]
})
export class CoreModule { }
