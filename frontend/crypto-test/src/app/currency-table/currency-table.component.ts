import { Component, OnInit } from '@angular/core';

export interface PeriodicElement {
  name: string,
  price: number,
  isCrypto: boolean
}

const ELEMENT_DATA: PeriodicElement[] = [
  { name: 'Hydrogen', price: 1.0079, isCrypto: true },
  { name: 'Helium', price: 4.0026, isCrypto: false },
  { name: 'Lithium', price: 6.941, isCrypto: true },
  { name: 'Beryllium', price: 9.0122, isCrypto: true },
  { name: 'Boron', price: 10.811, isCrypto: true },
  { name: 'Carbon', price: 12.0107, isCrypto: false },
  { name: 'Nitrogen', price: 14.0067, isCrypto: true },
  { name: 'Oxygen', price: 15.9994, isCrypto: true },
  { name: 'Fluorine', price: 18.9984, isCrypto: true },
  { name: 'Neon', price: 20.1797, isCrypto: false },
];

@Component({
  selector: 'app-currency-table',
  templateUrl: './currency-table.component.html',
  styleUrls: ['./currency-table.component.sass']
})
export class CurrencyTableComponent implements OnInit {

  displayedColumns: string[] = ['name', 'price', 'isCrypto', 'convert'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }

}
