import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface GradeData {
  studentId: string;
  studentName: string;
  prelim: number;
  midterm: number;
  final: number;
  quizzes: number[];
  projects: number[];
  finalGrade: number;
  letterGrade: string;
  gpa: number;
  status: string;
}

interface PendingApproval {
  id: string;
  course: string;
  section: string;
  teacher: string;
  gradeType: string;
  studentCount: number;
  submitted: string;
  status: string;
  gradeRange: string;
  average: number;
  passRate: number;
  failing: number;
  needsReview: boolean;
}

@Component({
  selector: 'app-grades-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gps-grades.component.html',
  styleUrls: ['./gps-grades.component.scss']
})
export class AdminGpsGradesComponent implements OnInit {
  // Tab Management
  activeTab: string = 'grade-approval';
  
  // Data Storage
  gradesData: { [key: string]: GradeData[] } = {};
  pendingApprovals: PendingApproval[] = [];
  currentClassKey: string = '';
  
  // Form Controls
  courseSelect: string = '';
  sectionSelect: string = '';
  gradeComponentSelect: string = 'all';
  approvalFilter: string = 'All Submissions';
  uploadType: string = 'Grade Sheet Upload';
  academicYearSelect: string = '2024';
  
  // Search Controls
  quickSearch: string = '';
  studentSearch: string = '';
  
  // Selected checkboxes for bulk approve
  selectedApprovals: Set<string> = new Set();
  
  // Modal state
  isReviewModalOpen: boolean = false;
  selectedSubmission?: PendingApproval;
  
  // Dark mode
  isDarkMode: boolean = false;
  
  // Alert System
  alerts: { id: number, message: string, type: string }[] = [];
  
  ngOnInit(): void {
    this.initializeData();
    this.setupInitialTheme();
  }
  
  private initializeData(): void {
    // Sample grades data
    this.gradesData = {
      'CS101-A': [
        {
          studentId: 'STI-2024-0001',
          studentName: 'Juan Cruz',
          prelim: 85,
          midterm: 88,
          final: 90,
          quizzes: [78, 82, 85, 90],
          projects: [85, 92],
          finalGrade: 87.5,
          letterGrade: 'B+',
          gpa: 3.3,
          status: 'Passed'
        },
        {
          studentId: 'STI-2024-0002',
          studentName: 'Maria Gonzales',
          prelim: 92,
          midterm: 90,
          final: 95,
          quizzes: [88, 90, 92, 95],
          projects: [90, 95],
          finalGrade: 92.1,
          letterGrade: 'A-',
          gpa: 3.7,
          status: 'Passed'
        },
        {
          studentId: 'STI-2024-0003',
          studentName: 'Carlos Rivera',
          prelim: 75,
          midterm: 72,
          final: 78,
          quizzes: [70, 75, 73, 80],
          projects: [72, 78],
          finalGrade: 75.2,
          letterGrade: 'C',
          gpa: 2.0,
          status: 'Passed'
        }
      ]
    };
    
    // Sample pending approvals
    this.pendingApprovals = [
      {
        id: 'sub001',
        course: 'CS101 - Programming Fundamentals',
        section: 'Section A',
        teacher: 'Prof. Rodriguez',
        gradeType: 'Midterm Grades',
        studentCount: 45,
        submitted: '2 hours ago',
        status: 'pending',
        gradeRange: '45-98',
        average: 82.3,
        passRate: 93,
        failing: 3,
        needsReview: false
      },
      {
        id: 'sub002',
        course: 'IT101 - Computer Systems',
        section: 'Section B',
        teacher: 'Prof. Martinez',
        gradeType: 'Final Grades',
        studentCount: 38,
        submitted: '5 hours ago',
        status: 'flagged',
        gradeRange: '38-96',
        average: 79.1,
        passRate: 87,
        failing: 5,
        needsReview: true
      },
      {
        id: 'sub003',
        course: 'BA101 - Business Ethics',
        section: 'Section A',
        teacher: 'Prof. Johnson',
        gradeType: 'Prelim Grades',
        studentCount: 42,
        submitted: '1 day ago',
        status: 'pending',
        gradeRange: '65-98',
        average: 85.2,
        passRate: 95,
        failing: 2,
        needsReview: false
      },
      {
        id: 'sub004',
        course: 'CS201 - Data Structures',
        section: 'Section C',
        teacher: 'Prof. Lee',
        gradeType: 'Quiz 1 Scores',
        studentCount: 52,
        submitted: '3 days ago',
        status: 'pending',
        gradeRange: '50-100',
        average: 78.5,
        passRate: 88,
        failing: 6,
        needsReview: false
      }
    ];
  }
  
  // Tab Management
  switchTab(tabName: string): void {
    this.activeTab = tabName;
  }
  
  // Approval Functions
  reviewSubmission(submission: PendingApproval): void {
    this.selectedSubmission = submission;
    this.isReviewModalOpen = true;
  }
  
  approveSubmission(): void {
    if (!this.selectedSubmission) return;
    
    const index = this.pendingApprovals.findIndex(s => s.id === this.selectedSubmission!.id);
    if (index !== -1) {
      this.pendingApprovals.splice(index, 1);
      this.showAlert(`Grades for ${this.selectedSubmission.course} approved successfully!`, 'success');
      this.closeGradeReviewModal();
    }
  }
  
  rejectSubmission(): void {
    if (!this.selectedSubmission) return;
    
    const reason = prompt('Please provide a reason for requesting revision:');
    if (reason) {
      this.showAlert(`Revision requested for ${this.selectedSubmission.course}. Reason: ${reason}`, 'warning');
      this.closeGradeReviewModal();
    }
  }
  
  bulkApproveGrades(): void {
    if (this.selectedApprovals.size === 0) {
      this.showAlert('Please select submissions to approve', 'warning');
      return;
    }
    
    const selectedIds = Array.from(this.selectedApprovals);
    this.pendingApprovals = this.pendingApprovals.filter(approval => !selectedIds.includes(approval.id));
    this.selectedApprovals.clear();
    
    this.showAlert(`${selectedIds.length} grade submissions approved successfully!`, 'success');
  }
  
  toggleApprovalSelection(id: string): void {
    if (this.selectedApprovals.has(id)) {
      this.selectedApprovals.delete(id);
    } else {
      this.selectedApprovals.add(id);
    }
  }
  
  // Modal Functions
  closeGradeReviewModal(): void {
    this.isReviewModalOpen = false;
    this.selectedSubmission = undefined;
  }
  
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const modal = document.querySelector('.modal.active');
    if (modal && event.target === modal) {
      this.closeGradeReviewModal();
    }
  }
  
  @HostListener('document:keydown.escape')
  onEscapePress(): void {
    this.closeGradeReviewModal();
  }
  
  // Grade Functions
  loadClassGrades(): void {
    if (!this.courseSelect || !this.sectionSelect) {
      this.currentClassKey = '';
      return;
    }
    
    this.currentClassKey = `${this.courseSelect}-${this.sectionSelect}`;
  }
  
  get currentClassGrades(): GradeData[] {
    return this.gradesData[this.currentClassKey] || [];
  }
  
  // Utility Functions
  getApprovalStatusClass(status: string): string {
    const classes: { [key: string]: string } = {
      'pending': 'status-pending',
      'flagged': 'status-flagged',
      'approved': 'status-approved'
    };
    return classes[status] || 'status-pending';
  }
  
  getApprovalStatusText(status: string): string {
    const texts: { [key: string]: string } = {
      'pending': 'Pending Review',
      'flagged': 'Needs Review',
      'approved': 'Approved'
    };
    return texts[status] || 'Pending Review';
  }
  
  getGradeColor(letterGrade: string): string {
    const colors: { [key: string]: string } = {
      'A': 'status-approved',
      'A-': 'status-approved',
      'B+': 'status-active',
      'B': 'status-active',
      'B-': 'status-active',
      'C+': 'status-pending',
      'C': 'status-pending',
      'C-': 'status-pending',
      'D': 'status-pending',
      'F': 'status-flagged',
      'INC': 'status-pending'
    };
    return colors[letterGrade] || 'status-pending';
  }
  
  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'Passed': 'status-approved',
      'Failed': 'status-flagged',
      'Incomplete': 'status-pending',
      'Dropped': 'status-pending'
    };
    return colors[status] || 'status-pending';
  }
  
  getStudentAvatarUrl(studentName: string): string {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(studentName)}&background=1a4b8c&color=fff`;
  }

  // ADD THIS METHOD TO FIX THE ERROR
  getAlertIcon(type: string): string {
    switch(type) {
      case 'success': return 'fa-check-circle';
      case 'error': return 'fa-exclamation-circle';
      case 'warning': return 'fa-exclamation-triangle';
      case 'info': return 'fa-info-circle';
      default: return 'fa-info-circle';
    }
  }
  
  // Action Functions
  exportClassGrades(): void {
    if (!this.currentClassKey) {
      this.showAlert('Please select a course and section first', 'warning');
      return;
    }
    
    this.showAlert('Exporting class grades...', 'info');
    setTimeout(() => {
      this.showAlert('Class grades exported successfully!', 'success');
    }, 2000);
  }
  
  printGrades(): void {
    this.showAlert('Printing grade report...', 'info');
    setTimeout(() => {
      this.showAlert('Grade report sent to printer!', 'success');
    }, 1000);
  }
  
  processBulkGrades(): void {
    const fileInput = document.getElementById('bulkGradeFile') as HTMLInputElement;
    if (!fileInput.files?.[0]) {
      this.showAlert('Please select a file to upload', 'warning');
      return;
    }
    
    this.showAlert('Processing bulk grade upload...', 'info');
    setTimeout(() => {
      this.showAlert('Bulk grades uploaded successfully! 45 records processed.', 'success');
    }, 3000);
  }
  
  downloadTemplate(): void {
    this.showAlert('Downloading grade template...', 'info');
    setTimeout(() => {
      this.showAlert('Template downloaded successfully!', 'success');
    }, 1000);
  }
  
  performQuickSearch(): void {
    if (this.quickSearch.length < 2) return;
    this.showAlert(`Searching for: ${this.quickSearch}`, 'info');
  }
  
  // Alert System
  showAlert(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    const alertId = Date.now();
    this.alerts.push({ id: alertId, message, type });
    
    setTimeout(() => {
      this.removeAlert(alertId);
    }, 5000);
  }
  
  removeAlert(id: number): void {
    this.alerts = this.alerts.filter(alert => alert.id !== id);
  }
  
  // Theme Management
  private setupInitialTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      this.toggleDarkMode();
    }
  }
  
  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }
  
  // File Upload Trigger
  triggerFileUpload(): void {
    const fileInput = document.getElementById('bulkGradeFile') as HTMLInputElement;
    fileInput.click();
  }
}