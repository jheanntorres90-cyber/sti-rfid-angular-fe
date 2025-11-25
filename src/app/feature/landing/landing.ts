import { Component } from '@angular/core'
import { HeaderComponent } from "../../../components/header/header";


@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class LandingComponent {

}
