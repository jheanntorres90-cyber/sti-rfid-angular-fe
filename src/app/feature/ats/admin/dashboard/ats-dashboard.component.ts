import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Activity {
  time: string;
  text: string;
  icon: string;
  iconClass: string;
}

interface StatCard {
  value: string;
  label: string;
  icon: string;
  color: 'blue' | 'yellow';
}

interface QuickAction {
  label: string;
  icon: string;
  action: string;
  route: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ats-dashboard.component.html',
  styleUrls: ['./ats-dashboard.component.scss']
})
export class AdminAtsDashboardComponent implements OnInit {
  currentDate: string = '';
  
  stats: StatCard[] = [
    { value: '3,240', label: 'Total Students', icon: 'fa-users', color: 'blue' },
    { value: '142', label: 'Total Faculty', icon: 'fa-chalkboard-teacher', color: 'yellow' },
    { value: '92%', label: 'Attendance Today', icon: 'fa-calendar-check', color: 'blue' },
    { value: '18', label: 'Active Announcements', icon: 'fa-bullhorn', color: 'yellow' }
  ];
  
  quickActions: QuickAction[] = [
    { label: 'Attendance', icon: 'fa-calendar-check', action: 'attendance', route: '/admin/attendance' },
    { label: 'Students', icon: 'fa-user-graduate', action: 'students', route: '/admin/students' },
    { label: 'Schedule', icon: 'fa-clock', action: 'schedule', route: '/admin/schedule' },
    { label: 'Announcements', icon: 'fa-bullhorn', action: 'announcements', route: '/admin/announcements' }
  ];
  
  activities: Activity[] = [
    { time: '08:00 AM', text: 'Gate Attendance recorded for John Doe (RFID)', icon: 'fa-id-card', iconClass: 'activity-icon' },
    { time: '08:15 AM', text: 'Gate Attendance recorded for Jane Smith (Face Recognition)', icon: 'fa-camera', iconClass: 'activity-icon' },
    { time: '09:00 AM', text: 'Math class attendance submitted by Dr. Rodriguez', icon: 'fa-chalkboard', iconClass: 'activity-icon' }
  ];
  
  notificationsCount: number = 3;
  
  ngOnInit(): void {
    this.setCurrentDate();
    this.showWelcomeAlert();
    this.simulateSystemAlerts();
  }
  
  private setCurrentDate(): void {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    this.currentDate = now.toLocaleDateString('en-US', options);
  }
  
  private showWelcomeAlert(): void {
    this.showAlert('Welcome to Admin Dashboard! System is running smoothly.', 'info');
  }
  
  private simulateSystemAlerts(): void {
    setTimeout(() => {
      this.showAlert('System maintenance scheduled for tonight at 11 PM', 'warning');
    }, 5000);
    
    setTimeout(() => {
      this.showAlert('Daily backup completed successfully', 'success');
    }, 10000);
  }
  
  handleQuickAction(action: string): void {
    const actionHandlers: { [key: string]: () => void } = {
      attendance: () => {
        this.showAlert('Opening Attendance Management...', 'info');
        // Navigate to attendance page
      },
      students: () => {
        this.showAlert('Opening Student Management...', 'info');
        // Navigate to students page
      },
      schedule: () => {
        this.showAlert('Schedule module is under maintenance', 'warning');
      },
      announcements: () => {
        this.showAlert('Opening Announcements Management...', 'info');
        // Navigate to announcements page
      }
    };
    
    if (actionHandlers[action]) {
      actionHandlers[action]();
    } else {
      this.showAlert('Action not available', 'error');
    }
  }
  
  showNotifications(): void {
    this.showAlert(`You have ${this.notificationsCount} new notifications`, 'info', 3000);
    
    // Mark notifications as read
    setTimeout(() => {
      this.notificationsCount = 0;
    }, 2000);
  }
  
  handleStatClick(stat: StatCard): void {
    this.showAlert(`Viewing details for: ${stat.label} (${stat.value})`, 'info');
  }
  
  private showAlert(message: string, type: 'success' | 'error' | 'info' | 'warning', duration: number = 5000): void {
    // In a real app, you would use a proper alert/notification service
    console.log(`${type.toUpperCase()}: ${message}`);
    
    // For now, we'll use browser alert for demonstration
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type}`;
    alertElement.textContent = message;
    alertElement.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 12px 24px;
      border-radius: 8px;
      color: white;
      font-weight: 500;
      z-index: 1000;
      animation: slideIn 0.3s ease;
    `;
    
    switch(type) {
      case 'success':
        alertElement.style.backgroundColor = '#10b981';
        break;
      case 'error':
        alertElement.style.backgroundColor = '#ef4444';
        break;
      case 'warning':
        alertElement.style.backgroundColor = '#f59e0b';
        break;
      case 'info':
        alertElement.style.backgroundColor = '#3b82f6';
        break;
    }
    
    document.body.appendChild(alertElement);
    
    setTimeout(() => {
      alertElement.remove();
    }, duration);
  }
}