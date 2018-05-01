import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/src/services/cookie';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public lineChartData: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: '兌換次數' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: '審核次數' }
  ];
  public lineChartLabels: Array<any> = ['12/1', '12/2', '12/3', '12/4', '12/5', '12/6', '12/7'];
  public lineChartOptions: any = {
    responsive: true
  };
  public lineChartColors: Array<any> = [
    {
      backgroundColor: 'rgba(105,195,255,0.2)',
      borderColor: '#2d9dea',
      pointBackgroundColor: 'rgba(45,157,234,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(148,159,177,0.8)'
    },
    {
      backgroundColor: 'rgba(255,161,181,0.2)',
      borderColor: '#ff6585',
      pointBackgroundColor: 'rgba(255,101,133,1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(77,83,96,1)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = ['2017/10', '2017/11', '2017/12'];
  public barChartType = 'bar';
  public barChartLegend = true;
  public barChartData: any[] = [
    { data: [65, 59, 80], label: '點數資本' },
    { data: [28, 48, 40], label: '人事成本' },
    { data: [15, 20, 30], label: '零用金' }
  ];

  constructor(
    private router: Router,
  ) { }

  ngOnInit() { }

  public randomize() {
    const _lineChartData: Array<any> = new Array(this.lineChartData.length);
    for (let i = 0; i < this.lineChartData.length; i++) {
      _lineChartData[i] = { data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label };
      for (let j = 0; j < this.lineChartData[i].data.length; j++) {
        _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
      }
    }
    this.lineChartData = _lineChartData;
  }

  public chartClicked(e: any) {
    console.log(e);
  }

  public chartHovered(e: any) {
    console.log(e);
  }

  public HistogramClicked(e: any) {
    console.log(e);
  }

  public HistogramHovered(e: any) {
    console.log(e);
  }

  public Histogramrandomize() {
    const data = [
      Math.round(Math.random() * 100),
      59,
      80,
      (Math.random() * 100),
      56,
      (Math.random() * 100),
      40];
    const clone = JSON.parse(JSON.stringify(this.barChartData));
    clone[0].data = data;
    this.barChartData = clone;
  }

}
