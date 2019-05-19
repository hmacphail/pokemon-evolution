import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

/* External Libraries */
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxDatatableModule } from "@swimlane/ngx-datatable";

/* Modules */
import { AdminModule } from "./modules/admin/admin.module";
import { AppRoutingModule } from "./app-routing.module";
import { CoreModule } from "./modules/core/core.module";
import { PokemonModule } from "./modules/pokemon/pokemon.module";
import { MovesModule } from "./modules/moves/moves.module";

/* Components */
import { AppComponent } from './app.component';
import { AdminComponent } from './modules/admin/admin.component';
import { NavComponent } from './partials/nav/nav.component';
import { HeaderComponent } from './partials/header/header.component';

/* Services */
import { SERVICES } from "./services/index";

/* Config */
import { clientUrl, serverUrl } from "../../config/server_config";


@NgModule({
    imports: [
        AdminModule,
        AppRoutingModule,
        BrowserModule,
        CoreModule,
        FormsModule,
        HttpClientModule,
        HttpClientModule,
        MovesModule,
        NgbModule.forRoot(),
        NgxDatatableModule,
        PokemonModule,
        ReactiveFormsModule,
        RouterModule.forRoot([])
    ],
    declarations: [
        AppComponent,
        HeaderComponent,
        NavComponent
    ],
    providers: [
        ...SERVICES,
        { provide: "clientUrl", useValue: clientUrl },
        { provide: "serverUrl", useValue: serverUrl }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
