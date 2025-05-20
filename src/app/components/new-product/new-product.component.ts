import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-new-product',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './new-product.component.html',
  styleUrl: './new-product.component.css',
})
export class NewProductComponent implements OnInit {
  imagePreviews: string[] = [];
  selectedFiles: File[] = [];
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private productService: ProductService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.selectedFiles = [...this.selectedFiles, ...Array.from(input.files)];

      Array.from(input.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          if (e.target?.result) {
            this.imagePreviews.push(e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      });

      input.value = '';
    }
  }

  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
    this.selectedFiles.splice(index, 1);
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const form = event.target as HTMLFormElement;
    const formData = new FormData();

    const productData = {
      title: form.querySelector<HTMLInputElement>('[name="title"]')?.value,
      description: form.querySelector<HTMLTextAreaElement>(
        '[name="description"]'
      )?.value,
      price: form.querySelector<HTMLInputElement>('[name="price"]')?.value,
      itemCondition: form.querySelector<HTMLSelectElement>(
        '[name="itemCondition"]'
      )?.value,
      category:
        form.querySelector<HTMLSelectElement>('[name="category"]')?.value,
    };

    formData.append(
      'product',
      new Blob([JSON.stringify(productData)], { type: 'application/json' })
    );

    this.selectedFiles.forEach((file, index) => {
      formData.append('images', file);
    });

    console.log('FormData contents before submission:');
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    this.productService.createProduct(formData).subscribe({
      next: (response) => {
        this.isSubmitting = false;

        this.router.navigate(['/products']);
      },
      error: (error) => {
        this.isSubmitting = false;
        if (error.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        } else {
          this.errorMessage =
            error.error.message ||
            'Une erreur est survenue lors de la création du produit';
        }
      },
    });
  }
}
