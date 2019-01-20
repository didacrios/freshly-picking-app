import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {


  constructor(private http: HttpClient) { }

  // Get all posts from the API
  getOrders() {
    return this.http.get('/api/getOrders');
  }
}
