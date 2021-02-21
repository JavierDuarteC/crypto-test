import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.sass']
})
export class TabsComponent implements OnInit {
  
  selectedIndex = 0;

  constructor() { }

  ngOnInit(): void {
  }

  goToExchange() {
    this.selectedIndex = 0;
  }

}
