import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    MatIconModule,
    RouterModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isMenuOpen = false;
  searchTerm: string = '';
  filteredProducts: any[] = [];

  constructor(private router: Router) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onSearch() {
    if (this.searchTerm.trim()) {
      console.log('Searching for:', this.searchTerm.trim()); // Debug log
      this.router.navigate(['/products'], {
        queryParams: { search: this.searchTerm.trim() },
      });
    }
  }

  selectProduct(product: any) {
    // Handle product selection if needed
    console.log('Selected product:', product);
  }
}
