import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PrimaryButton } from '../primary-button/primary-button';

@Component({
  selector: 'rfid-dropdown-search',
  standalone: true,
  imports: [
    InputTextModule,
    FormsModule,
    PrimaryButton
  ],
  templateUrl: './dropdown-search.html',
  styleUrl: './dropdown-search.scss',
})
export class DropdownSearch {
    searchText: string = '';

    @Input() searchPlaceholder: string = 'Search...';
    @Input() isAddVisible: boolean = false;
    @Input() isDeleteVisible: boolean = false;
    @Input() isButtonDisabled: boolean = true;


    @Output() searchChange = new EventEmitter<string>();
    @Output() addNewOnClick = new EventEmitter<string>();
    @Output() deleteOnClick = new EventEmitter<string>();

    onSearch() {
      this.searchChange.emit(this.searchText); // 🔹 You will see this log
    }

    onAddNew() {
      this.addNewOnClick.emit();
    }

    onDeleteData() {
      this.deleteOnClick.emit();
    }
}
