import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TableColumn } from '../../../models/table-column.model';
import { environment } from '../../../environments/environment.dit';

@Component({
  selector: 'sti-data-table',
  standalone: true,
  imports: [
    TableModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    CardModule,
    CommonModule
  ],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTable {
  @Input() value: any[] = [];
  @Input() columns: TableColumn[] = [];

  @Input() rowsPerPage = 10;
  @Input() first = 0;
  @Input() totalRecords = 0;
  @Input() rowsPerPageOptions: number[] = [12, 25, 50];
  @Input() selection: any[] = [];
  @Input() dataKey: string = 'id';
  @Input() lazy = false;
  @Input() customSort = false;

  @Output() onLazyLoad = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any>();
  @Output() actionClick = new EventEmitter<{ action: string; row: any }>();

  handleAction(action: string, row: any) {
    this.actionClick.emit({ action, row });
  }

   private imageURL = `${environment.imageURL}`

  getImageURL(imagePath: string | null): string {
    const baseURL = this.imageURL;
    return imagePath ? `${baseURL}/${imagePath}` : 'assets/images/no-image.png';
  }

  getActionButtonClass(actionName: string): string {
    const baseClasses = 'p-button-text p-1'; 
    switch (actionName.toLowerCase()) {
      case 'delete':
        // Ito ang magiging selector: .p-button.action-delete
        return `${baseClasses} action-delete`; 
      case 'edit':
        // Ito ang magiging selector: .p-button.action-update
        return `${baseClasses} action-update`; 
      case 'view':
        // Ito ang magiging selector: .p-button.action-view
        return `${baseClasses} action-view`;
      default:
        return baseClasses;
    }
  }

}
