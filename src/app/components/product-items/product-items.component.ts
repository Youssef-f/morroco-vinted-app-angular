import {
  Component,
  OnInit,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-items',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-items.component.html',
  styleUrls: ['./product-items.component.css'],
})
export class ProductItemsComponent implements OnInit, OnChanges {
  @Input() searchTerm: string = '';
  searchResults: any[] = [];
  suggestedProducts: any[] = [];
  allProducts: any[] = [];
  showAllProducts: boolean = true;

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadAllProducts();
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Search term changed:', this.searchTerm); // Debug log
    if (this.searchTerm) {
      this.showAllProducts = false;
      this.searchProducts();
    } else {
      this.showAllProducts = true;
      this.searchResults = [];
      this.suggestedProducts = [];
    }
  }

  loadAllProducts() {
    console.log('Loading all products'); // Debug log
    this.productService.getAllProducts().subscribe({
      next: (products) => {
        console.log('Products loaded:', products); // Debug log
        this.allProducts = products;
        this.updateSuggestedProducts();
      },
      error: (error) => {
        console.error('Error loading products:', error); // Debug log
      },
    });
  }

  searchProducts() {
    console.log('Searching products with term:', this.searchTerm); // Debug log
    this.productService.searchProducts(this.searchTerm).subscribe({
      next: (products) => {
        console.log('Search results:', products); // Debug log
        this.searchResults = products;
        this.updateSuggestedProducts();
      },
      error: (error) => {
        console.error('Error searching products:', error); // Debug log
      },
    });
  }

  private updateSuggestedProducts() {
    if (!this.searchTerm) {
      this.suggestedProducts = [];
      return;
    }

    // Filter out products that are already in search results
    const searchResultIds = new Set(this.searchResults.map((p) => p.id));
    this.suggestedProducts = this.allProducts
      .filter((product) => !searchResultIds.has(product.id))
      .filter(
        (product) =>
          product.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
          product.description
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase()) ||
          product.category.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
      .slice(0, 5); // Show only top 5 suggestions
  }
}
