import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';     
import { FormsModule } from '@angular/forms';

interface Admin {
  id: number;
  fullName: string;
  email: string;
  role: 'super_admin' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'deleted';
  created: string;
  deletedAt?: string;
}

interface Alert {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface ProfileData {
  fullName: string;
  email: string;
  mobile: string;
  profilePicture?: string;
}

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gps-settings.html',
  styleUrls: ['./gps-settings.scss']
})
export class AdminGpsSettingsComponent implements OnInit {
  // Theme Management
  currentTheme: 'light' | 'dark' | 'auto' = 'light';
  showSidebar = false;
  
  // Profile Settings
  profileData: ProfileData = {
    fullName: 'Admin User',
    email: 'admin@university.edu',
    mobile: '+63 912 345 6789',
    profilePicture: 'https://via.placeholder.com/150'
  };
  
  // Preferences
  themePreference: 'light' | 'dark' | 'auto' = 'light';
  desktopNotifications = true;
  
  // Security Settings
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  twoFactorAuth = false;
  loginAlerts = true;
  passwordStrength = 0;
  passwordStrengthClass: 'weak' | 'medium' | 'strong' | 'none' = 'none';
  
  // Admin Management
  admins: Admin[] = [
    {
      id: 1,
      fullName: 'Admin User',
      email: 'admin@university.edu',
      role: 'super_admin',
      status: 'active',
      created: '2023-01-15'
    },
    {
      id: 2,
      fullName: 'John Smith',
      email: 'john.smith@university.edu',
      role: 'admin',
      status: 'active',
      created: '2023-03-20'
    },
    {
      id: 3,
      fullName: 'Sarah Johnson',
      email: 'sarah.johnson@university.edu',
      role: 'moderator',
      status: 'active',
      created: '2023-05-10'
    },
    {
      id: 4,
      fullName: 'Michael Brown',
      email: 'michael.brown@university.edu',
      role: 'admin',
      status: 'deleted',
      deletedAt: '2023-08-15',
      created: '2023-02-28'
    }
  ];
  
  // Filtered Admins
  filteredAdmins: Admin[] = [];
  adminSearchTerm = '';
  currentAdminTab: 'active' | 'deleted' = 'active';
  
  // Modal States
  showAddAdminModal = false;
  showDeleteAdminModal = false;
  showRestoreAdminModal = false;
  
  // Modal Data
  newAdminData = {
    fullName: '',
    email: '',
    role: '' as 'super_admin' | 'admin' | 'moderator' | ''
  };
  
  adminToDelete: number | null = null;
  adminToRestore: number | null = null;
  
  // Alert System
  alerts: Alert[] = [];
  
  // Quick Search
  quickSearchTerm = '';
  
  // Role Options
  roleOptions = [
    { value: 'super_admin', label: 'Super Administrator' },
    { value: 'admin', label: 'Administrator' },
    { value: 'moderator', label: 'Moderator' }
  ];
  
  // Theme Options
  themeOptions = [
    { value: 'light', label: 'Light Theme' },
    { value: 'dark', label: 'Dark Theme' },
    { value: 'auto', label: 'Auto (System Default)' }
  ];
  
  // File Upload
  @ViewChild('profileUpload') profileUpload!: ElementRef;
  @ViewChild('fileInput') fileInput!: ElementRef;

  ngOnInit(): void {
    this.loadSavedPreferences();
    this.filterAdmins();
  }

  // Theme Management
  toggleTheme(): void {
    const html = document.documentElement;
    if (this.currentTheme === 'light') {
      this.currentTheme = 'dark';
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      this.currentTheme = 'light';
      html.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }

  toggleSidebar(): void {
    this.showSidebar = !this.showSidebar;
  }

  // Profile Management
  onProfilePictureClick(): void {
    if (this.fileInput) {
      this.fileInput.nativeElement.click();
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleProfilePictureUpload(input.files[0]);
    }
  }

  handleProfilePictureUpload(file: File): void {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileData.profilePicture = e.target.result;
        localStorage.setItem('profilePicture', e.target.result);
        this.showAlert('Profile picture updated successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfileSettings(): void {
    // Validate inputs
    if (!this.profileData.fullName || !this.profileData.email) {
      this.showAlert('Please fill in all required fields', 'error');
      return;
    }

    if (!this.validateEmail(this.profileData.email)) {
      this.showAlert('Please enter a valid email address', 'error');
      return;
    }

    // Save to localStorage (in real app, this would be an API call)
    localStorage.setItem('adminFullName', this.profileData.fullName);
    localStorage.setItem('adminEmail', this.profileData.email);
    localStorage.setItem('adminMobile', this.profileData.mobile);

    this.showAlert('Profile settings saved successfully!', 'success');
  }

  // Preferences Management
  savePreferences(): void {
    // Save notification preferences
    localStorage.setItem('desktopNotifications', this.desktopNotifications.toString());

    // Handle theme change
    this.handleThemeChange(this.themePreference);

    this.showAlert('System preferences saved successfully!', 'success');
  }

  handleThemeChange(theme: 'light' | 'dark' | 'auto'): void {
    if (theme === 'dark') {
      this.currentTheme = 'dark';
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else if (theme === 'light') {
      this.currentTheme = 'light';
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      // Auto mode - follow system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        this.currentTheme = 'dark';
        document.documentElement.setAttribute('data-theme', 'dark');
      } else {
        this.currentTheme = 'light';
        document.documentElement.removeAttribute('data-theme');
      }
      localStorage.setItem('theme', 'auto');
    }
  }

  // Security Management
  updateSecuritySettings(): void {
    // Validate passwords
    if (!this.currentPassword) {
      this.showAlert('Please enter your current password', 'error');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.showAlert('New passwords do not match!', 'error');
      return;
    }

    if (this.newPassword && this.newPassword.length < 8) {
      this.showAlert('Password must be at least 8 characters long!', 'error');
      return;
    }

    // Save security preferences
    localStorage.setItem('twoFactorAuth', this.twoFactorAuth.toString());
    localStorage.setItem('loginAlerts', this.loginAlerts.toString());

    // In a real app, you would make an API call to change the password
    if (this.newPassword) {
      // Simulate password change
      setTimeout(() => {
        this.showAlert('Security settings updated successfully!', 'success');
        this.resetSecurityForm();
      }, 1000);
    } else {
      this.showAlert('Security preferences updated successfully!', 'success');
    }
  }

  resetSecurityForm(): void {
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.passwordStrength = 0;
    this.passwordStrengthClass = 'none';
  }

  checkPasswordStrength(password: string): void {
    // Simple password strength check
    let strength = 0;
    const requirements = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };

    // Calculate strength
    if (requirements.length) strength += 20;
    if (requirements.lowercase) strength += 20;
    if (requirements.uppercase) strength += 20;
    if (requirements.numbers) strength += 20;
    if (requirements.special) strength += 20;

    this.passwordStrength = strength;

    // Determine strength class
    if (strength <= 40) {
      this.passwordStrengthClass = 'weak';
    } else if (strength <= 80) {
      this.passwordStrengthClass = 'medium';
    } else if (strength > 0) {
      this.passwordStrengthClass = 'strong';
    } else {
      this.passwordStrengthClass = 'none';
    }
  }

  // Admin Management
  filterAdmins(): void {
    this.filteredAdmins = this.admins.filter(admin => {
      const matchesTab = this.currentAdminTab === 'active' 
        ? admin.status === 'active' 
        : admin.status === 'deleted';
      
      const matchesSearch = !this.adminSearchTerm || 
        admin.fullName.toLowerCase().includes(this.adminSearchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(this.adminSearchTerm.toLowerCase());
      
      return matchesTab && matchesSearch;
    });
  }

  onAdminSearchChange(): void {
    this.filterAdmins();
  }

  switchAdminTab(tab: 'active' | 'deleted'): void {
    this.currentAdminTab = tab;
    this.filterAdmins();
  }

  getAdminInitials(fullName: string): string {
    return fullName.split(' ').map(name => name.charAt(0)).join('').toUpperCase();
  }

  getRoleLabel(role: string): string {
    const roleMap: { [key: string]: string } = {
      'super_admin': 'Super Admin',
      'admin': 'Administrator',
      'moderator': 'Moderator'
    };
    return roleMap[role] || role;
  }

  getStatusClass(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'status-active',
      'inactive': 'status-inactive',
      'deleted': 'status-deleted'
    };
    return statusMap[status] || '';
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      'active': 'Active',
      'inactive': 'Inactive',
      'deleted': 'Deleted'
    };
    return statusMap[status] || status;
  }

  // Modal Functions
  openAddAdminModal(): void {
    this.newAdminData = { fullName: '', email: '', role: '' };
    this.showAddAdminModal = true;
  }

  closeAddAdminModal(): void {
    this.showAddAdminModal = false;
  }

  openDeleteAdminModal(adminId: number): void {
    this.adminToDelete = adminId;
    this.showDeleteAdminModal = true;
  }

  closeDeleteAdminModal(): void {
    this.adminToDelete = null;
    this.showDeleteAdminModal = false;
  }

  openRestoreAdminModal(adminId: number): void {
    this.adminToRestore = adminId;
    this.showRestoreAdminModal = true;
  }

  closeRestoreAdminModal(): void {
    this.adminToRestore = null;
    this.showRestoreAdminModal = false;
  }

  // Admin Operations
  addAdmin(): void {
    // Validate inputs
    if (!this.newAdminData.fullName || !this.newAdminData.email || !this.newAdminData.role) {
      this.showAlert('Please fill in all required fields', 'error');
      return;
    }

    if (!this.validateEmail(this.newAdminData.email)) {
      this.showAlert('Please enter a valid email address', 'error');
      return;
    }

    // Create new admin
    const newAdmin: Admin = {
      id: Math.max(...this.admins.map(a => a.id)) + 1,
      fullName: this.newAdminData.fullName,
      email: this.newAdminData.email,
      role: this.newAdminData.role as any,
      status: 'active',
      created: new Date().toISOString().split('T')[0]
    };

    // Add to admins array
    this.admins.push(newAdmin);
    
    // Show success message
    this.showAlert(`Admin ${newAdmin.fullName} added successfully!`, 'success');
    
    // Close modal and refresh admin list
    this.closeAddAdminModal();
    this.filterAdmins();
  }

  confirmDeleteAdmin(): void {
    if (this.adminToDelete) {
      const adminIndex = this.admins.findIndex(admin => admin.id === this.adminToDelete);
      if (adminIndex !== -1) {
        this.admins[adminIndex].status = 'deleted';
        this.admins[adminIndex].deletedAt = new Date().toISOString().split('T')[0];
        
        this.showAlert('Admin has been deleted successfully', 'success');
        this.filterAdmins();
      }
      
      this.closeDeleteAdminModal();
    }
  }

  confirmRestoreAdmin(): void {
    if (this.adminToRestore) {
      const adminIndex = this.admins.findIndex(admin => admin.id === this.adminToRestore);
      if (adminIndex !== -1) {
        this.admins[adminIndex].status = 'active';
        delete this.admins[adminIndex].deletedAt;
        
        this.showAlert('Admin has been restored successfully', 'success');
        this.filterAdmins();
      }
      
      this.closeRestoreAdminModal();
    }
  }

  // Quick Search
  onQuickSearch(): void {
    if (this.quickSearchTerm.trim()) {
      this.showAlert(`Searching for: ${this.quickSearchTerm}`, 'info');
    }
  }

  // Notification
  showNotifications(): void {
    this.showAlert('You have 3 new notifications', 'info');
  }

  // Alert System
  showAlert(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    const alert: Alert = {
      id: `alert-${Date.now()}`,
      message,
      type
    };
    
    this.alerts.push(alert);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
      this.removeAlert(alert.id);
    }, 5000);
  }

  removeAlert(alertId: string): void {
    this.alerts = this.alerts.filter(alert => alert.id !== alertId);
  }

  getAlertIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      'success': 'fa-check-circle',
      'error': 'fa-exclamation-circle',
      'warning': 'fa-exclamation-triangle',
      'info': 'fa-info-circle'
    };
    return iconMap[type] || 'fa-info-circle';
  }

  // Utility Functions
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  loadSavedPreferences(): void {
    // Load profile data
    const savedFullName = localStorage.getItem('adminFullName');
    const savedEmail = localStorage.getItem('adminEmail');
    const savedMobile = localStorage.getItem('adminMobile');
    const savedProfilePic = localStorage.getItem('profilePicture');

    if (savedFullName) this.profileData.fullName = savedFullName;
    if (savedEmail) this.profileData.email = savedEmail;
    if (savedMobile) this.profileData.mobile = savedMobile;
    if (savedProfilePic) this.profileData.profilePicture = savedProfilePic;

    // Load notification preferences
    const desktopNotifications = localStorage.getItem('desktopNotifications');
    const twoFactorAuth = localStorage.getItem('twoFactorAuth');
    const loginAlerts = localStorage.getItem('loginAlerts');
    
    if (desktopNotifications !== null) {
      this.desktopNotifications = desktopNotifications === 'true';
    }
    if (twoFactorAuth !== null) {
      this.twoFactorAuth = twoFactorAuth === 'true';
    }
    if (loginAlerts !== null) {
      this.loginAlerts = loginAlerts === 'true';
    }
    
    // Load theme preference
    const theme = localStorage.getItem('theme') as 'light' | 'dark' | 'auto' | null;
    if (theme) {
      this.themePreference = theme;
      this.handleThemeChange(theme);
    }
  }

  // Close modals when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    
    if (target.classList.contains('modal')) {
      if (this.showAddAdminModal) this.closeAddAdminModal();
      if (this.showDeleteAdminModal) this.closeDeleteAdminModal();
      if (this.showRestoreAdminModal) this.closeRestoreAdminModal();
    }
  }

  // Prevent modal close when clicking inside modal content
  onModalClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}