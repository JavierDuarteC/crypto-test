import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class bncApiService {

    token = "";

    constructor(private httpClient: HttpClient) {
    }

    getCurrencies(): Observable<any> {
        const headers = {
            'x-rapidapi-key': 'd89074f7admsh13cf1be25abc07ap18c247jsnb4f298baab67',
            'x-rapidapi-host': 'bravenewcoin.p.rapidapi.com',
            'useQueryString': 'true'
        };
        return this.httpClient.get('https://bravenewcoin.p.rapidapi.com/asset?status=ACTIVE',
            { headers })
    }

    getPrice(id: string): Observable<any> {
        const headers = {
            'authorization': 'Bearer ' + this.token,
            'x-rapidapi-key': 'd89074f7admsh13cf1be25abc07ap18c247jsnb4f298baab67',
            'x-rapidapi-host': 'bravenewcoin.p.rapidapi.com',
            'useQueryString': 'true'
        };
        return this.httpClient.get('https://bravenewcoin.p.rapidapi.com/market-cap?assetId=' + id,
            { headers })
    }

    getToken(): Observable<any> {
        const headers = {
            'content-type': 'application/json',
            'x-rapidapi-key': 'd89074f7admsh13cf1be25abc07ap18c247jsnb4f298baab67',
            'x-rapidapi-host': 'bravenewcoin.p.rapidapi.com'
        };
        const body = {
            audience: 'https://api.bravenewcoin.com',
            client_id: 'oCdQoZoI96ERE9HY3sQ7JmbACfBf55RY',
            grant_type: 'client_credentials'
        }
        return this.httpClient.post('https://bravenewcoin.p.rapidapi.com/oauth/token', body, {
            headers
        })
    }

    async setToken() {
        var data = await this.getToken().toPromise();
        this.token = data.access_token;
    }
}