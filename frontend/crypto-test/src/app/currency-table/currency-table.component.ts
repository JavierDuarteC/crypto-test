import { Component, OnInit } from '@angular/core';
import { bncApiService } from '../services/bnc.service';
import { Currency } from '../classes/currency';

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
  dataSource: Currency[] = [];
  from = 0;
  to = 0;
  limit = 0;

  constructor(private _bncApiService: bncApiService) { }

  async ngOnInit(): Promise<void> {
    await this._bncApiService.setToken();
    var currenciesData = (await this._bncApiService.getCurrencies().toPromise()).content;
    this.limit = currenciesData.length;
    if (this.limit > 0 && this.limit < 21) {
      this.to = this.limit;
    } else if (this.limit > 0 && this.limit > 20) {
      this.to = 20;
    }
    for (let i = this.from; i < this.to; i++) {
      var data = await this._bncApiService.getPrice(currenciesData[i].id).toPromise();
      //console.log(data);
      if ("content" in data) {
        if (data.content.length > 0) {
          currenciesData[i].price = data.content[0].price;
        }
      }
      this.dataSource = currenciesData.slice(0,i+1);
    }
  }

}
