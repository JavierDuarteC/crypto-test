import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Currency } from '../classes/currency';

@Injectable()
export class bncApiServiceMock {

    token = "";
    currencyList: Currency[] = [];

    constructor(private httpClient: HttpClient) {
    }

    getCurrencies(): Observable<any> {

        return of({
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
            }
            ]
        });
    }

    getPrice(id: string): Observable<any> {
        return of({
            content: [{
                price: 23
            }]
        });
    }

    getToken(): Observable<any> {
        return of({
            access_token: "123123123123"
        });
    }

    async setToken() {
        var data = await this.getToken().toPromise();
        this.token = data.access_token;
    }
}