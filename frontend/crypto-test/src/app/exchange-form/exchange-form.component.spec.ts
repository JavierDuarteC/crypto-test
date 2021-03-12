import { HttpClient, HttpEventType, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Currency } from '../classes/currency';
import { bncApiService } from '../services/bnc.service';
import { bncApiServiceMock } from '../services/bncMock.service';

import { ExchangeFormComponent } from './exchange-form.component';

describe('ExchangeFormComponent', () => {
  let component: ExchangeFormComponent;
  let fixture: ComponentFixture<ExchangeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExchangeFormComponent ],
      providers: [ {provide: bncApiService, useClass: bncApiServiceMock}, HttpClient, HttpHandler]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExchangeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize variables', () => {
    fixture.detectChanges();
    expect(component.selectedValueFrom).toBe("BTC");
    expect(component.selectedValueTo).toBe("BTC");
    component.ngOnInit();
  });

  it('should swap selectors', () => {
    component.selectedValueFrom = "CKT"
    component.selectedValueTo = "BTC"
    fixture.detectChanges();
    const selector1 = component.selectedValueFrom;
    const selector2 = component.selectedValueTo;

    component.shuffleInputs();
    spyOn(component, "shuffleInputs");
    fixture.detectChanges();

    expect(component.selectedValueFrom).toBe(selector2);
    expect(component.selectedValueTo).toBe(selector1);
  });

  it('should set the incoming value on selectorTo', () => {
    component.selectedValueFrom = "BTC"
    component.selectedValueTo = "BTC"
    let c = new Currency();
    c.id= "1234Abcd";
    c.name = "crypto1";
    c.symbol = "C1";
    c.type = "CRYPTO";
    component.currencyList = [c];

    const incomingId = "1234Abcd";

    component.setIncomingField(incomingId);
    spyOn(component, "setIncomingField");
    fixture.detectChanges();
    
    expect(component.selectedValueTo).toBe(c.symbol);
  });

  it('should calculate the exchange', () => {

    let c1 = new Currency();
    c1.id= "1234Abcd";
    c1.name = "crypto1";
    c1.symbol = "C1";
    c1.type = "CRYPTO";
    c1.price = 4;
    let c2 = new Currency();
    c2.id= "1234Abcd";
    c2.name = "crypto2";
    c2.symbol = "C2";
    c2.type = "CRYPTO";
    c2.price = 2;
    component.currencyList = [c1,c2];

    component.selectedValueFrom = c1.symbol;
    component.selectedValueTo = c2.symbol;

    const quantity = 3; 
    component.quantityControl.setValue(quantity);

    const resultHasToBe = 6;

    component.calculate();
    spyOn(component, "setIncomingField");
    fixture.detectChanges();
    
    expect(component.resultControl.value).toBe(resultHasToBe);
  });
});
