import { Component, Input, OnInit } from '@angular/core';
import { HeaderComponent } from '../components/header/header.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    HeaderComponent,
    MatInputModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  userDetails: FormGroup = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private http: HttpClient) {}
  ngOnInit(): void {}

  onSaveUser() {
    const url = 'http://localhost:8080/api/auth/register';
    const obj = this.userDetails.value;
    console.log(obj);
    this.http.post(url, obj).subscribe((res: any) => {
      alert('User registered successfully');
    });
  }
}
