import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { bncApiService } from '../services/bnc.service';
import { Currency } from '../classes/currency';

@Component({
  selector: 'app-currency-table',
  templateUrl: './currency-table.component.html',
  styleUrls: ['./currency-table.component.sass']
})
export class CurrencyTableComponent implements OnInit {

  displayedColumns: string[] = ['name', 'price', 'isCrypto', 'convert'];
  dataSource: Currency[] = [];
  currenciesData: Currency[] = [];
  from = 0;
  to = 0;
  limit = 0;
  _loading = false;

  @Output() messageEvent = new EventEmitter<string>();

  constructor(private _bncApiService: bncApiService) { }

  async ngOnInit(): Promise<void> {
    await this._bncApiService.setToken();
    this.currenciesData = (await this._bncApiService.getCurrencies().toPromise()).content;
    this._bncApiService.currencyList = this.currenciesData;
    this.sendToExchange(this._bncApiService);
    this.limit = this.currenciesData.length;
    this.getPricesPaginated();
  }

  sendToExchange(message: any) {
    this.messageEvent.emit(message)
  }

  onTableScroll(e: any) {
    if (this._loading) {
      console.log("Loading...");
    } else {
      const tableViewHeight = e.target.offsetHeight; // viewport
      const tableScrollHeight = e.target.scrollHeight; // length of all table
      const scrollLocation = e.target.scrollTop; // how far user scrolled

      // If the user has scrolled within 200px of the bottom, add more data
      const buffer = 800;
      const limit = tableScrollHeight - tableViewHeight - buffer;
      if (scrollLocation > limit) {
        console.log("Load More");
        this.getPricesPaginated();
      }
    }
  }

  async getPricesPaginated(): Promise<void> {
    this._loading = true;
    if (this.to === this.limit) {
      console.log("Finished");
    } else if (this.limit > 0 && this.limit < 20) {
      this.to = this.limit;
    } else if (this.limit > 0 && this.limit > this.to) {
      this.from = this.to;
      this.to = this.to + 20;
    }
    for (let i = this.from; i < this.to; i++) {
      var data = await this._bncApiService.getPrice(this.currenciesData[i].id).toPromise();
      //console.log(data);
      if ("content" in data) {
        if (data.content.length > 0) {
          this.currenciesData[i].price = data.content[0].price;
        }
      }
    }
    this.dataSource = this.currenciesData.slice(0, this.to);
    console.log("loaded 20 more");
    this._loading = false;
  }
}
