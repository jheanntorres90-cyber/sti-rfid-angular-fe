import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ADMIN_MENUS, ATS_MENUS, GPS_MENUS } from './sidenav.menus';
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
  adminMenuOpen = true;

  userRole = localStorage.getItem('userRoleName') || 'Admin';

  atsMenu: MenuItem[] = [];
  gpsMenu: MenuItem[] = [];
  adminMenu: MenuItem[] = [];

  constructor() {
    this.atsMenu = ATS_MENUS[this.userRole] || [];
    this.gpsMenu = GPS_MENUS[this.userRole] || [];
    this.adminMenu = ADMIN_MENUS[this.userRole] || [];
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
  toggleAdminMenu() {
    this.adminMenuOpen = !this.adminMenuOpen;
  }
}
