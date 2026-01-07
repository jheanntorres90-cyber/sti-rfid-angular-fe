import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-ats-attendance',
  templateUrl: './ats-attendance.components.html',
  styleUrls: ['./ats-attendance.components.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class AdminAtsAttendanceComponent implements OnInit {
  
  attendanceRecords: any[] = [];
  filteredRecords: any[] = [];
  

  filterForm!: FormGroup;
  editForm!: FormGroup;

  currentPage: number = 1;
  recordsPerPage: number = 10;
  

  summary = {
    present: 0,
    late: 0,
    absent: 0,
    attendanceRate: '0%'
  };
  
  // Modal
  showEditModal: boolean = false;
  selectedRecord: any = null;
  
  // Options
  courses = ['BSIT', 'BSED', 'BSCS', 'BSBA'];
  sections = ['A', 'B', 'C', 'D'];
  subjects = ['Mathematics', 'Science', 'English', 'Programming'];
  statuses = ['Present', 'Late', 'Absent', 'Excused'];
  methods = ['RFID', 'Face Recognition', 'Manual'];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForms();
    this.loadSampleData();
    this.setDefaultDateRange();
    this.applyInitialFilters();
    this.updateSummary();
  }

  initForms(): void {
    this.filterForm = this.fb.group({
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      course: ['', Validators.required],
      section: ['', Validators.required],
      subject: ['', Validators.required]
    });

    this.editForm = this.fb.group({
      studentName: [''],
      studentId: [''],
      date: ['', Validators.required],
      timeIn: ['', Validators.required],
      timeOut: ['', Validators.required],
      status: ['', Validators.required],
      method: ['', Validators.required],
      remarks: ['']
    });
  }

  loadSampleData(): void {
    this.attendanceRecords = [
      {
        id: "ATT001",
        studentId: "2025-001",
        name: "John Michael Doe",
        course: "BSIT",
        section: "A",
        subject: "Mathematics",
        date: "2023-09-11",
        timeIn: "08:00",
        timeOut: "17:00",
        status: "Present",
        method: "RFID"
      },
      {
        id: "ATT002",
        studentId: "2025-002",
        name: "Jane Marie Smith",
        course: "BSED",
        section: "B",
        subject: "Science",
        date: "2023-09-11",
        timeIn: "08:15",
        timeOut: "17:00",
        status: "Late",
        method: "Face Recognition"
      },
      {
        id: "ATT003",
        studentId: "2025-003",
        name: "Robert James Johnson",
        course: "BSCS",
        section: "C",
        subject: "Programming",
        date: "2023-09-11",
        timeIn: "",
        timeOut: "",
        status: "Absent",
        method: "Manual"
      },
      {
        id: "ATT004",
        studentId: "2025-004",
        name: "Maria Santos Garcia",
        course: "BSBA",
        section: "A",
        subject: "English",
        date: "2023-09-10",
        timeIn: "08:05",
        timeOut: "17:00",
        status: "Present",
        method: "RFID"
      },
      {
        id: "ATT005",
        studentId: "2025-005",
        name: "Carlos David Reyes",
        course: "BSIT",
        section: "B",
        subject: "Mathematics",
        date: "2023-09-10",
        timeIn: "08:20",
        timeOut: "17:00",
        status: "Late",
        method: "Face Recognition"
      },
      {
        id: "ATT006",
        studentId: "2025-006",
        name: "Sarah Lynn Tan",
        course: "BSED",
        section: "C",
        subject: "Science",
        date: "2023-09-09",
        timeIn: "08:00",
        timeOut: "17:00",
        status: "Present",
        method: "RFID"
      },
      {
        id: "ATT007",
        studentId: "2025-007",
        name: "Michael Anthony Cruz",
        course: "BSCS",
        section: "A",
        subject: "Programming",
        date: "2023-09-09",
        timeIn: "08:00",
        timeOut: "17:00",
        status: "Present",
        method: "RFID"
      },
      {
        id: "ATT008",
        studentId: "2025-008",
        name: "Andrea Nicole Lim",
        course: "BSBA",
        section: "B",
        subject: "English",
        date: "2023-09-08",
        timeIn: "",
        timeOut: "",
        status: "Absent",
        method: "Manual"
      },
      {
        id: "ATT009",
        studentId: "2025-009",
        name: "Daniel Patrick Ong",
        course: "BSIT",
        section: "C",
        subject: "Mathematics",
        date: "2023-09-08",
        timeIn: "08:10",
        timeOut: "17:00",
        status: "Present",
        method: "Face Recognition"
      },
      {
        id: "ATT010",
        studentId: "2025-010",
        name: "Christine Ann Torres",
        course: "BSED",
        section: "A",
        subject: "Science",
        date: "2023-09-07",
        timeIn: "08:25",
        timeOut: "17:00",
        status: "Late",
        method: "RFID"
      }
    ];
    
    this.filteredRecords = [...this.attendanceRecords];
  }

  setDefaultDateRange(): void {
    const today = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(today.getDate() - 7);
    
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };
    
    this.filterForm.patchValue({
      fromDate: formatDate(oneWeekAgo),
      toDate: formatDate(today)
    });
  }

  applyInitialFilters(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    if (this.filterForm.invalid) {
      this.markFormGroupTouched(this.filterForm);
      return;
    }

    const formValues = this.filterForm.value;
    
    if (formValues.fromDate > formValues.toDate) {
      alert('To date cannot be before from date');
      return;
    }

    this.filteredRecords = this.attendanceRecords.filter(record => {
      const recordDate = new Date(record.date);
      const fromDate = new Date(formValues.fromDate);
      const toDate = new Date(formValues.toDate);
      
      const inDateRange = recordDate >= fromDate && recordDate <= toDate;
      const matchesCourse = !formValues.course || record.course === formValues.course;
      const matchesSection = !formValues.section || record.section === formValues.section;
      const matchesSubject = !formValues.subject || record.subject === formValues.subject;
      
      return inDateRange && matchesCourse && matchesSection && matchesSubject;
    });

    this.currentPage = 1;
    this.updateSummary();
    alert('Filters applied successfully!');
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.setDefaultDateRange();
    this.filteredRecords = [...this.attendanceRecords];
    this.currentPage = 1;
    this.updateSummary();
    alert('Filters reset successfully!');
  }

  updateSummary(): void {
    const present = this.filteredRecords.filter(r => r.status === 'Present').length;
    const late = this.filteredRecords.filter(r => r.status === 'Late').length;
    const absent = this.filteredRecords.filter(r => r.status === 'Absent').length;
    const total = this.filteredRecords.length;
    const rate = total > 0 ? Math.round(((present + late) / total) * 100) : 0;

    this.summary = {
      present,
      late,
      absent,
      attendanceRate: `${rate}%`
    };
  }

  get paginatedRecords(): any[] {
    const start = (this.currentPage - 1) * this.recordsPerPage;
    const end = start + this.recordsPerPage;
    return this.filteredRecords.slice(start, end);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredRecords.length / this.recordsPerPage);
  }

  get showingCount(): number {
    return Math.min(
      this.recordsPerPage,
      this.filteredRecords.length - (this.currentPage - 1) * this.recordsPerPage
    );
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  getStatusClass(status: string): string {
    switch(status.toLowerCase()) {
      case 'present': return 'status-present';
      case 'late': return 'status-late';
      case 'absent': return 'status-absent';
      case 'excused': return 'status-excused';
      default: return '';
    }
  }

  getMethodClass(method: string): string {
    switch(method.toLowerCase()) {
      case 'rfid': return 'method-rfid';
      case 'face recognition': return 'method-face';
      case 'manual': return 'method-manual';
      default: return '';
    }
  }

  openEditModal(record: any): void {
    this.selectedRecord = record;
    this.editForm.patchValue({
      studentName: record.name,
      studentId: record.studentId,
      date: record.date,
      timeIn: record.timeIn,
      timeOut: record.timeOut,
      status: record.status,
      method: record.method,
      remarks: ''
    });
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.selectedRecord = null;
    this.editForm.reset();
  }

  updateAttendance(): void {
    if (this.editForm.valid && this.selectedRecord) {
      const updatedData = this.editForm.value;
      
      // Update in main records
      const index = this.attendanceRecords.findIndex(r => r.id === this.selectedRecord.id);
      if (index !== -1) {
        this.attendanceRecords[index] = {
          ...this.attendanceRecords[index],
          ...updatedData
        };
      }
      
      // Update in filtered records
      const filteredIndex = this.filteredRecords.findIndex(r => r.id === this.selectedRecord.id);
      if (filteredIndex !== -1) {
        this.filteredRecords[filteredIndex] = {
          ...this.filteredRecords[filteredIndex],
          ...updatedData
        };
      }
      
      this.updateSummary();
      this.closeEditModal();
      alert('Attendance record updated successfully!');
    }
  }

  deleteRecord(record: any): void {
    if (confirm('Are you sure you want to delete this attendance record?')) {
      this.attendanceRecords = this.attendanceRecords.filter(r => r.id !== record.id);
      this.filteredRecords = this.filteredRecords.filter(r => r.id !== record.id);
      this.updateSummary();
      alert('Attendance record deleted successfully.');
    }
  }

  viewRecord(record: any): void {
    alert(`Viewing: ${record.name} - ${record.status}`);
  }

  exportToCSV(): void {
    if (this.filteredRecords.length === 0) {
      alert('No records to export');
      return;
    }

    const headers = ['Student ID', 'Name', 'Course', 'Section', 'Subject', 'Date', 'Time In', 'Time Out', 'Status', 'Method'];
    const rows = this.filteredRecords.map(record => [
      record.studentId,
      `"${record.name}"`,
      record.course,
      record.section,
      `"${record.subject}"`,
      record.date,
      record.timeIn || '-',
      record.timeOut || '-',
      record.status,
      record.method
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    this.downloadFile(csvContent, 'attendance.csv', 'text/csv');
    alert('CSV exported!');
  }

  exportToExcel(): void {
    if (this.filteredRecords.length === 0) {
      alert('No records to export');
      return;
    }

    const html = `
      <table border="1">
        <tr>
          <th>Student ID</th>
          <th>Name</th>
          <th>Course</th>
          <th>Section</th>
          <th>Subject</th>
          <th>Date</th>
          <th>Time In</th>
          <th>Time Out</th>
          <th>Status</th>
          <th>Method</th>
        </tr>
        ${this.filteredRecords.map(record => `
          <tr>
            <td>${record.studentId}</td>
            <td>${record.name}</td>
            <td>${record.course}</td>
            <td>${record.section}</td>
            <td>${record.subject}</td>
            <td>${record.date}</td>
            <td>${record.timeIn || '-'}</td>
            <td>${record.timeOut || '-'}</td>
            <td>${record.status}</td>
            <td>${record.method}</td>
          </tr>
        `).join('')}
      </table>
    `;
    
    this.downloadFile(html, 'attendance.xls', 'application/vnd.ms-excel');
    alert('Excel exported!');
  }

  generateReport(): void {
    alert('Generating report...');
    // Report generation logic here
  }

  private downloadFile(content: string, filename: string, type: string): void {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}