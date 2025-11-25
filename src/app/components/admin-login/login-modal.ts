import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-admin-login-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    ButtonModule
  ],
  templateUrl: './login-modal.html',
  styleUrls: ['./login-modal.scss']
})


export class AdminLoginModalComponent {
  showModal = true;
  loginForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      adminId: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });
    this.loadSavedCredentials();
  }

  loadSavedCredentials() {
    const savedCredentials = localStorage.getItem('adminCredentials');
    if (savedCredentials) {
      const credentials = JSON.parse(savedCredentials);
      this.loginForm.patchValue(credentials);
    }
  }

  openModal() {
    this.showModal = true;
  }

  onClose() {
    this.showModal = false;
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;

      setTimeout(() => {
        this.isLoading = false;
        
        if (this.loginForm.value.rememberMe) {
          localStorage.setItem('adminCredentials', JSON.stringify(this.loginForm.value));
        } else {
          localStorage.removeItem('adminCredentials');
        }

        console.log('Admin login successful:', this.loginForm.value.adminId);
        this.onClose();
      }, 2000);
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  onModalClick(event: Event) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.onClose();
    }
  }
}