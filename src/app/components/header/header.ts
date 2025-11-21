import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class HeaderComponent implements OnInit {

  // Properties used in the HTML
  @Input() pageTitle: string = 'Manage Announcements';
  currentDate: string = '';
  notificationCount: number = 3;
  userInitials: string = 'JD';
  userName: string = 'John Doe';

  constructor() {}

  ngOnInit(): void {
    this.currentDate = new Date().toLocaleDateString();
  }

  toggleTheme(): void {
    console.log("Theme toggled!");
  }
}

