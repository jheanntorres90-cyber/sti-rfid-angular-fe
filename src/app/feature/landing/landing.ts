import { Component } from '@angular/core'
import { HeaderComponent } from '../../components/header/header';
import { LoginModalComponent } from '../dialogs/admin/admin-login-dialog/login';



@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [HeaderComponent, LoginModalComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class LandingComponent {

}
