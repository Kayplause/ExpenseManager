import { GeneralService } from './../services/general.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  constructor(public generalService: GeneralService, private router: Router) { }

  ngOnInit() {
    if (this.generalService.activeUser.IsFirstTimeAccess === false) { // returning user
      this.router.navigate(['/dashboard']);
    }
  }

}
