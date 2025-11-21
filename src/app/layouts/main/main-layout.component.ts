import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { SidenavComponent } from '../../components/sidenav/sidenav.component';
import { HeaderComponent } from '../../components/header/header';
import { Header } from 'primeng/api';
// import { AuthService } from '../../../services/auth.service';
// import { ToastComponent } from '../../components/toast/toast.component';
// input this to imports below "HeaderComponent, ToastComponent"
@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, SidenavComponent, HeaderComponent], 
  templateUrl: './main-layout.component.html',
})
export class MainLayoutComponent implements OnInit  {
   constructor(
    // private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
  //   if (!this.authService.isLoggedIn()) {
  //     console.log('Token not found, redirecting to login...');
  //     this.router.navigate(['/login']);
  //   } else {
  //     console.log('Token exists, redirecting to dashboard...');
  //     if (this.router.url === '/') {
  //       this.router.navigate(['/dashboard']);
  //     }
  //   }
  }
}
