import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phone: string;
  educationLevel: string;
  course: string;
  yearLevel: string;
  status: string;
  balance: number;
  enrollmentDate: string;
  avatar: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
  civilStatus?: string;
}

interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phone: string;
  employmentType: string;
  specialization: string;
  designation: string;
  status: string;
  hireDate: string;
  avatar: string;
  address?: string;
  dateOfBirth?: string;
  gender?: string;
}

interface TrashItem {
  id: string;
  name: string;
  type: 'Student' | 'Teacher';
  deletedDate: string;
  data: any;
}

@Component({
  selector: 'app-records-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gps-records.component.html',
  styleUrls: ['./gps-records.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AdminGpsDashboardComponent implements OnInit {
  // Tab management
  activeTab: 'students' | 'teachers' | 'trash' = 'students';
  
  // Student data
  studentsData: Student[] = [];
  filteredStudents: Student[] = [];
  currentStudentPage = 1;
  selectedStudents: string[] = [];
  isAllStudentsSelected = false;
  
  // Teacher data
  teachersData: Teacher[] = [];
  filteredTeachers: Teacher[] = [];
  currentTeacherPage = 1;
  selectedTeachers: string[] = [];
  isAllTeachersSelected = false;
  
  // Trash data
  trashData: TrashItem[] = [];
  
  // Common settings
  rowsPerPage = 5;
  
  // Modal states
  showAddStudentModal = false;
  showAddTeacherModal = false;
  showEditStudentModal = false;
  showEditTeacherModal = false;
  showBulkActionsModal = false;
  showStudentDetailsModal = false;
  showTeacherDetailsModal = false;
  
  // Form models
  newStudent: any = {
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phone: '',
    address: '',
    educationLevel: '',
    course: '',
    yearLevel: '',
    studentId: '',
    dob: '',
    gender: '',
    civilStatus: 'single',
    enrollmentDate: new Date().toISOString().split('T')[0],
    emergencyName: '',
    emergencyRelationship: '',
    emergencyPhone: '',
    emergencyEmail: ''
  };
  
  newTeacher: any = {
    firstName: '',
    lastName: '',
    middleName: '',
    email: '',
    phone: '',
    address: '',
    employmentType: '',
    specialization: '',
    designation: '',
    teacherId: '',
    dob: '',
    gender: '',
    status: 'active',
    hireDate: new Date().toISOString().split('T')[0]
  };
  
  editingStudent: Student | null = null;
  editingTeacher: Teacher | null = null;
  viewingStudent: Student | null = null;
  viewingTeacher: Teacher | null = null;
  
  // Filter states
  showStudentFilters = false;
  showTeacherFilters = false;
  
  // Filter models
  studentFilters = {
    educationLevel: 'All Levels',
    course: 'All Courses',
    year: 'All Years',
    status: 'All Status'
  };
  
  teacherFilters = {
    employmentType: 'All Types',
    specialization: 'All Specializations',
    designation: 'All Designations',
    status: 'All Status'
  };
  
  // Bulk action
  bulkActionType = '';
  bulkActionDetails: any = {};
  
  // Alert
  alert = {
    show: false,
    message: '',
    type: 'info' as 'success' | 'error' | 'warning' | 'info'
  };
  
  // Theme
  isDarkMode = false;

  // Search properties
  studentSearch = '';
  teacherSearch = '';
  quickSearch = '';

  constructor() {}

  ngOnInit() {
    this.initializeData();
    this.applyTheme();
  }

  // Initialize sample data
  private initializeData() {
    // Sample student data
    this.studentsData = [
      {
        id: 'STI-2024-0001',
        firstName: 'Juan',
        lastName: 'Cruz',
        middleName: 'Santos',
        email: 'juan.cruz@sti.edu',
        phone: '+63 912 345 6789',
        educationLevel: 'College',
        course: 'Computer Science',
        yearLevel: '3rd Year',
        status: 'Active',
        balance: 15000,
        enrollmentDate: '2022-08-15',
        avatar: 'https://ui-avatars.com/api/?name=Juan+Cruz&background=1a4b8c&color=fff'
      },
      {
        id: 'STI-2024-0002',
        firstName: 'Maria',
        lastName: 'Gonzales',
        middleName: 'Reyes',
        email: 'maria.gonzales@sti.edu',
        phone: '+63 915 678 9012',
        educationLevel: 'Senior High',
        course: 'Information Technology',
        yearLevel: '2nd Year',
        status: 'Active',
        balance: 0,
        enrollmentDate: '2023-08-20',
        avatar: 'https://ui-avatars.com/api/?name=Maria+Gonzales&background=2d68b8&color=fff'
      },
      {
        id: 'STI-2024-0003',
        firstName: 'Carlos',
        lastName: 'Rivera',
        middleName: 'Martinez',
        email: 'carlos.rivera@sti.edu',
        phone: '+63 918 901 2345',
        educationLevel: 'College',
        course: 'Business Administration',
        yearLevel: '4th Year',
        status: 'Active',
        balance: 8500,
        enrollmentDate: '2021-08-10',
        avatar: 'https://ui-avatars.com/api/?name=Carlos+Rivera&background=43a047&color=fff'
      },
      {
        id: 'STI-2024-0004',
        firstName: 'Ana',
        lastName: 'Torres',
        middleName: 'Lopez',
        email: 'ana.torres@sti.edu',
        phone: '+63 913 456 7890',
        educationLevel: 'College',
        course: 'Engineering',
        yearLevel: '1st Year',
        status: 'Active',
        balance: 25000,
        enrollmentDate: '2024-08-05',
        avatar: 'https://ui-avatars.com/api/?name=Ana+Torres&background=e6b400&color=fff'
      },
      {
        id: 'STI-2024-0005',
        firstName: 'Miguel',
        lastName: 'Santos',
        middleName: 'Cruz',
        email: 'miguel.santos@sti.edu',
        phone: '+63 916 567 8901',
        educationLevel: 'Senior High',
        course: 'Computer Science',
        yearLevel: '2nd Year',
        status: 'Inactive',
        balance: 45000,
        enrollmentDate: '2023-08-18',
        avatar: 'https://ui-avatars.com/api/?name=Miguel+Santos&background=e53935&color=fff'
      }
    ];
    
    // Sample teacher data
    this.teachersData = [
      {
        id: 'TCH-2024-0001',
        firstName: 'Dr. Roberto',
        lastName: 'Garcia',
        middleName: 'Santos',
        email: 'roberto.garcia@sti.edu',
        phone: '+63 917 123 4567',
        employmentType: 'Full-time',
        specialization: 'Computer Science',
        designation: 'Professor',
        status: 'Active',
        hireDate: '2018-06-15',
        avatar: 'https://ui-avatars.com/api/?name=Roberto+Garcia&background=1a4b8c&color=fff'
      },
      {
        id: 'TCH-2024-0002',
        firstName: 'Prof. Elena',
        lastName: 'Reyes',
        middleName: 'Cruz',
        email: 'elena.reyes@sti.edu',
        phone: '+63 918 234 5678',
        employmentType: 'Full-time',
        specialization: 'Information Technology',
        designation: 'Associate Professor',
        status: 'Active',
        hireDate: '2020-03-10',
        avatar: 'https://ui-avatars.com/api/?name=Elena+Reyes&background=2d68b8&color=fff'
      },
      {
        id: 'TCH-2024-0003',
        firstName: 'Dr. Antonio',
        lastName: 'Lopez',
        middleName: 'Martinez',
        email: 'antonio.lopez@sti.edu',
        phone: '+63 919 345 6789',
        employmentType: 'Part-time',
        specialization: 'Business Administration',
        designation: 'Assistant Professor',
        status: 'Active',
        hireDate: '2021-08-22',
        avatar: 'https://ui-avatars.com/api/?name=Antonio+Lopez&background=43a047&color=fff'
      },
      {
        id: 'TCH-2024-0004',
        firstName: 'Prof. Sofia',
        lastName: 'Tan',
        middleName: 'Lim',
        email: 'sofia.tan@sti.edu',
        phone: '+63 920 456 7890',
        employmentType: 'Contractual',
        specialization: 'Engineering',
        designation: 'Instructor',
        status: 'Inactive',
        hireDate: '2023-01-15',
        avatar: 'https://ui-avatars.com/api/?name=Sofia+Tan&background=e6b400&color=fff'
      }
    ];
    
    // Sample trash data
    this.trashData = [
      {
        id: 'STI-2023-0123',
        name: 'Luis Mendoza',
        type: 'Student',
        deletedDate: '2024-10-15',
        data: {}
      },
      {
        id: 'TCH-2023-0045',
        name: 'Prof. Ricardo Santos',
        type: 'Teacher',
        deletedDate: '2024-10-10',
        data: {}
      }
    ];
    
    this.filteredStudents = [...this.studentsData];
    this.filteredTeachers = [...this.teachersData];
  }

  // Tab management
  switchTab(tab: 'students' | 'teachers' | 'trash') {
    this.activeTab = tab;
  }

  // Student table pagination
  get studentPaginationInfo() {
    const start = (this.currentStudentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return {
      start: start + 1,
      end: Math.min(end, this.filteredStudents.length),
      total: this.filteredStudents.length
    };
  }

  get displayedStudents() {
    const start = (this.currentStudentPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.filteredStudents.slice(start, end);
  }

  get studentTotalPages() {
    return Math.ceil(this.filteredStudents.length / this.rowsPerPage);
  }

  // Teacher table pagination
  get teacherPaginationInfo() {
    const start = (this.currentTeacherPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return {
      start: start + 1,
      end: Math.min(end, this.filteredTeachers.length),
      total: this.filteredTeachers.length
    };
  }

  get displayedTeachers() {
    const start = (this.currentTeacherPage - 1) * this.rowsPerPage;
    const end = start + this.rowsPerPage;
    return this.filteredTeachers.slice(start, end);
  }

  get teacherTotalPages() {
    return Math.ceil(this.filteredTeachers.length / this.rowsPerPage);
  }

  // Pagination methods
  goToStudentPage(page: number) {
    this.currentStudentPage = page;
  }

  previousStudentPage() {
    if (this.currentStudentPage > 1) {
      this.currentStudentPage--;
    }
  }

  nextStudentPage() {
    if (this.currentStudentPage < this.studentTotalPages) {
      this.currentStudentPage++;
    }
  }

  goToTeacherPage(page: number) {
    this.currentTeacherPage = page;
  }

  previousTeacherPage() {
    if (this.currentTeacherPage > 1) {
      this.currentTeacherPage--;
    }
  }

  nextTeacherPage() {
    if (this.currentTeacherPage < this.teacherTotalPages) {
      this.currentTeacherPage++;
    }
  }

  // Student selection
  toggleStudentSelection(studentId: string) {
    const index = this.selectedStudents.indexOf(studentId);
    if (index > -1) {
      this.selectedStudents.splice(index, 1);
    } else {
      this.selectedStudents.push(studentId);
    }
    this.isAllStudentsSelected = this.selectedStudents.length === this.filteredStudents.length;
  }

  toggleAllStudents() {
    if (this.isAllStudentsSelected) {
      this.selectedStudents = [];
    } else {
      this.selectedStudents = this.filteredStudents.map(s => s.id);
    }
    this.isAllStudentsSelected = !this.isAllStudentsSelected;
  }

  // Teacher selection
  toggleTeacherSelection(teacherId: string) {
    const index = this.selectedTeachers.indexOf(teacherId);
    if (index > -1) {
      this.selectedTeachers.splice(index, 1);
    } else {
      this.selectedTeachers.push(teacherId);
    }
    this.isAllTeachersSelected = this.selectedTeachers.length === this.filteredTeachers.length;
  }

  toggleAllTeachers() {
    if (this.isAllTeachersSelected) {
      this.selectedTeachers = [];
    } else {
      this.selectedTeachers = this.filteredTeachers.map(t => t.id);
    }
    this.isAllTeachersSelected = !this.isAllTeachersSelected;
  }

  // Stats
  get stats() {
    return {
      totalStudents: this.studentsData.length,
      totalTeachers: this.teachersData.length,
      activeStudents: this.studentsData.filter(s => s.status === 'Active').length,
      deletedRecords: this.trashData.length
    };
  }

  // Status badge class
  getStatusClass(status: string): string {
    const classes: {[key: string]: string} = {
      'Active': 'status-active',
      'Inactive': 'status-inactive',
      'Graduated': 'status-graduated',
      'Dropped': 'status-inactive',
      'On Leave': 'status-inactive'
    };
    return classes[status] || 'status-inactive';
  }

  // Filter methods
  applyStudentFilters() {
    this.filteredStudents = this.studentsData.filter(student => {
      const educationLevelMatch = this.studentFilters.educationLevel === 'All Levels' || 
                                  student.educationLevel === this.studentFilters.educationLevel;
      const courseMatch = this.studentFilters.course === 'All Courses' || 
                         student.course === this.studentFilters.course;
      const yearMatch = this.studentFilters.year === 'All Years' || 
                       student.yearLevel === this.studentFilters.year;
      const statusMatch = this.studentFilters.status === 'All Status' || 
                         student.status === this.studentFilters.status;
      
      return educationLevelMatch && courseMatch && yearMatch && statusMatch;
    });
    
    this.currentStudentPage = 1;
    this.selectedStudents = [];
    this.isAllStudentsSelected = false;
    this.showStudentFilters = false;
    this.showAlert('Filters applied successfully', 'success');
  }

  clearStudentFilters() {
    this.studentFilters = {
      educationLevel: 'All Levels',
      course: 'All Courses',
      year: 'All Years',
      status: 'All Status'
    };
    this.filteredStudents = [...this.studentsData];
    this.currentStudentPage = 1;
    this.selectedStudents = [];
    this.isAllStudentsSelected = false;
    this.showStudentFilters = false;
    this.showAlert('Filters cleared', 'info');
  }

  applyTeacherFilters() {
    this.filteredTeachers = this.teachersData.filter(teacher => {
      const employmentTypeMatch = this.teacherFilters.employmentType === 'All Types' || 
                                 teacher.employmentType === this.teacherFilters.employmentType;
      const specializationMatch = this.teacherFilters.specialization === 'All Specializations' || 
                                 teacher.specialization === this.teacherFilters.specialization;
      const designationMatch = this.teacherFilters.designation === 'All Designations' || 
                              teacher.designation === this.teacherFilters.designation;
      const statusMatch = this.teacherFilters.status === 'All Status' || 
                         teacher.status === this.teacherFilters.status;
      
      return employmentTypeMatch && specializationMatch && designationMatch && statusMatch;
    });
    
    this.currentTeacherPage = 1;
    this.selectedTeachers = [];
    this.isAllTeachersSelected = false;
    this.showTeacherFilters = false;
    this.showAlert('Filters applied successfully', 'success');
  }

  clearTeacherFilters() {
    this.teacherFilters = {
      employmentType: 'All Types',
      specialization: 'All Specializations',
      designation: 'All Designations',
      status: 'All Status'
    };
    this.filteredTeachers = [...this.teachersData];
    this.currentTeacherPage = 1;
    this.selectedTeachers = [];
    this.isAllTeachersSelected = false;
    this.showTeacherFilters = false;
    this.showAlert('Filters cleared', 'info');
  }

  // Student actions
  viewStudent(student: Student) {
    this.viewingStudent = student;
    this.showStudentDetailsModal = true;
    this.showAlert(`Viewing details for: ${student.firstName} ${student.lastName} (${student.id})`, 'info');
  }

  editStudent(student: Student) {
    this.editingStudent = { ...student };
    
    // Map values for form
    const educationLevelMap: {[key: string]: string} = {
      'Senior High': 'senior-high',
      'College': 'college'
    };
    
    const courseMap: {[key: string]: string} = {
      'Computer Science': 'cs',
      'Information Technology': 'it',
      'Business Administration': 'ba',
      'Engineering': 'eng'
    };
    
    const yearMap: {[key: string]: string} = {
      '1st Year': '1',
      '2nd Year': '2',
      '3rd Year': '3',
      '4th Year': '4'
    };

    this.editingStudent.educationLevel = educationLevelMap[student.educationLevel] || student.educationLevel;
    this.editingStudent.course = courseMap[student.course] || student.course;
    this.editingStudent.yearLevel = yearMap[student.yearLevel] || student.yearLevel;
    this.editingStudent.status = student.status.toLowerCase();
    
    this.showEditStudentModal = true;
  }

  softDeleteStudent(student: Student) {
    if (confirm(`Are you sure you want to delete ${student.firstName} ${student.lastName}? This can be undone from the trash bin.`)) {
      // Move to trash
      this.trashData.push({
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        type: 'Student',
        deletedDate: new Date().toISOString().split('T')[0],
        data: student
      });
      
      // Remove from active data
      this.studentsData = this.studentsData.filter(s => s.id !== student.id);
      this.filteredStudents = this.filteredStudents.filter(s => s.id !== student.id);
      this.selectedStudents = this.selectedStudents.filter(id => id !== student.id);
      
      this.showAlert(`Student ${student.firstName} ${student.lastName} moved to trash`, 'success');
    }
  }

  // Teacher actions
  viewTeacher(teacher: Teacher) {
    this.viewingTeacher = teacher;
    this.showTeacherDetailsModal = true;
    this.showAlert(`Viewing details for: ${teacher.firstName} ${teacher.lastName} (${teacher.id})`, 'info');
  }

  editTeacher(teacher: Teacher) {
    this.editingTeacher = { ...teacher };
    
    // Map values for form
    const employmentTypeMap: {[key: string]: string} = {
      'Full-time': 'full-time',
      'Part-time': 'part-time',
      'Contractual': 'contractual'
    };
    
    const specializationMap: {[key: string]: string} = {
      'Computer Science': 'cs',
      'Information Technology': 'it',
      'Business Administration': 'ba',
      'Engineering': 'eng',
      'Mathematics': 'math',
      'English': 'english'
    };
    
    const designationMap: {[key: string]: string} = {
      'Professor': 'professor',
      'Associate Professor': 'associate-professor',
      'Assistant Professor': 'assistant-professor',
      'Instructor': 'instructor'
    };
    
    const statusMap: {[key: string]: string} = {
      'Active': 'active',
      'Inactive': 'inactive',
      'On Leave': 'on-leave'
    };

    this.editingTeacher.employmentType = employmentTypeMap[teacher.employmentType] || teacher.employmentType;
    this.editingTeacher.specialization = specializationMap[teacher.specialization] || teacher.specialization;
    this.editingTeacher.designation = designationMap[teacher.designation] || teacher.designation;
    this.editingTeacher.status = statusMap[teacher.status] || teacher.status.toLowerCase();
    
    this.showEditTeacherModal = true;
  }

  softDeleteTeacher(teacher: Teacher) {
    if (confirm(`Are you sure you want to delete ${teacher.firstName} ${teacher.lastName}? This can be undone from the trash bin.`)) {
      // Move to trash
      this.trashData.push({
        id: teacher.id,
        name: `${teacher.firstName} ${teacher.lastName}`,
        type: 'Teacher',
        deletedDate: new Date().toISOString().split('T')[0],
        data: teacher
      });
      
      // Remove from active data
      this.teachersData = this.teachersData.filter(t => t.id !== teacher.id);
      this.filteredTeachers = this.filteredTeachers.filter(t => t.id !== teacher.id);
      this.selectedTeachers = this.selectedTeachers.filter(id => id !== teacher.id);
      
      this.showAlert(`Teacher ${teacher.firstName} ${teacher.lastName} moved to trash`, 'success');
    }
  }

  // Trash actions
  restoreRecord(record: TrashItem) {
    if (record.type === 'Student' && record.data) {
      this.studentsData.push(record.data);
      this.filteredStudents = [...this.studentsData];
    } else if (record.type === 'Teacher' && record.data) {
      this.teachersData.push(record.data);
      this.filteredTeachers = [...this.teachersData];
    }
    
    // Remove from trash
    this.trashData = this.trashData.filter(item => item.id !== record.id);
    this.showAlert(`${record.type} ${record.name} restored successfully`, 'success');
  }

  permanentlyDeleteRecord(record: TrashItem) {
    if (confirm(`Are you sure you want to permanently delete this ${record.type.toLowerCase()}? This action cannot be undone.`)) {
      this.trashData = this.trashData.filter(item => item.id !== record.id);
      this.showAlert(`${record.type} ${record.name} permanently deleted`, 'success');
    }
  }

  emptyTrash() {
    if (this.trashData.length === 0) {
      this.showAlert('Trash is already empty', 'info');
      return;
    }
    
    if (confirm(`Are you sure you want to permanently delete all ${this.trashData.length} items in the trash? This action cannot be undone.`)) {
      this.trashData = [];
      this.showAlert('Trash emptied successfully', 'success');
    }
  }

  // Modal methods
  openAddStudentModal() {
    this.newStudent = {
      firstName: '',
      lastName: '',
      middleName: '',
      email: '',
      phone: '',
      address: '',
      educationLevel: '',
      course: '',
      yearLevel: '',
      studentId: '',
      dob: '',
      gender: '',
      civilStatus: 'single',
      enrollmentDate: new Date().toISOString().split('T')[0],
      emergencyName: '',
      emergencyRelationship: '',
      emergencyPhone: '',
      emergencyEmail: ''
    };
    this.showAddStudentModal = true;
  }

  closeAddStudentModal() {
    this.showAddStudentModal = false;
  }

  openAddTeacherModal() {
    this.newTeacher = {
      firstName: '',
      lastName: '',
      middleName: '',
      email: '',
      phone: '',
      address: '',
      employmentType: '',
      specialization: '',
      designation: '',
      teacherId: '',
      dob: '',
      gender: '',
      status: 'active',
      hireDate: new Date().toISOString().split('T')[0]
    };
    this.showAddTeacherModal = true;
  }

  closeAddTeacherModal() {
    this.showAddTeacherModal = false;
  }

  closeEditStudentModal() {
    this.showEditStudentModal = false;
    this.editingStudent = null;
  }

  closeEditTeacherModal() {
    this.showEditTeacherModal = false;
    this.editingTeacher = null;
  }

  closeStudentDetailsModal() {
    this.showStudentDetailsModal = false;
    this.viewingStudent = null;
  }

  closeTeacherDetailsModal() {
    this.showTeacherDetailsModal = false;
    this.viewingTeacher = null;
  }

  openBulkActionsModal() {
    if (this.activeTab === 'students' && this.selectedStudents.length === 0) {
      this.showAlert('Please select at least one student', 'warning');
      return;
    }
    if (this.activeTab === 'teachers' && this.selectedTeachers.length === 0) {
      this.showAlert('Please select at least one teacher', 'warning');
      return;
    }
    
    this.bulkActionType = '';
    this.bulkActionDetails = {};
    this.showBulkActionsModal = true;
  }

  closeBulkActionsModal() {
    this.showBulkActionsModal = false;
    this.bulkActionType = '';
    this.bulkActionDetails = {};
  }

  // Form submissions
  addStudent() {
    // Generate student ID if not provided
    let studentId = this.newStudent.studentId;
    if (!studentId.trim()) {
      studentId = 'STI-2024-' + String(this.studentsData.length + 1).padStart(4, '0');
    }

    // Map values
    const courseMap: {[key: string]: string} = {
      'cs': 'Computer Science',
      'it': 'Information Technology',
      'ba': 'Business Administration',
      'eng': 'Engineering'
    };
    
    const yearMap: {[key: string]: string} = {
      '1': '1st Year',
      '2': '2nd Year',
      '3': '3rd Year',
      '4': '4th Year'
    };

    const educationLevelMap: {[key: string]: string} = {
      'senior-high': 'Senior High',
      'college': 'College'
    };

    const newStudent: Student = {
      id: studentId,
      firstName: this.newStudent.firstName,
      lastName: this.newStudent.lastName,
      middleName: this.newStudent.middleName || '',
      email: this.newStudent.email,
      phone: this.newStudent.phone,
      address: this.newStudent.address,
      dateOfBirth: this.newStudent.dob,
      gender: this.newStudent.gender,
      civilStatus: this.newStudent.civilStatus,
      educationLevel: educationLevelMap[this.newStudent.educationLevel] || this.newStudent.educationLevel,
      course: courseMap[this.newStudent.course] || this.newStudent.course,
      yearLevel: yearMap[this.newStudent.yearLevel] || this.newStudent.yearLevel,
      enrollmentDate: this.newStudent.enrollmentDate,
      status: 'Active',
      balance: 0,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        this.newStudent.firstName + '+' + this.newStudent.lastName
      )}&background=1a4b8c&color=fff`
    };

    // Add to data
    this.studentsData.unshift(newStudent);
    this.filteredStudents = [...this.studentsData];
    
    // Reset form and close modal
    this.closeAddStudentModal();
    this.currentStudentPage = 1;
    this.showAlert(`Student ${newStudent.firstName} ${newStudent.lastName} added successfully!`, 'success');
  }

  addTeacher() {
    // Generate teacher ID if not provided
    let teacherId = this.newTeacher.teacherId;
    if (!teacherId.trim()) {
      teacherId = 'TCH-2024-' + String(this.teachersData.length + 1).padStart(4, '0');
    }

    // Map values
    const employmentTypeMap: {[key: string]: string} = {
      'full-time': 'Full-time',
      'part-time': 'Part-time',
      'contractual': 'Contractual'
    };
    
    const specializationMap: {[key: string]: string} = {
      'cs': 'Computer Science',
      'it': 'Information Technology',
      'ba': 'Business Administration',
      'eng': 'Engineering',
      'math': 'Mathematics',
      'english': 'English'
    };
    
    const designationMap: {[key: string]: string} = {
      'professor': 'Professor',
      'associate-professor': 'Associate Professor',
      'assistant-professor': 'Assistant Professor',
      'instructor': 'Instructor'
    };
    
    const statusMap: {[key: string]: string} = {
      'active': 'Active',
      'inactive': 'Inactive',
      'on-leave': 'On Leave'
    };

    const newTeacher: Teacher = {
      id: teacherId,
      firstName: this.newTeacher.firstName,
      lastName: this.newTeacher.lastName,
      middleName: this.newTeacher.middleName || '',
      email: this.newTeacher.email,
      phone: this.newTeacher.phone,
      address: this.newTeacher.address,
      dateOfBirth: this.newTeacher.dob,
      gender: this.newTeacher.gender,
      employmentType: employmentTypeMap[this.newTeacher.employmentType] || this.newTeacher.employmentType,
      specialization: specializationMap[this.newTeacher.specialization] || this.newTeacher.specialization,
      designation: designationMap[this.newTeacher.designation] || this.newTeacher.designation,
      status: statusMap[this.newTeacher.status] || this.newTeacher.status,
      hireDate: this.newTeacher.hireDate,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
        this.newTeacher.firstName + '+' + this.newTeacher.lastName
      )}&background=1a4b8c&color=fff`
    };

    // Add to data
    this.teachersData.unshift(newTeacher);
    this.filteredTeachers = [...this.teachersData];
    
    // Reset form and close modal
    this.closeAddTeacherModal();
    this.currentTeacherPage = 1;
    this.showAlert(`Teacher ${newTeacher.firstName} ${newTeacher.lastName} added successfully!`, 'success');
  }

  updateStudent() {
    if (!this.editingStudent) return;

    // Map back the values for display
    const educationLevelMap: {[key: string]: string} = {
      'senior-high': 'Senior High',
      'college': 'College'
    };
    
    const courseMap: {[key: string]: string} = {
      'cs': 'Computer Science',
      'it': 'Information Technology',
      'ba': 'Business Administration',
      'eng': 'Engineering'
    };
    
    const yearMap: {[key: string]: string} = {
      '1': '1st Year',
      '2': '2nd Year',
      '3': '3rd Year',
      '4': '4th Year'
    };

    this.editingStudent.educationLevel = educationLevelMap[this.editingStudent.educationLevel] || this.editingStudent.educationLevel;
    this.editingStudent.course = courseMap[this.editingStudent.course] || this.editingStudent.course;
    this.editingStudent.yearLevel = yearMap[this.editingStudent.yearLevel] || this.editingStudent.yearLevel;
    this.editingStudent.status = this.editingStudent.status.charAt(0).toUpperCase() + this.editingStudent.status.slice(1);

    // Update the student in the array
    const index = this.studentsData.findIndex(s => s.id === this.editingStudent!.id);
    if (index > -1) {
      this.studentsData[index] = { ...this.editingStudent };
      this.filteredStudents = [...this.studentsData];
    }

    this.closeEditStudentModal();
    this.showAlert(`Student ${this.editingStudent.firstName} ${this.editingStudent.lastName} updated successfully!`, 'success');
  }

  updateTeacher() {
    if (!this.editingTeacher) return;

    // Map back the values for display
    const employmentTypeMap: {[key: string]: string} = {
      'full-time': 'Full-time',
      'part-time': 'Part-time',
      'contractual': 'Contractual'
    };
    
    const specializationMap: {[key: string]: string} = {
      'cs': 'Computer Science',
      'it': 'Information Technology',
      'ba': 'Business Administration',
      'eng': 'Engineering',
      'math': 'Mathematics',
      'english': 'English'
    };
    
    const designationMap: {[key: string]: string} = {
      'professor': 'Professor',
      'associate-professor': 'Associate Professor',
      'assistant-professor': 'Assistant Professor',
      'instructor': 'Instructor'
    };
    
    const statusMap: {[key: string]: string} = {
      'active': 'Active',
      'inactive': 'Inactive',
      'on-leave': 'On Leave'
    };

    this.editingTeacher.employmentType = employmentTypeMap[this.editingTeacher.employmentType] || this.editingTeacher.employmentType;
    this.editingTeacher.specialization = specializationMap[this.editingTeacher.specialization] || this.editingTeacher.specialization;
    this.editingTeacher.designation = designationMap[this.editingTeacher.designation] || this.editingTeacher.designation;
    this.editingTeacher.status = statusMap[this.editingTeacher.status] || this.editingTeacher.status;

    // Update the teacher in the array
    const index = this.teachersData.findIndex(t => t.id === this.editingTeacher!.id);
    if (index > -1) {
      this.teachersData[index] = { ...this.editingTeacher };
      this.filteredTeachers = [...this.teachersData];
    }

    this.closeEditTeacherModal();
    this.showAlert(`Teacher ${this.editingTeacher.firstName} ${this.editingTeacher.lastName} updated successfully!`, 'success');
  }

  // Bulk actions
  onBulkActionTypeChange() {
    // Reset details when action type changes
    this.bulkActionDetails = {};
  }

  get showBulkActionDetails() {
    return this.bulkActionType && this.bulkActionType !== '';
  }

  processBulkAction() {
    if (!this.bulkActionType) {
      this.showAlert('Please select an action', 'warning');
      return;
    }

    let count = 0;
    let successMessage = '';

    switch(this.bulkActionType) {
      case 'status':
        const newStatus = this.bulkActionDetails.newStatus;
        if (this.activeTab === 'students') {
          count = this.selectedStudents.length;
          this.studentsData.forEach(student => {
            if (this.selectedStudents.includes(student.id)) {
              student.status = newStatus;
            }
          });
          this.filteredStudents = [...this.studentsData];
          successMessage = `Status updated to "${newStatus}" for ${count} students`;
        } else {
          count = this.selectedTeachers.length;
          this.teachersData.forEach(teacher => {
            if (this.selectedTeachers.includes(teacher.id)) {
              teacher.status = newStatus;
            }
          });
          this.filteredTeachers = [...this.teachersData];
          successMessage = `Status updated to "${newStatus}" for ${count} teachers`;
        }
        break;

      case 'course':
        if (this.activeTab === 'students') {
          const newCourse = this.bulkActionDetails.newCourse;
          count = this.selectedStudents.length;
          this.studentsData.forEach(student => {
            if (this.selectedStudents.includes(student.id)) {
              student.course = newCourse;
            }
          });
          this.filteredStudents = [...this.studentsData];
          successMessage = `${count} students transferred to ${newCourse}`;
        } else {
          const newSpecialization = this.bulkActionDetails.newSpecialization;
          count = this.selectedTeachers.length;
          this.teachersData.forEach(teacher => {
            if (this.selectedTeachers.includes(teacher.id)) {
              teacher.specialization = newSpecialization;
            }
          });
          this.filteredTeachers = [...this.teachersData];
          successMessage = `Specialization updated to ${newSpecialization} for ${count} teachers`;
        }
        break;

      case 'year':
        const newYear = this.bulkActionDetails.newYear;
        count = this.selectedStudents.length;
        this.studentsData.forEach(student => {
          if (this.selectedStudents.includes(student.id)) {
            student.yearLevel = newYear;
          }
        });
        this.filteredStudents = [...this.studentsData];
        successMessage = `Year level updated to ${newYear} for ${count} students`;
        break;

      case 'export':
        const format = this.bulkActionDetails.exportFormat || 'csv';
        count = this.activeTab === 'students' ? this.selectedStudents.length : this.selectedTeachers.length;
        this.showAlert(`Exporting ${count} records as ${format.toUpperCase()}...`, 'info');
        setTimeout(() => {
          this.showAlert('Export completed! Download will start automatically.', 'success');
        }, 2000);
        break;

      case 'delete':
        if (confirm(`Are you sure you want to move ${this.selectedStudents.length || this.selectedTeachers.length} records to trash? This can be undone.`)) {
          if (this.activeTab === 'students') {
            count = this.selectedStudents.length;
            this.selectedStudents.forEach(studentId => {
              const student = this.studentsData.find(s => s.id === studentId);
              if (student) {
                // Move to trash
                this.trashData.push({
                  id: student.id,
                  name: `${student.firstName} ${student.lastName}`,
                  type: 'Student',
                  deletedDate: new Date().toISOString().split('T')[0],
                  data: student
                });
                
                // Remove from active data
                this.studentsData = this.studentsData.filter(s => s.id !== studentId);
                this.filteredStudents = this.filteredStudents.filter(s => s.id !== studentId);
              }
            });
            this.selectedStudents = [];
            this.isAllStudentsSelected = false;
          } else {
            count = this.selectedTeachers.length;
            this.selectedTeachers.forEach(teacherId => {
              const teacher = this.teachersData.find(t => t.id === teacherId);
              if (teacher) {
                // Move to trash
                this.trashData.push({
                  id: teacher.id,
                  name: `${teacher.firstName} ${teacher.lastName}`,
                  type: 'Teacher',
                  deletedDate: new Date().toISOString().split('T')[0],
                  data: teacher
                });
                
                // Remove from active data
                this.teachersData = this.teachersData.filter(t => t.id !== teacherId);
                this.filteredTeachers = this.filteredTeachers.filter(t => t.id !== teacherId);
              }
            });
            this.selectedTeachers = [];
            this.isAllTeachersSelected = false;
          }
          
          successMessage = `${count} records moved to trash`;
        } else {
          return;
        }
        break;
    }

    if (successMessage) {
      this.closeBulkActionsModal();
      this.showAlert(successMessage, 'success');
    }
  }

  // Search methods
  onStudentSearchChange() {
    const searchTerm = this.studentSearch.toLowerCase();
    if (!searchTerm) {
      this.filteredStudents = [...this.studentsData];
    } else {
      this.filteredStudents = this.studentsData.filter(student => 
        student.firstName.toLowerCase().includes(searchTerm) ||
        student.lastName.toLowerCase().includes(searchTerm) ||
        student.id.toLowerCase().includes(searchTerm) ||
        student.email.toLowerCase().includes(searchTerm) ||
        student.course.toLowerCase().includes(searchTerm)
      );
    }
    this.currentStudentPage = 1;
    this.selectedStudents = [];
    this.isAllStudentsSelected = false;
  }

  onTeacherSearchChange() {
    const searchTerm = this.teacherSearch.toLowerCase();
    if (!searchTerm) {
      this.filteredTeachers = [...this.teachersData];
    } else {
      this.filteredTeachers = this.teachersData.filter(teacher => 
        teacher.firstName.toLowerCase().includes(searchTerm) ||
        teacher.lastName.toLowerCase().includes(searchTerm) ||
        teacher.id.toLowerCase().includes(searchTerm) ||
        teacher.email.toLowerCase().includes(searchTerm) ||
        teacher.specialization.toLowerCase().includes(searchTerm)
      );
    }
    this.currentTeacherPage = 1;
    this.selectedTeachers = [];
    this.isAllTeachersSelected = false;
  }

  onQuickSearchChange() {
    const searchTerm = this.quickSearch.toLowerCase();
    
    if (this.activeTab === 'students') {
      if (!searchTerm) {
        this.filteredStudents = [...this.studentsData];
      } else {
        this.filteredStudents = this.studentsData.filter(student => 
          student.firstName.toLowerCase().includes(searchTerm) ||
          student.lastName.toLowerCase().includes(searchTerm) ||
          student.id.toLowerCase().includes(searchTerm) ||
          student.email.toLowerCase().includes(searchTerm)
        );
      }
      this.currentStudentPage = 1;
      this.selectedStudents = [];
      this.isAllStudentsSelected = false;
    } else if (this.activeTab === 'teachers') {
      if (!searchTerm) {
        this.filteredTeachers = [...this.teachersData];
      } else {
        this.filteredTeachers = this.teachersData.filter(teacher => 
          teacher.firstName.toLowerCase().includes(searchTerm) ||
          teacher.lastName.toLowerCase().includes(searchTerm) ||
          teacher.id.toLowerCase().includes(searchTerm) ||
          teacher.email.toLowerCase().includes(searchTerm)
        );
      }
      this.currentTeacherPage = 1;
      this.selectedTeachers = [];
      this.isAllTeachersSelected = false;
    }
  }

  // Alert helper method
  showAlert(message: string, type: 'success' | 'error' | 'warning' | 'info') {
    this.alert = {
      show: true,
      message,
      type
    };
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.alert.show = false;
    }, 5000);
  }

  getStudentPagesArray(): number[] {
  const pages = [];
  const totalPages = Math.ceil(this.filteredStudents.length / this.rowsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  return pages;
}

// Helper method para sa pagination
getTeacherPagesArray(): number[] {
  const pages = [];
  const totalPages = Math.ceil(this.filteredTeachers.length / this.rowsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }
  return pages;
}

// Helper method para sa encodeURIComponent
encodeURI(text: string): string {
  return encodeURIComponent(text);
}


  // Theme methods
  applyTheme() {
    // Check for saved theme preference or respect OS preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Set initial theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
      this.isDarkMode = true;
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    
    if (this.isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }
}