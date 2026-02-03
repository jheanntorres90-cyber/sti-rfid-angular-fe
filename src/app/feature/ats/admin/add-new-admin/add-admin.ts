import { Component, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-add-admin',
  standalone: true,
 imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './add-admin.html',
  styleUrls: ['./add-admin.scss']
})
export class AdminAddAdminComponent implements OnInit {
  // Form Groups
  adminForm: FormGroup;
  editForm: FormGroup;
  
  // State variables
  isModalOpen = false;
  showDeleteModal = false;
  isSubmitting = false;
  isUpdating = false;
  isDeleting = false;
  isLoading = false;
  showPassword = false;
  showEditPassword = false;
  
  // Data
  admins: any[] = [];
  adminToDelete: any = null;
  editingAdminId: number | null = null;
  
  // Pagination
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;
  totalItems = 0;
  
  // Constants
  roles = ['Super Admin', 'Moderator', 'Viewer'];
  alerts: any[] = [];
  
  // CSS Variables (matching vanilla CSS)
  cssVariables = {
    'primary-blue': '#2d68b8',
    'secondary-blue': '#4a90e2',
    'light-blue': '#e3f2fd',
    'dark-gray': '#333',
    'medium-gray': '#666',
    'light-gray': '#eee',
    'accent-yellow': '#ffc107',
    'white': '#fff',
    'border-radius': '8px',
    'shadow': '0 2px 10px rgba(0, 0, 0, 0.1)'
  };
  
  // View Children for file inputs
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('editFileInput') editFileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    // Initialize forms
    this.adminForm = this.createAdminForm();
    this.editForm = this.createEditForm();
  }

  ngOnInit(): void {
    this.loadAdmins();
    this.setCurrentDate();
    this.setCSSVariables();
  }

  // Set CSS variables on root element
  setCSSVariables(): void {
    const root = document.documentElement;
    Object.entries(this.cssVariables).forEach(([key, value]) => {
      this.renderer.setStyle(root, `--${key}`, value);
    });
  }

  // Form creation methods
  private createAdminForm(): FormGroup {
    return this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: [''],
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['', Validators.required],
      profilePic: ['https://via.placeholder.com/120?text=Upload+Photo']
    });
  }

  private createEditForm(): FormGroup {
    return this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      mobile: [''],
      role: ['', Validators.required],
      profilePic: ['https://via.placeholder.com/120?text=Update+Photo']
    });
  }

  // Load admins (with sample data matching vanilla JS)
  loadAdmins(): void {
    this.isLoading = true;
    
    // Simulate API call delay
    setTimeout(() => {
      this.admins = [
        {
          id: 0,
          fullName: 'Juan Dela Cruz',
          email: 'juan.dela.cruz@university.edu',
          mobile: '+63 912 345 6789',
          username: 'juan.dcruz',
          role: 'Super Admin',
          profilePic: 'https://via.placeholder.com/40'
        },
        {
          id: 1,
          fullName: 'Maria Santos',
          email: 'maria.santos@university.edu',
          mobile: '+63 917 890 1234',
          username: 'maria.santos',
          role: 'Moderator',
          profilePic: 'https://via.placeholder.com/40'
        },
        {
          id: 2,
          fullName: 'Robert Lim',
          email: 'robert.lim@university.edu',
          mobile: '+63 918 567 4321',
          username: 'robert.lim',
          role: 'Viewer',
          profilePic: 'https://via.placeholder.com/40'
        }
      ];
      
      this.totalItems = this.admins.length;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.isLoading = false;
    }, 500);
  }

  // Set current date (matching vanilla JS functionality)
  setCurrentDate(): void {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    const formattedDate = today.toLocaleDateString('en-US', options);
    
    // You can use this date in your template if needed
    console.log('Current Date:', formattedDate);
  }

  // Form submission handlers (matching vanilla JS functionality)
  onSubmit(): void {
    if (this.adminForm.invalid) {
      this.markFormGroupTouched(this.adminForm);
      this.showAlert('Please fill in all required fields', 'error');
      return;
    }

    const formData = this.adminForm.value;
    
    // Validate email format
    if (!this.validateEmail(formData.email)) {
      this.showAlert('Please enter a valid email address', 'error');
      return;
    }

    if (formData.password.length < 8) {
      this.showAlert('Password must be at least 8 characters long!', 'error');
      return;
    }

    this.isSubmitting = true;

    // Simulate API call (matching vanilla JS structure)
    setTimeout(() => {
      // Generate new admin ID
      const newId = this.admins.length > 0 ? Math.max(...this.admins.map(a => a.id)) + 1 : 0;
      
      // Create new admin object (matching vanilla JS structure)
      const newAdmin = {
        id: newId,
        fullName: formData.fullName,
        email: formData.email,
        mobile: formData.mobile,
        username: formData.username,
        role: formData.role,
        profilePic: formData.profilePic || 'https://via.placeholder.com/40'
      };

      // Add to list (at beginning like vanilla JS)
      this.admins.unshift(newAdmin);
      
      this.showAlert('Admin account created successfully!', 'success');
      
      // Reset form (matching vanilla JS)
      this.adminForm.reset();
      this.adminForm.patchValue({
        profilePic: 'https://via.placeholder.com/120?text=Upload+Photo'
      });
      
      // Update pagination
      this.totalItems = this.admins.length;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      
      this.isSubmitting = false;
    }, 1000);
  }

  onEditSubmit(): void {
    if (this.editForm.invalid || this.editingAdminId === null) {
      this.markFormGroupTouched(this.editForm);
      return;
    }

    this.isUpdating = true;

    // Simulate API call
    setTimeout(() => {
      const formData = this.editForm.value;
      const adminIndex = this.admins.findIndex(a => a.id === this.editingAdminId);
      
      if (adminIndex !== -1) {
        // Update admin (preserve existing data)
        this.admins[adminIndex] = {
          ...this.admins[adminIndex],
          fullName: formData.fullName,
          email: formData.email,
          mobile: formData.mobile,
          role: formData.role,
          profilePic: formData.profilePic || this.admins[adminIndex].profilePic
        };
      }

      this.showAlert('Admin account updated successfully!', 'success');
      this.closeModal();
      this.isUpdating = false;
    }, 1000);
  }

  // File upload handler (matching vanilla JS functionality)
  onFileSelected(event: Event, isEdit: boolean = false): void {
    const input = event.target as HTMLInputElement;
    
    if (!input.files || input.files.length === 0) {
      return;
    }

    const file = input.files[0];
    const reader = new FileReader();
    
    reader.onload = (e: any) => {
      const imageUrl = e.target.result;
      
      if (isEdit) {
        this.editForm.patchValue({ profilePic: imageUrl });
      } else {
        this.adminForm.patchValue({ profilePic: imageUrl });
      }
    };
    reader.readAsDataURL(file);
  }

  // Admin management methods (matching vanilla JS function names)
  editAdmin(adminId: number): void {
    const admin = this.admins.find(a => a.id === adminId);
    if (admin) {
      this.editingAdminId = admin.id;
      this.editForm.patchValue({
        fullName: admin.fullName,
        email: admin.email,
        mobile: admin.mobile,
        role: admin.role,
        profilePic: admin.profilePic || 'https://via.placeholder.com/120?text=Update+Photo'
      });
      this.isModalOpen = true;
    }
  }

  // For template compatibility
  editAdminFromRow(admin: any): void {
    this.editAdmin(admin.id);
  }

  deleteAdmin(adminId: number): void {
    const admin = this.admins.find(a => a.id === adminId);
    if (admin) {
      this.adminToDelete = admin;
      this.showAlert('Are you sure you want to delete this admin account?', 'warning', 0, true);
    }
  }

  // For template compatibility
  confirmDelete(admin: any): void {
    this.adminToDelete = admin;
    this.showDeleteModal = true;
  }

  // Execute delete
  executeDelete(): void {
    if (!this.adminToDelete?.id) {
      return;
    }

    this.isDeleting = true;

    setTimeout(() => {
      const adminIndex = this.admins.findIndex(a => a.id === this.adminToDelete.id);
      
      if (adminIndex !== -1) {
        this.admins.splice(adminIndex, 1);
      }

      this.showAlert('Admin account deleted successfully!', 'success');
      this.cancelDelete();
      
      // Update pagination
      this.totalItems = this.admins.length;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      
      this.isDeleting = false;
    }, 1000);
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.adminToDelete = null;
  }

  // Modal methods (matching vanilla JS function names)
  closeModal(): void {
    this.isModalOpen = false;
    this.editingAdminId = null;
    this.editForm.reset({
      profilePic: 'https://via.placeholder.com/120?text=Update+Photo'
    });
  }

  // UI helper methods
  togglePasswordVisibility(isEdit: boolean = false): void {
    if (isEdit) {
      this.showEditPassword = !this.showEditPassword;
    } else {
      this.showPassword = !this.showPassword;
    }
  }

  getRoleBadgeClass(role: string): string {
    switch(role) {
      case 'Super Admin': return 'role-super';
      case 'Moderator': return 'role-moderator';
      case 'Viewer': return 'role-viewer';
      default: return '';
    }
  }

  // Pagination methods
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  refreshAdmins(): void {
    this.currentPage = 1;
    this.loadAdmins();
    this.showAlert('Admin list refreshed.', 'info');
  }

  viewAdmin(admin: any): void {
    this.showAlert(
      `<strong>Admin Details</strong><br>
       <strong>Name:</strong> ${admin.fullName}<br>
       <strong>Email:</strong> ${admin.email}<br>
       <strong>Role:</strong> ${admin.role}<br>
       <strong>Username:</strong> ${admin.username}<br>
       <strong>Mobile:</strong> ${admin.mobile || 'N/A'}`,
      'info'
    );
  }

  // Utility methods
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Alert system (matching vanilla JS exactly)
  showAlert(message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info', 
           duration: number = 5000, showConfirm: boolean = false): void {
    
    const alertId = 'alert-' + Date.now();
    
    // Alert type configurations (matching vanilla JS)
    const alertConfig = {
      success: {
        icon: 'fas fa-check-circle',
        title: 'Success',
        class: 'alert-success'
      },
      info: {
        icon: 'fas fa-info-circle',
        title: 'Information',
        class: 'alert-info'
      },
      warning: {
        icon: 'fas fa-exclamation-triangle',
        title: 'Warning',
        class: 'alert-warning'
      },
      error: {
        icon: 'fas fa-times-circle',
        title: 'Error',
        class: 'alert-error'
      }
    };
    
    const config = alertConfig[type] || alertConfig.info;
    
    const alert = {
      id: alertId,
      type: type,
      title: config.title,
      message: message,
      showConfirm: showConfirm,
      duration: duration,
      class: config.class,
      icon: config.icon,
      show: false // For animation control
    };
    
    this.alerts.push(alert);
    
    // Trigger animation after a small delay
    setTimeout(() => {
      const alertIndex = this.alerts.findIndex(a => a.id === alertId);
      if (alertIndex !== -1) {
        this.alerts[alertIndex].show = true;
      }
    }, 10);
    
    // Auto remove after duration if not confirmation
    if (duration > 0 && !showConfirm) {
      setTimeout(() => {
        this.removeAlert(alertId);
      }, duration);
    }
  }

  removeAlert(alertId: string): void {
    const alertIndex = this.alerts.findIndex(a => a.id === alertId);
    if (alertIndex !== -1) {
      // Trigger hide animation
      this.alerts[alertIndex].show = false;
      
      // Remove after animation completes
      setTimeout(() => {
        this.alerts = this.alerts.filter(alert => alert.id !== alertId);
      }, 400);
    }
  }

  onAlertConfirm(alert: any): void {
    if (alert.type === 'warning' && alert.message.includes('delete') && this.adminToDelete) {
      this.executeDelete();
    }
    this.removeAlert(alert.id);
  }

  onAlertCancel(alert: any): void {
    this.removeAlert(alert.id);
  }

  // Form field getters for template
  get fullName() { return this.adminForm.get('fullName'); }
  get email() { return this.adminForm.get('email'); }
  get username() { return this.adminForm.get('username'); }
  get password() { return this.adminForm.get('password'); }
  get role() { return this.adminForm.get('role'); }
  
  get editFullName() { return this.editForm.get('fullName'); }
  get editEmail() { return this.editForm.get('email'); }
  get editRole() { return this.editForm.get('role'); }

  // Trigger file input click (matching vanilla JS behavior)
  triggerFileInput(isEdit: boolean = false): void {
    if (isEdit && this.editFileInput) {
      this.editFileInput.nativeElement.click();
    } else if (!isEdit && this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  // Show notifications (matching vanilla JS)
  showNotifications(): void {
    this.showAlert('You have 3 new notifications', 'info');
  }

  // For template to check if alert should show
  getAlertClass(alert: any): string {
    return alert.show ? 'alert show' : 'alert';
  }
}