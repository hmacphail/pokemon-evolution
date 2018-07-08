import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'nav-component',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  navOptions;

  constructor() { }

  ngOnInit() {
    this.populateNavOptions();
  }

  populateNavOptions() {
    this.navOptions = [
      { name: "admin", route: "admin" },
      { name: "home", route: "home" }
    ]
  }

}
