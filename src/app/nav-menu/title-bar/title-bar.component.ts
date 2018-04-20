import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-title-bar',
  templateUrl: './title-bar.component.html',
  styleUrls: ['./title-bar.component.css']
})
export class TitleBarComponent implements OnInit {

  constructor(public generalService: GeneralService) { }

  ngOnInit() {
    this.generalService.showMenu = true;
    if (window.innerWidth <= 767 && this.generalService.showMenu) {
      this.generalService.navMenuBarDisplay = 'invisible';
      this.generalService.contentViewDisplay = 'clear';
      this.generalService.showMenu = false;
    }
  }

  navigationMenu() {
    this.generalService.navMenuBarDisplay =
      this.generalService.navMenuBarDisplay === 'visible' ? 'invisible' : 'visible';
    this.generalService.showMenu = !this.generalService.showMenu;
    this.generalService.contentViewDisplay = 'opaque';
    if (window.innerWidth <= 767 && this.generalService.navMenuBarDisplay === 'visible') {
      this.generalService.contentViewDisplay = 'opaque';
    }
    if (!this.generalService.showMenu && this.generalService.navMenuBarDisplay === 'invisible') {
      this.generalService.contentViewDisplay = 'clear';
    }
  }

}
