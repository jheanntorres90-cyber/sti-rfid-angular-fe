import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FileInfo {
  name: string;
  size: string;
  file?: File;
}

interface SummaryData {
  dataType: string;
  format: string;
  records: string;
  size: string;
}

@Component({
  selector: 'app-data-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './data-management.html',
  styleUrls: ['./data-management.scss']
})
export class AdminGpsDataManagementComponent implements OnInit {
  // Tab Management
  activeTab: 'import' | 'export' = 'import';
  
  // Import Tab Properties
  selectedDataType: string = '';
  importFileInfo: FileInfo | null = null;
  isDragging = false;
  
  // Import Options
  validateData = true;
  skipDuplicates = false;
  createBackup = true;
  
  // Import Progress
  importProgress = 0;
  importStatus = '';
  importStatusType: 'info' | 'success' | 'error' = 'info';
  showImportProgress = false;
  showImportFileInfo = false;
  
  // Template Section
  showTemplateSection = false;
  
  // Export Tab Properties
  exportDataType: string = '';
  selectedFormat: string = '';
  
  // Export Options
  includeHeaders = true;
  compressFile = false;
  encryptFile = false;
  showFilters = false;
  
  // Filter Values
  dateFrom: string = '';
  dateTo: string = '';
  program: string = '';
  yearLevel: string = '';
  status: string = '';
  
  // Export Progress
  exportProgress = 0;
  exportStatus = '';
  exportStatusType: 'info' | 'success' | 'error' = 'info';
  showExportProgress = false;
  
  // Summary Data
  summaryData: SummaryData = {
    dataType: '-',
    format: '-',
    records: '-',
    size: '-'
  };
  showSummary = false;
  
  // Data Type Options
  dataTypes = [
    { value: 'students', label: 'Student Records' },
    { value: 'grades', label: 'Grades Data' },
    { value: 'payments', label: 'Payment Records' },
    { value: 'schedule', label: 'Class Schedules' },
    { value: 'enrollment', label: 'Enrollment Data' },
    { value: 'faculty', label: 'Faculty Information' },
    { value: 'courses', label: 'Course Information' },
    { value: 'attendance', label: 'Attendance Records' }
  ];
  
  // Template Options
  templates = [
    { type: 'students', icon: 'users', title: 'Student Records', desc: 'Template for importing student data' },
    { type: 'grades', icon: 'book', title: 'Grades Data', desc: 'Template for importing grades' },
    { type: 'payments', icon: 'wallet', title: 'Payment Records', desc: 'Template for importing payments' },
    { type: 'schedule', icon: 'calendar', title: 'Class Schedules', desc: 'Template for importing schedules' }
  ];
  
  // Export Format Options
  exportFormats = [
    { format: 'csv', icon: 'file-csv', title: 'CSV', desc: 'Comma-separated values format' },
    { format: 'xlsx', icon: 'file-excel', title: 'Excel (XLSX)', desc: 'Microsoft Excel format' },
    { format: 'pdf', icon: 'file-pdf', title: 'PDF', desc: 'Portable document format' },
    { format: 'json', icon: 'file-code', title: 'JSON', desc: 'JavaScript object notation' }
  ];
  
  // Program Options
  programs = [
    { value: '', label: 'All Programs' },
    { value: 'cs', label: 'Computer Science' },
    { value: 'it', label: 'Information Technology' },
    { value: 'eng', label: 'Engineering' },
    { value: 'bus', label: 'Business Administration' }
  ];
  
  // Year Level Options
  yearLevels = [
    { value: '', label: 'All Years' },
    { value: '1', label: '1st Year' },
    { value: '2', label: '2nd Year' },
    { value: '3', label: '3rd Year' },
    { value: '4', label: '4th Year' }
  ];
  
  // Status Options
  statuses = [
    { value: '', label: 'All Statuses' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'graduated', label: 'Graduated' },
    { value: 'withdrawn', label: 'Withdrawn' }
  ];

  ngOnInit(): void {
    // Initialize with current date
    const today = new Date().toISOString().split('T')[0];
    this.dateTo = today;
    
    // Set date from to 30 days ago
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 30);
    this.dateFrom = pastDate.toISOString().split('T')[0];
  }

  // Tab Management
  switchTab(tab: 'import' | 'export'): void {
    this.activeTab = tab;
  }

  // Import Tab Methods
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      this.handleFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    
    if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
      this.handleFile(event.dataTransfer.files[0]);
    }
  }

  handleFile(file: File): void {
    const validTypes = ['.csv', '.xlsx', '.xls'];
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!validTypes.includes(fileExt)) {
      alert('Invalid file type. Please upload CSV or Excel files only.');
      return;
    }
    
    if (file.size > 50 * 1024 * 1024) {
      alert('File size exceeds 50MB limit.');
      return;
    }
    
    this.importFileInfo = {
      name: file.name,
      size: this.formatFileSize(file.size),
      file: file
    };
    this.showImportFileInfo = true;
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  clearImportFile(): void {
    this.importFileInfo = null;
    this.showImportFileInfo = false;
  }

  startImport(): void {
    if (!this.selectedDataType) {
      alert('Please select a data type.');
      return;
    }
    
    if (!this.importFileInfo) {
      alert('Please select a file to import.');
      return;
    }
    
    this.showImportProgress = true;
    this.importProgress = 0;
    this.importStatus = 'Validating file...';
    this.importStatusType = 'info';
    
    const interval = setInterval(() => {
      this.importProgress += Math.random() * 15;
      if (this.importProgress > 100) this.importProgress = 100;
      
      if (this.importProgress < 30) {
        this.importStatus = 'Validating file structure...';
      } else if (this.importProgress < 60) {
        this.importStatus = 'Processing records...';
      } else if (this.importProgress < 90) {
        this.importStatus = 'Importing data into database...';
      }
      
      if (this.importProgress >= 100) {
        clearInterval(interval);
        this.importStatusType = 'success';
        this.importStatus = 'Import completed successfully! 1,234 records imported.';
      }
    }, 200);
  }

  downloadTemplate(type: string): void {
    alert(`Downloading ${type} template...`);
    // In a real application, trigger file download
  }

  viewHistory(): void {
    alert('Opening import history...');
  }

  // Export Tab Methods
  selectFormat(format: string): void {
    this.selectedFormat = format;
    this.updateSummary();
  }

  updateSummary(): void {
    if (this.exportDataType && this.selectedFormat) {
      const dataTypeText = this.dataTypes.find(dt => dt.value === this.exportDataType)?.label || '-';
      
      this.summaryData = {
        dataType: dataTypeText,
        format: this.selectedFormat.toUpperCase(),
        records: Math.floor(Math.random() * 5000 + 500).toLocaleString(),
        size: (Math.random() * 500 + 50).toFixed(2) + ' KB'
      };
      
      this.showSummary = true;
    } else {
      this.showSummary = false;
    }
  }

  startExport(): void {
    if (!this.exportDataType) {
      alert('Please select a data type to export.');
      return;
    }
    
    if (!this.selectedFormat) {
      alert('Please select an export format.');
      return;
    }
    
    this.showExportProgress = true;
    this.exportProgress = 0;
    this.exportStatus = 'Preparing export...';
    this.exportStatusType = 'info';
    
    const interval = setInterval(() => {
      this.exportProgress += Math.random() * 12;
      if (this.exportProgress > 100) this.exportProgress = 100;
      
      if (this.exportProgress < 25) {
        this.exportStatus = 'Gathering data from database...';
      } else if (this.exportProgress < 50) {
        this.exportStatus = 'Applying filters and processing records...';
      } else if (this.exportProgress < 75) {
        this.exportStatus = 'Formatting data to ' + this.selectedFormat.toUpperCase() + '...';
      } else if (this.exportProgress < 95) {
        this.exportStatus = 'Generating export file...';
      }
      
      if (this.exportProgress >= 100) {
        clearInterval(interval);
        this.exportStatusType = 'success';
        const fileName = `export_${this.exportDataType}_${Date.now()}.${this.selectedFormat}`;
        this.exportStatus = `Export completed! File: ${fileName} downloaded.`;
      }
    }, 250);
  }

  previewData(): void {
    if (!this.exportDataType) {
      alert('Please select a data type first.');
      return;
    }
    
    const dataTypeText = this.dataTypes.find(dt => dt.value === this.exportDataType)?.label || 'data';
    alert(`Opening preview of ${dataTypeText}...`);
  }

  viewExportHistory(): void {
    alert('Opening export history...');
  }

  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  toggleTemplateSection(): void {
    this.showTemplateSection = !this.showTemplateSection;
  }
}