import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

/* External Libraries */
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

/* Modules */
import { AdminModule } from "./admin/admin.module";
import { AppRoutingModule } from "./app-routing.module";

/* Components */
import { AppComponent } from './app.component';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';

/* Services */
import { SERVICES } from "./services/index";

/* Config */
import { clientUrl, serverUrl } from "../../config/server_config";

@NgModule({
    imports: [
        AdminModule,
        AppRoutingModule,
        BrowserModule,
        HttpClientModule,
        HttpModule,
        NgbModule.forRoot(),
        NgxDatatableModule,
        RouterModule.forRoot([])
    ],
    declarations: [
        AppComponent,
        HomeComponent
    ],
    providers: [
        ...SERVICES,
        { provide: "clientUrl", useValue: clientUrl },
        { provide: "serverUrl", useValue: serverUrl }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
