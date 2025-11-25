import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header";
import { AdminLoginModalComponent } from "../../components/admin-login/login-modal";
@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [HeaderComponent, AdminLoginModalComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class LandingComponent {

}