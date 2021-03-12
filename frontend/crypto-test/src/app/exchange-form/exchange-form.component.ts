import { Component, OnInit, Input } from '@angular/core';
import { Currency } from '../classes/currency';
import { FormControl, Validators } from '@angular/forms';
import { bncApiService } from '../services/bnc.service';

@Component({
  selector: 'app-exchange-form',
  templateUrl: './exchange-form.component.html',
  styleUrls: ['./exchange-form.component.sass']
})
export class ExchangeFormComponent implements OnInit {
  selectedValueFrom!: string;
  selectedValueTo!: string;
  message!: string;
  resultControl = new FormControl();
  quantityControl = new FormControl('', [
    Validators.required,
    Validators.min(0),
  ]);

  private _bncApiService!: bncApiService;
  private _receivedId!: string;

  @Input('receivedId')
  set receivedId(id: string) {
    this._receivedId = id;
    this.setIncomingField(this._receivedId);
  }

  get receivedId(): string { return this._receivedId; }

  @Input('bncApiService')
  set bncApiService(service: bncApiService) {
    if(service){
      this._bncApiService = service;
      this.currencyList = this._bncApiService.currencyList;
    }
  }

  get bncApiService(): bncApiService { return this._bncApiService; }

  currencyList: Currency[] = [];

  constructor() { }

  ngOnInit(): void {
    this.selectedValueFrom = "BTC";
    this.selectedValueTo = "BTC";
  }

  async calculate() {
    console.log("calculate");
    console.log(this.currencyList.length);
    this.quantityControl.markAsTouched();
    var quantity = this.quantityControl.value;
    if (quantity > 0 && this.currencyList.length > 0) {
      var found1 = this.currencyList.find(element => element.symbol === this.selectedValueFrom) ?? new Currency();
      var found2 = this.currencyList.find(element => element.symbol === this.selectedValueTo) ?? new Currency();
      if (!found1.price) {
        found1.price = await this.getPrice(found1.id);
        console.log(found1.symbol + "'s price is: " + found1.price);
      }
      if (!found2.price) {
        found2.price = await this.getPrice(found2.id);
      }
      if (found1.price === -1) {
        this.message = found1.symbol + " no tiene un precio establecido en BraveNewCoin."
      } else if (found2.price === -1) {
        this.message = found2.symbol + " no tiene un precio establecido en BraveNewCoin."
      }else{
        var result = quantity * found1.price / found2.price;
        console.log(found1.price);
        console.log(found2.price);
        if (result > 0) {
          this.resultControl.setValue(result);
        }
      }
    }
  }

  shuffleInputs() {
    console.log("shuffle inputs");
    var temp = this.selectedValueFrom;
    this.selectedValueFrom = this.selectedValueTo;
    this.selectedValueTo = temp;
  }

  setIncomingField(id: string) {
    var found = this.currencyList.find(element => element.id === id) ?? new Currency();
    this.selectedValueTo = found.symbol;
  }

  async getPrice(id: string): Promise<number> {
    console.log("getting price of: " + id);
    var data = await this._bncApiService.getPrice(id).toPromise();
    if ("content" in data) {
      if (data.content.length > 0) {
        return data.content[0].price;
      }
    }
    return -1;
  }

}
