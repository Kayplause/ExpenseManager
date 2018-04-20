import { GeneralService } from './../services/general.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  chartTypeOne: string;
  chartTypeTwo: string;
  chartLabels: string[];
  chartDataOne: any[];
  chartDataTwo: any[];
  chartLegend: boolean;
  chartOptionsOne: any;
  chartOptionsTwo: any;

  constructor(private generalService: GeneralService, private router: Router) { }

  ngOnInit() {
    this.chartTypeOne = 'bar';
    this.chartTypeTwo = 'pie';
    this.chartLabels = ['Info1', 'Info2', 'Info3', 'Info4', 'Info5'];
    this.chartDataOne = [
      { data: [1, 2, 3, 4, 5], label: 'setA' },
      { data: [1.5, 2.5, 3.5, 4.5, 5.5], label: 'setB' }
    ];
    this.chartDataTwo = [1, 2, 3, 4, 5];
    this.chartLegend = true;
    this.chartOptionsOne = {
      responsive: true,
      title: {
        display: true,
        text: 'Chart-Type-One'
      },
      scales: {
        yAxes: [{
          ticks: {
            min: 0
          }
        }]
      }
    };
    this.chartOptionsTwo = {
      responsive: true,
      title: {
        display: true,
        text: 'Chart-Type-Two'
      }
    };
  }

  chartClicked(e) {
    console.log(e);
  }

  chartHovered(e) {
    console.log(e);
  }

  toggleChart() {
    this.chartTypeOne = this.chartTypeOne === 'line' ? 'bar' : 'line';
    this.chartTypeTwo = this.chartTypeTwo === 'doughnut' ? 'pie' : 'doughnut';
  }

}
