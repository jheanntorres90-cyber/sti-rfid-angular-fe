import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
//import { DataTable } from '../../../components/data-table/data-table';
import { ButtonModule } from 'primeng/button';
//import { DropdownSearch } from '../../../components/dropdown-search/dropdown-search';
//import { CommonDialog } from "../../dialogs/common-dialog/common-dialog";
import { AdminTableComponent } from './admin-table/admin-table';
import { AdminData } from '../../../../models/admin-model';

@Component({
  selector: 'rfid-manage-admin',
  imports: [
    CommonModule,
    TableModule,
    InputTextModule,
    FormsModule,
    CardModule,
    //DataTable,
    ButtonModule,
    //DropdownSearch,
    //CommonDialog,
    //AdminTableComponent
],
  templateUrl: './manage-admin.component.html',
  styleUrl: './manage-admin.component.scss',
})
export class ManageAdminComponent {

  @ViewChild(AdminTableComponent)
  adminTable!: AdminTableComponent;

  onUpdateAdmin(data: AdminData) {
    // this.showAcademicCategoriesDialog.showAcademicCategoriesDialog(CommonMode.UPDATE, data);
  }

  onSelectedAdmin(selected: AdminData[]): void {
    // this.selectedAcademicCategories = selected;
    // console.log('Selected Academic Categories:', this.selectedAcademicCategories);
  }
}
