import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Student {
  id: string;
  name: string;
  course: string;
  yearSection: string;
  email: string;
  contact: string;
  rfid: string;
  faceImage: string;
}

@Component({
  selector: 'app-manage-students',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ats-manage-students.html',
  styleUrls: ['./ats-manage-students.scss']
})
export class ManageStudentsComponent implements OnInit {
  // Form properties
  newStudent = {
    fullName: '',
    studentId: '',
    course: '',
    yearSection: '',
    email: '',
    contact: '',
    rfid: '',
    faceImage: null as File | null
  };

  editStudent = {
    fullName: 'John Doe',
    studentId: '2025-001',
    course: 'BSIT',
    yearSection: '3rd Year - A',
    email: 'john.doe@university.edu',
    contact: '0912-345-6789',
    rfid: 'RFID12345',
    faceImage: null as File | null
  };

  // Filter properties
  searchInput = '';
  filterCourse = '';
  filterSection = '';
  filterYear = '';

  // Data properties
  allStudents: Student[] = [];
  filteredStudents: Student[] = [];
  currentPage = 1;
  studentsPerPage = 10;
  
  // Modal state
  isEditModalOpen = false;
  
  // Date display
  todayDate = '';

  constructor() { }

  ngOnInit(): void {
    this.loadSampleData();
    this.setCurrentDate();
  }

  private setCurrentDate(): void {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    this.todayDate = now.toLocaleDateString('en-US', options);
  }

  private loadSampleData(): void {
    this.allStudents = [
      {
        id: "2025-001",
        name: "John Michael Doe",
        course: "BSIT",
        yearSection: "3rd Year - A",
        email: "john.doe@university.edu",
        contact: "0912-345-6789",
        rfid: "RFID12345",
        faceImage: "https://via.placeholder.com/40"
      },
      {
        id: "2025-002",
        name: "Jane Marie Smith",
        course: "BSED",
        yearSection: "2nd Year - B",
        email: "jane.smith@university.edu",
        contact: "0912-345-6790",
        rfid: "RFID67890",
        faceImage: "https://via.placeholder.com/40"
      },
      {
        id: "2025-003",
        name: "Robert James Johnson",
        course: "BSCS",
        yearSection: "4th Year - C",
        email: "robert.johnson@university.edu",
        contact: "0912-345-6791",
        rfid: "RFID54321",
        faceImage: "https://via.placeholder.com/40"
      },
      {
        id: "2025-004",
        name: "Maria Santos Garcia",
        course: "BSBA",
        yearSection: "1st Year - A",
        email: "maria.garcia@university.edu",
        contact: "0912-345-6792",
        rfid: "RFID98765",
        faceImage: "https://via.placeholder.com/40"
      },
      {
        id: "2025-005",
        name: "Carlos David Reyes",
        course: "BSIT",
        yearSection: "3rd Year - B",
        email: "carlos.reyes@university.edu",
        contact: "0912-345-6793",
        rfid: "RFID45678",
        faceImage: "https://via.placeholder.com/40"
      },
      {
        id: "2025-006",
        name: "Sarah Lynn Tan",
        course: "BSED",
        yearSection: "2nd Year - C",
        email: "sarah.tan@university.edu",
        contact: "0912-345-6794",
        rfid: "RFID23456",
        faceImage: "https://via.placeholder.com/40"
      },
      {
        id: "2025-007",
        name: "Michael Anthony Cruz",
        course: "BSCS",
        yearSection: "4th Year - A",
        email: "michael.cruz@university.edu",
        contact: "0912-345-6795",
        rfid: "RFID87654",
        faceImage: "https://via.placeholder.com/40"
      },
      {
        id: "2025-008",
        name: "Andrea Nicole Lim",
        course: "BSBA",
        yearSection: "1st Year - B",
        email: "andrea.lim@university.edu",
        contact: "0912-345-6796",
        rfid: "RFID34567",
        faceImage: "https://via.placeholder.com/40"
      },
      {
        id: "2025-009",
        name: "Daniel Patrick Ong",
        course: "BSIT",
        yearSection: "3rd Year - D",
        email: "daniel.ong@university.edu",
        contact: "0912-345-6797",
        rfid: "RFID76543",
        faceImage: "https://via.placeholder.com/40"
      },
      {
        id: "2025-010",
        name: "Christine Ann Torres",
        course: "BSED",
        yearSection: "2nd Year - A",
        email: "christine.torres@university.edu",
        contact: "0912-345-6798",
        rfid: "RFID65432",
        faceImage: "https://via.placeholder.com/40"
      }
    ];
    this.filteredStudents = [...this.allStudents];
  }

  applyFilters(): void {
    const search = this.searchInput.toLowerCase();
    
    this.filteredStudents = this.allStudents.filter(student => {
      // Search by name or ID
      const matchesSearch = !search || 
        student.name.toLowerCase().includes(search) || 
        student.id.toLowerCase().includes(search);
      
      // Filter by course
      const matchesCourse = !this.filterCourse || student.course === this.filterCourse;
      
      // Filter by section
      const matchesSection = !this.filterSection || student.yearSection.includes(`- ${this.filterSection}`);
      
      // Filter by year level
      const matchesYear = !this.filterYear || student.yearSection.includes(this.filterYear);
      
      return matchesSearch && matchesCourse && matchesSection && matchesYear;
    });
    
    this.currentPage = 1;
  }

  get paginatedStudents(): Student[] {
    const startIndex = (this.currentPage - 1) * this.studentsPerPage;
    const endIndex = startIndex + this.studentsPerPage;
    return this.filteredStudents.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredStudents.length / this.studentsPerPage);
  }

  get showingCount(): number {
    const total = this.filteredStudents.length;
    const start = (this.currentPage - 1) * this.studentsPerPage;
    return Math.min(this.studentsPerPage, total - start);
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

  registerStudent(): void {
    // Validate form data
    if (!this.validateStudentForm()) {
      return;
    }

    // Add student to data
    const newStudent: Student = {
      id: this.newStudent.studentId,
      name: this.newStudent.fullName,
      course: this.newStudent.course,
      yearSection: this.newStudent.yearSection,
      email: this.newStudent.email,
      contact: this.newStudent.contact,
      rfid: this.newStudent.rfid,
      faceImage: "https://via.placeholder.com/40"
    };

    this.allStudents.push(newStudent);
    this.filteredStudents = [...this.allStudents];
    
    // Reset form
    this.newStudent = {
      fullName: '',
      studentId: '',
      course: '',
      yearSection: '',
      email: '',
      contact: '',
      rfid: '',
      faceImage: null
    };
    
    // Update current page
    this.currentPage = Math.ceil(this.filteredStudents.length / this.studentsPerPage);
  }

  validateStudentForm(): boolean {
    // Check if student ID already exists
    if (this.allStudents.some(student => student.id === this.newStudent.studentId)) {
      alert('Student ID already exists!');
      return false;
    }

    // Check if email already exists
    if (this.allStudents.some(student => student.email === this.newStudent.email)) {
      alert('Email already exists!');
      return false;
    }

    // Check if RFID already exists
    if (this.allStudents.some(student => student.rfid === this.newStudent.rfid)) {
      alert('RFID code already exists!');
      return false;
    }

    // Check required fields
    if (!this.newStudent.fullName || !this.newStudent.studentId || !this.newStudent.course || 
        !this.newStudent.yearSection || !this.newStudent.email || !this.newStudent.contact || 
        !this.newStudent.rfid) {
      alert('Please fill in all required fields!');
      return false;
    }

    return true;
  }

  openEditModal(student: Student): void {
    this.editStudent = {
      fullName: student.name,
      studentId: student.id,
      course: student.course,
      yearSection: student.yearSection,
      email: student.email,
      contact: student.contact,
      rfid: student.rfid,
      faceImage: null
    };
    this.isEditModalOpen = true;
  }

  updateStudent(): void {
    // In a real app, this would update the student in the database
    alert('Student information updated successfully!');
    this.isEditModalOpen = false;
    
    // Update the student in the array
    const index = this.allStudents.findIndex(s => s.id === this.editStudent.studentId);
    if (index !== -1) {
      this.allStudents[index] = {
        ...this.allStudents[index],
        name: this.editStudent.fullName,
        course: this.editStudent.course,
        yearSection: this.editStudent.yearSection,
        email: this.editStudent.email,
        contact: this.editStudent.contact,
        rfid: this.editStudent.rfid
      };
      this.filteredStudents = [...this.allStudents];
    }
  }

  confirmDelete(student: Student): void {
    if (confirm('Are you sure you want to delete this student record? This action cannot be undone.')) {
      this.allStudents = this.allStudents.filter(s => s.id !== student.id);
      this.filteredStudents = [...this.allStudents];
      alert('Student record deleted successfully.');
      
      // Adjust current page if needed
      if (this.currentPage > this.totalPages && this.totalPages > 0) {
        this.currentPage = this.totalPages;
      }
    }
  }

  exportTableToCSV(): void {
    let csv = [];
    
    // Add headers
    const headers = ['Student ID', 'Name', 'Course', 'Year & Section', 'Email', 'Contact', 'RFID'];
    csv.push(headers.join(','));
    
    // Add data rows
    this.filteredStudents.forEach(student => {
      const row = [
        student.id,
        `"${student.name}"`,
        student.course,
        `"${student.yearSection}"`,
        student.email,
        student.contact,
        student.rfid
      ];
      csv.push(row.join(','));
    });
    
    this.downloadCSV(csv.join('\n'), 'student_list.csv');
    alert('CSV exported successfully!');
  }

  private downloadCSV(csv: string, filename: string): void {
    const csvFile = new Blob([csv], { type: 'text/csv' });
    const downloadLink = document.createElement('a');
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(csvFile);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  exportTableToExcel(): void {
    // Create table HTML for Excel
    let tableHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta charset="UTF-8">
        <style>
          table { border-collapse: collapse; width: 100%; }
          th { background-color: #1a4b8c; color: white; font-weight: bold; padding: 8px; border: 1px solid #ddd; }
          td { padding: 8px; border: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th>Course</th>
              <th>Year & Section</th>
              <th>Email</th>
              <th>Contact</th>
              <th>RFID</th>
            </tr>
          </thead>
          <tbody>
    `;
    
    // Add data rows
    this.filteredStudents.forEach(student => {
      tableHTML += `
        <tr>
          <td>${student.id}</td>
          <td>${student.name}</td>
          <td>${student.course}</td>
          <td>${student.yearSection}</td>
          <td>${student.email}</td>
          <td>${student.contact}</td>
          <td>${student.rfid}</td>
        </tr>
      `;
    });
    
    tableHTML += `
          </tbody>
        </table>
      </body>
      </html>
    `;
    
    // Create and trigger download
    const blob = new Blob([tableHTML], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.download = 'student_list.xls';
    link.href = window.URL.createObjectURL(blob);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert('Excel exported successfully!');
  }

  onFileSelected(event: any, type: 'new' | 'edit'): void {
    const file = event.target.files[0];
    if (file) {
      if (type === 'new') {
        this.newStudent.faceImage = file;
      } else {
        this.editStudent.faceImage = file;
      }
    }
  }
}