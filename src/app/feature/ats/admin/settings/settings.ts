import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],   
  templateUrl: './settings.html',
  styleUrls: ['./settings.scss']
})
export class AdminSettingsComponent implements OnInit, OnDestroy {
  // Profile Settings
  profileSettings = {
    fullName: 'Admin User',
    email: 'admin@university.edu',
    mobile: '+63 912 345 6789'
  };

  // System Preferences
  systemPreferences = {
    theme: 'light',
    desktopNotifications: true
  };

  // Security Settings
  securitySettings = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactorAuth: false,
    loginAlerts: true
  };

  // Alert System
  alerts: any[] = [];
  private destroy$ = new Subject<void>();
  
  // Password strength
  passwordStrength = {
    score: 0,
    class: 'weak',
    width: '0%'
  };

  // Profile picture
  profilePreview = 'https://via.placeholder.com/150';
  
  // Today's date
  todayDate = '';

  constructor() {}

  ngOnInit() {
    this.setCurrentDate();
    this.loadSavedPreferences();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Profile Picture Upload
  onProfilePictureUpload(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePreview = e.target.result;
        localStorage.setItem('profilePicture', e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  // Save Profile Settings
  saveProfileSettings() {
    if (!this.profileSettings.fullName || !this.profileSettings.email) {
      this.showAlert('Please fill in all required fields', 'error');
      return;
    }

    if (!this.validateEmail(this.profileSettings.email)) {
      this.showAlert('Please enter a valid email address', 'error');
      return;
    }

    // Save to localStorage (in real app, this would be an API call)
    localStorage.setItem('adminFullName', this.profileSettings.fullName);
    localStorage.setItem('adminEmail', this.profileSettings.email);
    localStorage.setItem('adminMobile', this.profileSettings.mobile);

    this.showAlert('Profile settings saved successfully!', 'success');
  }

  // Save System Preferences
  savePreferences() {
    localStorage.setItem('desktopNotifications', this.systemPreferences.desktopNotifications.toString());
    localStorage.setItem('theme', this.systemPreferences.theme);
    
    this.handleThemeChange(this.systemPreferences.theme);
    this.showAlert('System preferences saved successfully!', 'success');
  }

  // Update Security Settings
  updateSecuritySettings() {
    if (!this.securitySettings.currentPassword) {
      this.showAlert('Please enter your current password', 'error');
      return;
    }

    if (this.securitySettings.newPassword !== this.securitySettings.confirmPassword) {
      this.showAlert('New passwords do not match!', 'error');
      return;
    }
    
    if (this.securitySettings.newPassword && this.securitySettings.newPassword.length < 8) {
      this.showAlert('Password must be at least 8 characters long!', 'error');
      return;
    }

    // Save security preferences
    localStorage.setItem('twoFactorAuth', this.securitySettings.twoFactorAuth.toString());
    localStorage.setItem('loginAlerts', this.securitySettings.loginAlerts.toString());

    // In a real app, you would make an API call to change the password
    if (this.securitySettings.newPassword) {
      setTimeout(() => {
        this.showAlert('Security settings updated successfully!', 'success');
        this.securitySettings.currentPassword = '';
        this.securitySettings.newPassword = '';
        this.securitySettings.confirmPassword = '';
        this.passwordStrength = { score: 0, class: 'weak', width: '0%' };
      }, 1000);
    } else {
      this.showAlert('Security preferences updated successfully!', 'success');
    }
  }

  // Theme Change Handler
  handleThemeChange(theme: string) {
    const themeIcon = document.querySelector('#themeToggle i') as HTMLElement;
    
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeIcon) {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
      }
    } else if (theme === 'light') {
      document.documentElement.removeAttribute('data-theme');
      if (themeIcon) {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
      }
    } else {
      // Auto mode - follow system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.setAttribute('data-theme', 'dark');
        if (themeIcon) {
          themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
      } else {
        document.documentElement.removeAttribute('data-theme');
        if (themeIcon) {
          themeIcon.classList.replace('fa-sun', 'fa-moon');
        }
      }
    }
  }

  // Check Password Strength
  checkPasswordStrength(password: string) {
    let strength = 0;
    const requirements = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      numbers: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password)
    };

    if (requirements.length) strength += 20;
    if (requirements.lowercase) strength += 20;
    if (requirements.uppercase) strength += 20;
    if (requirements.numbers) strength += 20;
    if (requirements.special) strength += 20;

    this.passwordStrength.score = strength;
    this.passwordStrength.width = `${strength}%`;
    
    if (strength <= 40) {
      this.passwordStrength.class = 'weak';
    } else if (strength <= 80) {
      this.passwordStrength.class = 'medium';
    } else {
      this.passwordStrength.class = 'strong';
    }
  }

  // Load Saved Preferences
  loadSavedPreferences() {
    // Load profile data
    const savedFullName = localStorage.getItem('adminFullName');
    const savedEmail = localStorage.getItem('adminEmail');
    const savedMobile = localStorage.getItem('adminMobile');
    const savedProfilePic = localStorage.getItem('profilePicture');

    if (savedFullName) this.profileSettings.fullName = savedFullName;
    if (savedEmail) this.profileSettings.email = savedEmail;
    if (savedMobile) this.profileSettings.mobile = savedMobile;
    if (savedProfilePic) this.profilePreview = savedProfilePic;

    // Load notification preferences
    const desktopNotifications = localStorage.getItem('desktopNotifications');
    const twoFactorAuth = localStorage.getItem('twoFactorAuth');
    const loginAlerts = localStorage.getItem('loginAlerts');
    const theme = localStorage.getItem('theme');
    
    if (desktopNotifications !== null) {
      this.systemPreferences.desktopNotifications = desktopNotifications === 'true';
    }
    if (twoFactorAuth !== null) {
      this.securitySettings.twoFactorAuth = twoFactorAuth === 'true';
    }
    if (loginAlerts !== null) {
      this.securitySettings.loginAlerts = loginAlerts === 'true';
    }
    if (theme) {
      this.systemPreferences.theme = theme;
    }
  }

  // Set Current Date
  setCurrentDate() {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    this.todayDate = now.toLocaleDateString('en-US', options);
  }

  // Validate Email
  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Show Notifications
  showNotifications() {
    this.showAlert('You have 3 new notifications', 'info');
  }

  // Alert System
  showAlert(message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info', duration: number = 5000) {
    const alertId = 'alert-' + Date.now();
    
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
      message,
      type,
      config,
      show: true
    };
    
    this.alerts.push(alert);
    
    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.removeAlert(alertId);
      }, duration);
    }
  }

  removeAlert(alertId: string) {
    const alertIndex = this.alerts.findIndex(alert => alert.id === alertId);
    if (alertIndex > -1) {
      this.alerts[alertIndex].show = false;
      setTimeout(() => {
        this.alerts.splice(alertIndex, 1);
      }, 400);
    }
  }

  // Track by function for alerts
  trackByAlertId(index: number, alert: any): string {
    return alert.id;
  }

  // Prevent default form submission
  onFormSubmit(event: Event) {
    event.preventDefault();
  }
}