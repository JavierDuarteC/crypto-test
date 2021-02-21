import { Component, OnInit } from '@angular/core';
import { Currency } from '../classes/currency';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-exchange-form',
  templateUrl: './exchange-form.component.html',
  styleUrls: ['./exchange-form.component.sass']
})
export class ExchangeFormComponent implements OnInit {
  selectedValueFrom!: string;
  selectedValueTo!: string;
  resultControl = new FormControl();
  quantityControl = new FormControl('', [
    Validators.required,
    Validators.min(0.000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001),
  ]);

  dataSource: Currency[] = [
    { id: "1", name: "Bitcoin", symbol: "BTC", price: 2.3, status: "", type: "", url: "" },
    { id: "2", name: "Crypto1", symbol: "C1", price: 1, status: "", type: "", url: "" },
    { id: "3", name: "Crypto2", symbol: "C2", price: 2, status: "", type: "", url: "" },
    { id: "4", name: "Crypto3", symbol: "C3", price: 3, status: "", type: "", url: "" }
  ];

  constructor() { }

  ngOnInit(): void {
    this.selectedValueFrom = "BTC";
    this.selectedValueTo = "BTC";
  }

  calculate(event: any) {
    event.preventDefault();
    console.log("calculate");
    this.quantityControl.markAsTouched();
    var quantity = this.quantityControl.value;
    if (quantity > 0) {
      var found1 = this.dataSource.find(element => element.symbol === this.selectedValueFrom) ?? new Currency();
      var found2 = this.dataSource.find(element => element.symbol === this.selectedValueTo) ?? new Currency();
      var result = quantity * found1.price / found2.price;
      if (result > 0) {
        this.resultControl.setValue(result);
      }
    }
  }

  shuffleInputs(event: any) {
    event.preventDefault();
    console.log("shuffle inputs");
    var temp = this.selectedValueFrom;
    this.selectedValueFrom = this.selectedValueTo;
    this.selectedValueTo = temp;
  }

}
