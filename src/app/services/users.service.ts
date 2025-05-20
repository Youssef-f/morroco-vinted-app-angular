import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  http = inject(HttpClient);
  createABuyer() {
    const url = 'http//localhost:8080/api/auth/register';
    // return this.http.post(url);
  }
}
