
import { TestBed, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { bncApiService } from './bnc.service';
import { of } from 'rxjs';

describe('BNCApiService', () => {
  let injector: TestBed;
  let service: bncApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [bncApiService],
    });

    injector = getTestBed();
    service = injector.inject(bncApiService);
    httpMock = injector.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('getToken() should return data', () => {
    const dummyTokenResponse = of({
      access_token: "123123123123"
    });

    service.getToken().subscribe((res) => {
      expect(res).toEqual(dummyTokenResponse);
    });
    const req = httpMock.expectOne('https://bravenewcoin.p.rapidapi.com/oauth/token');
    expect(req.request.method).toBe('POST');
    req.flush(dummyTokenResponse);
  });

  it('getPrice() should return data', () => {
    const dummyPriceResponse = of({
      content: [{
        price: 23
      }]
    });

    const currencyId = "1234Absdhdsd";
    service.getPrice(currencyId).subscribe((res) => {
      expect(res).toEqual(dummyPriceResponse);
    });
    const req = httpMock.expectOne('https://bravenewcoin.p.rapidapi.com/market-cap?assetId=' + currencyId);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPriceResponse);
  });

  it('getCurrencies() should return data', () => {
    const dummyCurrencyResponse = of({
      content: [{
        id: "1234Abcd",
        name: "crypto1",
        symbol: "C1",
        type: "CRYPTO"
      }, {
        id: "1234Abcd",
        name: "crypto2",
        symbol: "C2",
        type: "CRYPTO"
      }, {
        id: "1234Abcd",
        name: "crypto3",
        symbol: "C3",
        type: "CRYPTO"
      }]
    });

    service.getCurrencies().subscribe((res) => {
      expect(res).toEqual(dummyCurrencyResponse);
    });
    const req = httpMock.expectOne('https://bravenewcoin.p.rapidapi.com/asset?status=ACTIVE');
    expect(req.request.method).toBe('GET');
    req.flush(dummyCurrencyResponse);
  });

});