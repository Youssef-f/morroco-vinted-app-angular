import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  Router,
  NavigationEnd,
  RouterModule,
  RouterOutlet,
  ActivatedRoute,
} from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { ProductItemsComponent } from '../product-items/product-items.component';
import { NewProductComponent } from '../new-product/new-product.component';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    ProductItemsComponent,
    RouterModule,
    RouterOutlet,
    NewProductComponent,
    CommonModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit, OnDestroy {
  isNewProductRoute = false;
  currentSearchTerm: string = '';
  private routerSubscription: Subscription = new Subscription();
  private routeSubscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute,
    private productService: ProductService
  ) {
    this.routerSubscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isNewProductRoute = event.url.includes('/new');
        this.checkAuth();
      });
  }

  ngOnInit(): void {
    this.isNewProductRoute = this.router.url.includes('/new');
    this.checkAuth();

    // Subscribe to query params changes
    this.routeSubscription = this.route.queryParams.subscribe((params) => {
      const newSearchTerm = params['search'] || '';
      console.log('Query params changed. New search term:', newSearchTerm); // Debug log
      if (this.currentSearchTerm !== newSearchTerm) {
        this.currentSearchTerm = newSearchTerm;
        console.log('Search term updated to:', this.currentSearchTerm); // Debug log
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private checkAuth(): void {
    if (this.isNewProductRoute) {
      if (!this.authService.isLoggedIn()) {
        this.router.navigate(['/login']);
      }
    }
  }

  private getProductItemsComponent(): ProductItemsComponent | null {
    // This is a simple way to get the component reference
    // In a real app, you might want to use a service or other state management
    const element = document.querySelector('app-product-items');
    return element ? (element as any).__ngContext__[0] : null;
  }
}
