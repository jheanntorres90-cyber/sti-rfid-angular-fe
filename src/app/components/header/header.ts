import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common'; // ADD THIS IMPORT

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
  providers: [DatePipe] // ADD THIS LINE
})
export class HeaderComponent implements OnInit {
  todayDate: Date = new Date();
  isDarkTheme: boolean = false;
  isMenuOpen: boolean = false;

  // ADD CONSTRUCTOR WITH DATEPIPE
  constructor(private datePipe: DatePipe) {}

  ngOnInit() {
    this.updateDate();
    this.loadThemePreference();
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    console.log('Menu toggled. Is open:', this.isMenuOpen);
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    if (this.isDarkTheme) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }

  loadThemePreference(): void {
    const savedTheme = localStorage.getItem('theme');
    this.isDarkTheme = savedTheme === 'dark';
    if (this.isDarkTheme) {
      document.body.setAttribute('data-theme', 'dark');
    }
  }

  showNotifications(): void {
    console.log('Show notifications');
    alert('You have 3 new notifications!');
  }

  updateDate(): void {
    setInterval(() => {
      this.todayDate = new Date();
    }, 60000);
  }

  // ADD THIS METHOD TO FORMAT DATE
  getFormattedDate(): string {
    return this.datePipe.transform(this.todayDate, 'EEEE, MMMM d, y') || '';
  }
}