import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    CheckboxModule,
    ButtonModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginModalComponent {
  showModal = true;
  activeTab: 'admin' | 'student' = 'admin';
  adminLoginForm: FormGroup;
  studentLoginForm: FormGroup;
  isAdminLoading = false;
  isStudentLoading = false;

  constructor(private fb: FormBuilder
    , private router: Router
  ) {
    // Admin form
    this.adminLoginForm = this.fb.group({
      adminId: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });

    // Student form
    this.studentLoginForm = this.fb.group({
      studentId: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false]
    });

    this.loadSavedCredentials();
  }

  loadSavedCredentials() {
    // Load admin credentials
    const savedAdminCredentials = localStorage.getItem('adminCredentials');
    if (savedAdminCredentials) {
      const credentials = JSON.parse(savedAdminCredentials);
      this.adminLoginForm.patchValue(credentials);
    }

    // Load student credentials
    const savedStudentCredentials = localStorage.getItem('studentCredentials');
    if (savedStudentCredentials) {
      const credentials = JSON.parse(savedStudentCredentials);
      this.studentLoginForm.patchValue(credentials);
    }
  }

  openModal() {
    this.showModal = true;
  }

  onClose() {
    this.showModal = false;
  }

  onAdminLogin() {
    if (this.adminLoginForm.valid) {
      this.isAdminLoading = true;

      // Simulate API call
      setTimeout(() => {
        this.isAdminLoading = false;

        if (this.adminLoginForm.value.rememberMe) {
          localStorage.setItem('adminCredentials', JSON.stringify(this.adminLoginForm.value));
        } else {
          localStorage.removeItem('adminCredentials');
        }

        console.log('Admin login successful:', this.adminLoginForm.value.adminId);
        this.onClose();
         
        this.showModal = false;
        this.router.navigate  (['/admin/ats-dashboard']);
        
      }, 1500);
    } else {
      Object.keys(this.adminLoginForm.controls).forEach(key => {
        this.adminLoginForm.get(key)?.markAsTouched();
      });
    }
  }

  onStudentLogin() {
    if (this.studentLoginForm.valid) {
      this.isStudentLoading = true;

      const studentId = this.studentLoginForm.value.studentId;
      const password = this.studentLoginForm.value.password;

      // Simulate API call for now
      setTimeout(() => {
        this.isStudentLoading = false;

        if (this.studentLoginForm.value.rememberMe) {
          localStorage.setItem('studentCredentials', JSON.stringify(this.studentLoginForm.value));
        } else {
          localStorage.removeItem('studentCredentials');
        }

        console.log('Student login successful:', studentId);
        this.onClose();
        this.showModal = false;
        this.router.navigate  (['/admin/ats-dashboard']);
      }, 2000);
    } else {
      Object.keys(this.studentLoginForm.controls).forEach(key => {
        this.studentLoginForm.get(key)?.markAsTouched();
      });
    }
  }

  onModalClick(event: Event) {
    if ((event.target as HTMLElement).classList.contains('modal')) {
      this.onClose();
    }
  }
}