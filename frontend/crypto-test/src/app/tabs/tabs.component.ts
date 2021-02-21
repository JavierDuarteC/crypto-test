import { Component, OnInit } from '@angular/core';
import { bncApiService } from '../services/bnc.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.sass']
})
export class TabsComponent implements OnInit {

  selectedIndex = 0;
  message!: string;
  _bncApiService!: bncApiService;

  constructor() { }


  receiveMessage(event: any) {
    if (typeof event === "object") {
      this._bncApiService = event;
    } else {
      this.message = event;
    }
    this.goToExchange();
  }

  ngOnInit(): void {
  }

  goToExchange() {
    this.selectedIndex = 0;
  }

}
