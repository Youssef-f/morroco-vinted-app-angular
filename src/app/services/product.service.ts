import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'http://localhost:8080/api/products';
  private products: any[] = [];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      throw new Error('No authentication token found');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  createProduct(formData: FormData): Observable<any> {
    console.log('FormData contents:');
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    if (!formData.has('product')) {
      const productData = {
        title: formData.get('title'),
        description: formData.get('description'),
        price: formData.get('price'),
        itemCondition: formData.get('itemCondition'),
        category: formData.get('category'),
      };
      formData.set(
        'product',
        new Blob([JSON.stringify(productData)], { type: 'application/json' })
      );
    }

    return this.http.post(this.apiUrl, formData, {
      headers: this.getHeaders().delete('Content-Type'),
    });
  }

  getAllProducts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map((products) => {
        this.products = products;
        return products;
      })
    );
  }

  searchProducts(term: string): Observable<any[]> {
    const url = `${this.apiUrl}/search?term=${encodeURIComponent(term)}`;
    return this.http.get<any[]>(url);
  }
}
