import { HttpClient, HttpHandler } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { bncApiService } from '../services/bnc.service';
import { bncApiServiceMock } from '../services/bncMock.service';

import { CurrencyTableComponent } from './currency-table.component';

describe('CurrencyTableComponent', () => {
  let component: CurrencyTableComponent;
  let fixture: ComponentFixture<CurrencyTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CurrencyTableComponent],
      providers: [ {provide: bncApiService, useClass: bncApiServiceMock}, HttpClient, HttpHandler]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize variables', async () => {(1)
    fixture.detectChanges();
    expect(component.currenciesData.length).toBe(0);
    spyOn(component, 'sendToExchange');
    spyOn(component, 'getPricesPaginated');
    fixture.whenStable().then(()=>{(2)
      fixture.detectChanges();
      expect(component.currenciesData.length).toBeGreaterThan(0);
    });
    component.ngOnInit();
  });

  it('should load more', async () => {(1)
    fixture.detectChanges();
    let firstLength = component.dataSource.length;
    expect(firstLength).toBe(0);
    fixture.whenStable().then(()=>{(2)
      fixture.detectChanges();
      expect(component.dataSource.length).toBeGreaterThan(firstLength);
    });
    component.getPricesPaginated();
  });
});
