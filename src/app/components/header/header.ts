import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true, 
  templateUrl: './header.html',
  styleUrls: ['./header.scss']
})
export class HeaderComponent implements OnInit {
  pageTitle: string = 'Manage Announcements';
  currentDate: Date = new Date();
  formattedDate: string = '';
  isDarkTheme: boolean = false;
  notificationCount: number = 3;
  userName: string = 'Admin User';
  userInitials: string = 'AU';

  ngOnInit() {
    this.updateDate();
    this.loadThemePreference();
  }

  updateDate() {
    this.currentDate = new Date();
    this.formatDate();
  }

  formatDate() {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const dayName = days[this.currentDate.getDay()];
    const monthName = months[this.currentDate.getMonth()];
    const day = this.currentDate.getDate();
    const year = this.currentDate.getFullYear();
    
    this.formattedDate = `${dayName}, ${monthName} ${day}, ${year}`;
  }

  toggleMenu() {
    const event = new CustomEvent('menuToggle');
    document.dispatchEvent(event);
    console.log('Menu toggled');
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
    this.saveThemePreference();
    console.log('Theme toggled:', this.isDarkTheme ? 'dark' : 'light');
  }

  applyTheme() {
    if (this.isDarkTheme) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }

  loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkTheme = savedTheme === 'dark';
    this.applyTheme();
  }

  saveThemePreference() {
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }

  showNotifications() {
    console.log('Show notifications clicked');
  }
}