import { HeaderService } from './../../services/header.service';
import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-sidebar-left',
  templateUrl: './sidebar-left.component.html',
  styleUrls: ['./sidebar-left.component.css']
})
export class SidebarLeftComponent implements OnInit {

  allTabs: any[];

  constructor(public generalService: GeneralService) { }

  ngOnInit() {
    this.allTabs = JSON.parse(window.sessionStorage.getItem('uT'));
  }

  displayChildMenu(menu) {
    if (this.generalService.parentMenu === menu) {
      this.generalService.parentMenu = undefined;
      return;
    }
    this.generalService.parentMenu = menu;
  }

}
