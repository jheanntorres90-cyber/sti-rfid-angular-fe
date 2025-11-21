import { ChangeDetectorRef, Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { DataTable } from '../../../../components/data-table/data-table';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { AdminData } from '../../../../../models/admin-model';
import { DialogModeEnum } from '../../../../../enum/dialog-mode-enum';
import { TableColumn } from '../../../../../models/table-column.model';
import { AdminService } from '../../../../../service/admin-service';
import { ToastService } from '../../../../../service/toast-service';
import { CommonPayload } from '../../../../../payload/common-payload';
import { ErrorModel } from '../../../../../models/error-model';

@Component({
  selector: 'rfid-admin-table',
  standalone: true,
  imports: [
    CommonModule,
    DataTable,
    TableModule,
  ],
  templateUrl: './admin-table.html',
  styleUrl: './admin-table.scss',
})
export class AdminTableComponent {
  @Output() onUpdateEmitter = new EventEmitter <AdminData>();
  @Output() onSelectedData = new EventEmitter<AdminData[]>();

  @ViewChild('dt2') table: any;

  loading = false;
  listOfData: AdminData[] = [];
  selectedData: AdminData[] = [];
 
  totalItems = 0;
  totalRecords = 0;
  rowsPerPage = 12;
  first = 0;
  activeTab = 0;
  deleteShowDialog = false;
  selectedStatus: string | null = null;
  mode: DialogModeEnum = DialogModeEnum.ADD;

  searchText: string = '';
  message = '';

  columns: TableColumn[] = [
    { field: 'image_path', header: 'Image', isImage: true }, 
    { field: 'variant_name', header: 'Variant Name', sortable: true },
    {
      field: 'actions',
      header: 'Actions',
      isAction: true,
      actions: [
        { label: '', icon: 'pi pi-pencil', action: 'edit' },
        { label: '', icon: 'pi pi-trash', action: 'delete' }
      ]
    }
  ];

  constructor(
    private service: AdminService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
  ) { }

  onUpdate(data: AdminData): void {
    console.log('Update admin data:', data);
    this.onUpdateEmitter.emit(data);
  }

  onSelectionChange(): void {
    this.onSelectedData.emit(this.selectedData);
  }

  handleAction(event: { action: string; row: any }) {
    // console.log('Action clicked:', event.action, 'Row:', event.row);

    // if (event.action === 'edit') {
    //   // handle edit logic
    //   this.dialog.showDialog(DialogModeEnum.UPDATE, event.row);
    // } else if (event.action === 'delete') {
    //   // handle delete logic
    //   this.showDeleteConfirmDialog = true
    //   this.selectedVariantIDs = [event.row.id]
    //   console.log('test dito11', this.selectedVariantIDs);
    // }
  }

  loadLazyVariants(event: any) {
    const token = '';
    const pageNumber = Math.floor(event.first / event.rows) + 1;

    const filter: CommonPayload = {
     page: pageNumber,
     per_page: event.rows,
     search_name: this.searchText
    }

    this.service.getListDataFilter(filter, token).subscribe({
      next: (res) => {
        console.log('✅ Data from API:', res);

        this.listOfData = res?.data ?? [];
        console.log('📦 Data now:', this.listOfData);

        this.totalItems = res?.pagination?.total ?? 0;
        this.rowsPerPage = filter.per_page ?? 0;
        this.first = event.first;

        this.cdr.detectChanges();
      },
      error: (err: ErrorModel) => {
        console.error('Error', this.message = err.message || 'Import failed.');
        this.toastService.showError('Error', this.message = err.message || 'Import failed.');
        this.listOfData = [];
        this.totalItems = 0;
      }
      });
    } 
}
