import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminLoginModalComponent } from './components/admin-login/login-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AdminLoginModalComponent],
  template: `
    <router-outlet></router-outlet>
    <app-admin-login-modal />
  `,
})
export class AppComponent {
  protected readonly title = signal('sti-rfid-angular-fe');
}