import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

import { CoreRoutingModule } from './core-routing.module';

import { HomeComponent } from './home/home.component';
import { TypeComparisonComponent } from './type-comparison/type-comparison.component';

@NgModule({
  imports: [
    CommonModule,
    CoreRoutingModule,
    FormsModule,
    NgxDatatableModule,
    ReactiveFormsModule,
  ],
  declarations: [
  	HomeComponent,
  	TypeComparisonComponent
  ]
})
export class CoreModule { }
