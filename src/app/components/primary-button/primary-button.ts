import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'rfid-primary-button',
  imports: [
    ButtonModule
  ],
  templateUrl: './primary-button.html',
  styleUrl: './primary-button.scss',
})
export class PrimaryButton {
  @Input() label: string = 'Button';       // Button text
  @Input() icon: string = '';              // Optional icon
  @Input() class: string = '';             // Extra CSS classes
  @Input() type: 'button' | 'submit' = 'button'; // Button type
  @Input() disabled: boolean = false;     // Disabled state
  @Input() hidden: boolean = false; 
  @Input() width: string = '120px';

  @Output() addNewOnClick = new EventEmitter<void>();

  handleClick() {
    this.addNewOnClick.emit();
  }
}

