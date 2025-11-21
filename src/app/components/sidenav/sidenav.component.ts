import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ATS_MENUS, GPS_MENUS } from './sidenav.menus';
import { MenuItem } from './sidenav.interface';


@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
})
export class SidenavComponent {
  sideNavOpen = true;
  atsMenuOpen = true;
  gpsMenuOpen = true;

  userRole = localStorage.getItem('userRoleName') || 'Admin';

  atsMenu: MenuItem[] = [];
  gpsMenu: MenuItem[] = [];

  constructor() {
    this.atsMenu = ATS_MENUS[this.userRole] || [];
    this.gpsMenu = GPS_MENUS[this.userRole] || [];
  }

  toggleSideNav() {
    this.sideNavOpen = !this.sideNavOpen;
  }
  toggleAtsMenu() {
    this.atsMenuOpen = !this.atsMenuOpen;
  }
  toggleGpsMenu() {
    this.gpsMenuOpen = !this.gpsMenuOpen;
  }
}
