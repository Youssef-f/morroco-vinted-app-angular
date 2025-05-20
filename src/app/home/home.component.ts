import { Component } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { MatButtonModule } from '@angular/material/button';
import { ProductsComponent } from '../components/products/products.component';
@Component({
  selector: 'app-home',
  imports: [HeaderComponent, MatButtonModule, ProductsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {}
