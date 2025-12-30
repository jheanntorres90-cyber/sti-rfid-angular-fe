import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Schedule {
  id: string;
  course: string;
  teacher: string;
  schedule: string;
  room: string;
  status: 'Active' | 'Conflict';
  day: string;
  startTime: string;
  endTime: string;
  duration: number;
  color: string;
}

interface Course {
  code: string;
  description: string;
}

@Component({
  selector: 'app-schedule-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gps-schedule.html',
  styleUrls: ['./gps-schedule.scss']
})
export class AdminGpsScheduleComponent implements OnInit {
  // Data properties
  scheduleData: Schedule[] = [];
  courseData: Course[] = [];
  filteredCourses: Course[] = [];
  
  // State properties
  currentWeekOffset = 0;
  currentScheduleId: string | null = null;
  activeTab: 'calendar' | 'list' = 'calendar';
  isSidebarOpen = false;
  isDarkMode = false;
  showCourseDropdown = false;
  
  // Modal states
  showAddModal = false;
  showDetailsModal = false;
  showBulkUploadModal = false;
  
  // Form properties
  formCourseCode = '';
  formTeacher = 'Prof. Rodriguez';
  formDay = 'Monday';
  formDuration = '2';
  formStartTime = '08:00';
  formEndTime = '10:00';
  formRoom = 'Room 301';
  
  // Upload properties
  selectedFile: File | null = null;
  uploadProgress = 0;
  showUploadProgress = false;
  
  // Alert properties
  alerts: Array<{message: string, type: 'success' | 'error' | 'warning' | 'info'}> = [];
  
  // College courses
  private collegeCourses: Course[] = [
    { code: 'STIC1002', description: 'Euthenics 1' },
    { code: 'GEDC1005', description: 'Math in the Modern World' },
    { code: 'NSTP1008', description: 'NSTP 1' },
    { code: 'GEDC1008', description: 'Understanding the Self' },
    { code: 'STIC1003', description: 'Computer Productivity Tools' },
    { code: 'PSYC1043', description: 'Introduction to Psychology' },
    { code: 'PHED1005', description: 'PE./PATH/FIT 1: (MCT)' },
    { code: 'GEDC1002', description: 'The Contemporary World' },
    { code: 'GEDC1006', description: 'Readings in Philippine History' },
    { code: 'PSYC1045', description: 'Developmental Psychology' },
    { code: 'GEDC1003', description: 'The Entrepreneurial Mind' },
    { code: 'PHED1007', description: 'PE./PATH/FIT 3: (I & DS)' },
    { code: 'PSYC1046', description: 'Physiological/Biological Psych' },
    { code: 'BUSS1001', description: 'Basic Microeconomics' },
    { code: 'GEDC1016', description: 'Purposive Communication' },
    { code: 'BUSS1005', description: 'Costing and Pricing' },
    { code: 'BUSS1007', description: 'Facilities Management' },
    { code: 'GEDC1014', description: 'Rizal\'s Life and Works' },
    { code: 'GEDC1041', description: 'Philippine Popular Culture' },
    { code: 'BUSS1017', description: 'International Business & Trade' },
    { code: 'CBMC1001', description: 'Operations Management (TOM)' },
    { code: 'GEDC1045', description: 'Great Books' },
    { code: 'BUSS1016', description: 'Good Governance & Social Resp' },
    { code: 'BUSS1019', description: 'Managerial Accounting' },
    { code: 'BUSS1015', description: 'Business Research' },
    { code: 'BUSS1027', description: 'Special Topics in Oper Mgt' },
    { code: 'BUSS1026', description: 'Marketing Management' },
    { code: 'BUSS1025', description: 'Entrepreneurial Management' },
    { code: 'STIC1007', description: 'Euthenics 2' },
    { code: 'BUSS1020', description: 'Financial Management' },
    { code: 'BUSS1024', description: 'Feasibility Study' },
    { code: 'CITE1004', description: 'Introduction to Computing' },
    { code: 'CITE1003', description: 'Computer Programming 1' },
    { code: 'PHED1001', description: 'Physical Education 1 (PF & C)' },
    { code: 'CITE1010', description: 'Computer Programming 3' },
    { code: 'COSC1006', description: 'Discrete Structures 2' },
    { code: 'COSC1001', description: 'Principles of Communication' },
    { code: 'COSC1003', description: 'Data Structures and Algorithms' },
    { code: 'COSC1021', description: 'Software Engineering 1' },
    { code: 'COSC1030', description: 'Intermediate Web Programming' },
    { code: 'COSC1028', description: 'Artificial Intelligence' },
    { code: 'COSC1014', description: 'Theory of Comput w/ Automata' },
    { code: 'COSC1048', description: 'Methods of Research' },
    { code: 'INTE1007', description: 'Quantitative Methods (DA)' },
    { code: 'INSY1010', description: 'Info Assurance & Sec (CF)' },
    { code: 'CITE1008', description: 'App Dev & Emerging Tech' },
    { code: 'INTE1005', description: 'Network Technology 1' },
    { code: 'INSY1005', description: 'Info Assurance & Sec (DP)' },
    { code: 'INSY1003', description: 'Prof Issues in Info Sys & Tech' },
    { code: 'BUSS1013', description: 'Technopreneurship' },
    { code: 'INSY1027', description: 'Software Quality Assurance' },
    { code: 'COSC1050', description: 'CS Thesis 2' },
    { code: 'COSC1008', description: 'Platform Technology (OS)' },
    { code: 'GEDC1010', description: 'Art Appreciation' },
    { code: 'GEDC1013', description: 'Science, Technology, & Society' },
    { code: 'CITE1006', description: 'Computer Programming 2' },
    { code: 'NSTP1010', description: 'NSTP 2' },
    { code: 'COSC1002', description: 'Discrete Structures 1 (DM)' },
    { code: 'GEDC1009', description: 'Ethics' },
    { code: 'PHED1006', description: 'P.E./PATHFIT 2: (EFA)' },
    { code: 'INTE1006', description: 'Systems Admin & Maintenance' },
    { code: 'COSC1007', description: 'Human-Computer Interaction' },
    { code: 'INTE1044', description: 'Object-Oriented Programming' },
    { code: 'INTE1021', description: 'Systems Integration & Arch' },
    { code: 'CITE1011', description: 'Information Management' },
    { code: 'INTE1020', description: 'Quantitative Methods' },
    { code: 'INTE1010', description: 'Integrative Programming' },
    { code: 'PHED1008', description: 'P.E./PATHFIT 4: (TS)' },
    { code: 'INSY1011', description: 'Advanced Database Systems' },
    { code: 'INTE1025', description: 'Data & Digital Comm (Data Com)' },
    { code: 'INTE1024', description: 'Event-Driven Programming' },
    { code: 'INTE1056', description: 'Advance Sys Integration & Arch' },
    { code: 'INTE1086', description: 'Enterprise Architecture' },
    { code: 'INTE1050', description: 'Game Development' },
    { code: 'INTE1039', description: 'IT Capstone Project 2' },
    { code: 'INTE1041', description: 'Computer Graphics Programming' },
    { code: 'INTE1013', description: 'IT Service Management' },
    { code: 'INTE1030', description: 'Network Technology 2' },
    { code: 'CTHC1003', description: 'Macro Pispctv of Tourism & Hosp' },
    { code: 'CTHC1004', description: 'Risk Mgt as Applied to SSS' },
    { code: 'CTHC1008', description: 'Quality Serv Mgt Tour & Hosp' },
    { code: 'TOUR1007', description: 'Accommodation Operations & Mgt' },
    { code: 'TOUR1008', description: 'Tour and Travel Management' },
    { code: 'TOUR1009', description: 'Sustainable Tourism' },
    { code: 'CTHC1010', description: 'Foreign Language 1' },
    { code: 'CTHC1013', description: 'Profe Dev & Applied Ethics' },
    { code: 'CTHC1014', description: 'Tourism & Hospitality Mrkq' },
    { code: 'TOUR1016', description: 'Applied Busi Tools & Tech Tour' },
    { code: 'CTHC1015', description: 'Multicultural Diversity in WTP' },
    { code: 'TOUR1020', description: 'Airline/ Flight Operations Mgt' },
    { code: 'TOUR1021', description: 'Research in Tourism' }
  ];

  // SHS courses
  private shsCourses: Course[] = [
    { code: 'CORE1001', description: '21st Century Literature' },
    { code: 'CORE1006', description: 'General Mathematics' },
    { code: 'CORE1013', description: 'Physical Education & Health 1' },
    { code: 'CORE1007', description: 'Intro to the Philo of Human' },
    { code: 'CORE1010', description: 'Oral Communication' },
    { code: 'CORE1009', description: 'Media and Information Literacy' },
    { code: 'SPECIAL101', description: 'Business Mathematics' },
    { code: 'SPECIAL106', description: 'Organization & Management' },
    { code: 'CORE1021', description: 'Homeroom G11-1st Term' },
    { code: 'CORE1017', description: 'Physical Science' },
    { code: 'CORE1012', description: 'Personal Development' },
    { code: 'APPLIED100', description: 'English for Academic & Prof' },
    { code: 'CORE1011', description: 'Pagbasa at Pagsusuri' },
    { code: 'APPLIED101', description: 'Practical Research 2' },
    { code: 'SPECIAL104', description: 'Funda of Accountancy, BM 2' },
    { code: 'CORE1015', description: 'Physical Education & Health 3' },
    { code: 'CORE1023', description: 'Homeroom G12-1st Term' },
    { code: 'CORE1025', description: 'Student Org & Clubs - G11-1st' },
    { code: 'CORE1027', description: 'Student Org & Clubs - G12-1st' },
    { code: 'SPECIAL105', description: 'Intro to World Rel & BS' },
    { code: 'SPECIAL1034', description: 'Disciplines & Ideas in the SS' },
    { code: 'SPECIAL1067', description: 'Philippine Politics & Gov' },
    { code: 'SPECIAL1026', description: 'Creative Nonfiction' },
    { code: 'SPECIAL1094', description: 'Computer/Web Programming 2' },
    { code: 'SPECIAL1093', description: 'Computer/Web Programming 1' },
    { code: 'SPECIAL109', description: 'Computer/Web Programming 4' },
    { code: 'SPECIAL1095', description: 'Computer/Web Programming 5' },
    { code: 'SPECIAL104', description: 'General Biology 1' },
    { code: 'SPECIAL106', description: 'Pre-Calculus' },
    { code: 'SPECIAL104', description: 'General Chemistry 1' },
    { code: 'SPECIAL104', description: 'General Physics 1' },
    { code: 'CORE1003', description: 'Disaster Readiness & Risk Redu' },
    { code: 'SPECIAL1059', description: 'Intro to Travel & Tour Ind' },
    { code: 'SPECIAL1037', description: 'Front Office Services 1' },
    { code: 'SPECIAL1073', description: 'Tourism Sales & Market Princ' },
    { code: 'SPECIAL1060', description: 'Introduction to Travel Service' }
  ];

  // Time slots for calendar
  timeSlots = [
    { time: '7:00', display: '7:00 AM' },
    { time: '8:00', display: '8:00 AM' },
    { time: '9:00', display: '9:00 AM' },
    { time: '10:00', display: '10:00 AM' },
    { time: '11:00', display: '11:00 AM' },
    { time: '12:00', display: '12:00 PM' },
    { time: '13:00', display: '1:00 PM' },
    { time: '14:00', display: '2:00 PM' },
    { time: '15:00', display: '3:00 PM' },
    { time: '16:00', display: '4:00 PM' },
    { time: '17:00', display: '5:00 PM' },
    { time: '18:00', display: '6:00 PM' },
    { time: '19:00', display: '7:00 PM' }
  ];

  // Days for calendar
  days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Teachers for dropdown
  teachers = ['Prof. Rodriguez', 'Prof. Santos', 'Prof. Martinez', 'Prof. Johnson', 'Prof. Garcia'];

  // Rooms for dropdown
  rooms = ['Room 301', 'Room 302', 'Room 401', 'Room 402', 'Room 501'];

  // Days for dropdown
  daysList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  // Durations for dropdown
  durations = [
    { value: '1', label: '1 hour' },
    { value: '1.5', label: '1.5 hours' },
    { value: '2', label: '2 hours' },
    { value: '3', label: '3 hours' }
  ];

  constructor(private elementRef: ElementRef) {}

  ngOnInit(): void {
    this.initializeCourseData();
    this.initializeScheduleData();
    this.checkThemePreference();
    this.filteredCourses = [...this.courseData];
  }

  private initializeCourseData(): void {
    this.courseData = [...this.collegeCourses, ...this.shsCourses];
  }

  private initializeScheduleData(): void {
    this.scheduleData = [
      {
        id: 'cs101-a',
        course: 'CS101 - Programming',
        teacher: 'Prof. Rodriguez',
        schedule: 'Mon/Wed 8:00-10:00 AM',
        room: 'Room 301',
        status: 'Active',
        day: 'Monday',
        startTime: '8:00 AM',
        endTime: '10:00 AM',
        duration: 2,
        color: 'schedule-cs'
      },
      {
        id: 'it101-b',
        course: 'IT101 - Systems',
        teacher: 'Prof. Santos',
        schedule: 'Wed/Fri 9:00-11:00 AM',
        room: 'Room 205',
        status: 'Active',
        day: 'Wednesday',
        startTime: '9:00 AM',
        endTime: '11:00 AM',
        duration: 2,
        color: 'schedule-it'
      },
      {
        id: 'cs201-a',
        course: 'CS201 - Data Structures',
        teacher: 'Prof. Garcia',
        schedule: 'Tue/Thu 10:00-12:00 PM',
        room: 'Room 302',
        status: 'Conflict',
        day: 'Tuesday',
        startTime: '10:00 AM',
        endTime: '12:00 PM',
        duration: 2,
        color: 'schedule-orange'
      },
      {
        id: 'ba101-c',
        course: 'BA101 - Business Ethics',
        teacher: 'Prof. Johnson',
        schedule: 'Mon/Fri 1:00-3:00 PM',
        room: 'Room 401',
        status: 'Active',
        day: 'Monday',
        startTime: '1:00 PM',
        endTime: '3:00 PM',
        duration: 2,
        color: 'schedule-ba'
      },
      {
        id: 'ma101-d',
        course: 'MA101 - Calculus',
        teacher: 'Prof. Lee',
        schedule: 'Tue/Thu 3:00-5:00 PM',
        room: 'Room 402',
        status: 'Active',
        day: 'Tuesday',
        startTime: '3:00 PM',
        endTime: '5:00 PM',
        duration: 2,
        color: 'schedule-purple'
      },
      {
        id: 'en101-e',
        course: 'EN101 - English',
        teacher: 'Prof. Martinez',
        schedule: 'Wed/Sat 4:00-6:00 PM',
        room: 'Room 501',
        status: 'Active',
        day: 'Saturday',
        startTime: '4:00 PM',
        endTime: '6:00 PM',
        duration: 2,
        color: 'schedule-brown'
      },
      {
        id: 'phy101-f',
        course: 'PHY101 - Physics',
        teacher: 'Prof. Wilson',
        schedule: 'Mon/Wed 7:00-9:00 AM',
        room: 'Room 301',
        status: 'Active',
        day: 'Monday',
        startTime: '7:00 AM',
        endTime: '9:00 AM',
        duration: 2,
        color: 'schedule-cs'
      },
      {
        id: 'chem101-g',
        course: 'CHEM101 - Chemistry',
        teacher: 'Prof. Brown',
        schedule: 'Thu/Sat 6:00-8:00 PM',
        room: 'Room 205',
        status: 'Active',
        day: 'Thursday',
        startTime: '6:00 PM',
        endTime: '8:00 PM',
        duration: 2,
        color: 'schedule-it'
      }
    ];
  }

  // Theme management
  private checkThemePreference(): void {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    this.isDarkMode = savedTheme === 'dark' || (!savedTheme && prefersDark);
    this.applyTheme();
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('theme', this.isDarkMode ? 'dark' : 'light');
    this.applyTheme();
  }

  private applyTheme(): void {
    if (this.isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  // Tab management
  switchTab(tab: 'calendar' | 'list'): void {
    this.activeTab = tab;
  }

  // Week navigation
  changeWeek(offset: number): void {
    this.currentWeekOffset += offset;
  }

  getWeekDisplay(): string {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() + (this.currentWeekOffset * 7)));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const startStr = weekStart.toLocaleDateString('en-US', options);
    const endStr = weekEnd.toLocaleDateString('en-US', options);
    
    return `Week of ${startStr} - ${endStr}, ${weekEnd.getFullYear()}`;
  }

  // Modal management
  openAddModal(): void {
    this.showAddModal = true;
    this.updateEndTime();
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.resetForm();
    this.showCourseDropdown = false;
  }

  openDetailsModal(schedule: Schedule): void {
    this.currentScheduleId = schedule.id;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.currentScheduleId = null;
  }

  openBulkUploadModal(): void {
    this.showBulkUploadModal = true;
    this.resetUploadState();
  }

  closeBulkUploadModal(): void {
    this.showBulkUploadModal = false;
    this.resetUploadState();
  }

  get conflictCount(): number {
  return this.scheduleData.filter(s => s.status === 'Conflict').length;
}

triggerFileInput(): void {
  const input = document.getElementById('excelFileInput') as HTMLInputElement | null;
  input?.click();
}

  // Form management
  resetForm(): void {
    this.formCourseCode = '';
    this.formTeacher = 'Prof. Rodriguez';
    this.formDay = 'Monday';
    this.formDuration = '2';
    this.formStartTime = '08:00';
    this.formEndTime = '10:00';
    this.formRoom = 'Room 301';
  }

  updateEndTime(): void {
    if (!this.formStartTime) return;
    
    const [hours, minutes] = this.formStartTime.split(':').map(Number);
    const duration = parseFloat(this.formDuration);
    
    let endHours = hours + Math.floor(duration);
    let endMinutes = minutes + ((duration % 1) * 60);
    
    if (endMinutes >= 60) {
      endHours += 1;
      endMinutes -= 60;
    }
    
    this.formEndTime = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`;
  }

  // Course dropdown
  filterCourses(searchTerm: string): void {
    if (!searchTerm) {
      this.filteredCourses = [...this.courseData];
      return;
    }
    
    const term = searchTerm.toLowerCase();
    this.filteredCourses = this.courseData.filter(course =>
      course.code.toLowerCase().includes(term) ||
      course.description.toLowerCase().includes(term)
    );
    this.showCourseDropdown = true;
  }

  selectCourse(course: Course): void {
    this.formCourseCode = course.code;
    this.showCourseDropdown = false;
  }

  // Schedule management
  saveSchedule(): void {
    if (!this.formCourseCode || !this.formTeacher || !this.formDay || !this.formStartTime || !this.formRoom) {
      this.showAlert('Please fill in all fields', 'warning');
      return;
    }

    const course = this.courseData.find(c => c.code === this.formCourseCode);
    const courseDescription = course ? course.description : 'Course';

    const newSchedule: Schedule = {
      id: `${this.formCourseCode.toLowerCase()}-${Date.now()}`,
      course: `${this.formCourseCode} - ${courseDescription}`,
      teacher: this.formTeacher,
      schedule: `${this.formDay} ${this.formatTime(this.formStartTime)}-${this.formatTime(this.formEndTime)}`,
      room: this.formRoom,
      status: 'Active',
      day: this.formDay,
      startTime: this.formatTime(this.formStartTime),
      endTime: this.formatTime(this.formEndTime),
      duration: parseFloat(this.formDuration),
      color: this.getCourseColor(this.formCourseCode)
    };

    this.scheduleData.push(newSchedule);
    this.showAlert('Schedule added successfully!', 'success');
    this.closeAddModal();
  }

  editSchedule(scheduleId: string): void {
    const schedule = this.scheduleData.find(s => s.id === scheduleId);
    if (schedule) {
      this.showAlert(`Editing schedule for ${schedule.course}`, 'info');
      this.openAddModal();
    }
  }

  resolveConflict(scheduleId: string): void {
    const schedule = this.scheduleData.find(s => s.id === scheduleId);
    if (schedule) {
      schedule.status = 'Active';
      this.showAlert(`Conflict resolved for ${schedule.course}`, 'success');
    }
  }

  // Calendar functions
  getScheduleForDayAndTime(day: string, time: string): Schedule | undefined {
    const formattedTime = this.formatTimeForCalendar(time);
    return this.scheduleData.find(schedule => 
      schedule.day === day && schedule.startTime === formattedTime
    );
  }

  // Export/Import
  exportSchedules(): void {
    this.showAlert('Exporting schedule data...', 'info');
    setTimeout(() => {
      this.showAlert('Schedule data exported successfully!', 'success');
    }, 2000);
  }

  importSchedules(): void {
    this.showAlert('Import functionality opened. Please use Bulk Upload for Excel files.', 'info');
  }

  // Bulk Upload
  resetUploadState(): void {
    this.selectedFile = null;
    this.uploadProgress = 0;
    this.showUploadProgress = false;
  }

  downloadTemplate(): void {
    this.showAlert('Downloading Excel template...', 'info');
    setTimeout(() => {
      this.showAlert('Template downloaded successfully!', 'success');
    }, 1000);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.validateFile(this.selectedFile);
    }
  }

  validateFile(file: File): void {
    const validTypes = ['.xlsx', '.xls'];
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    
    if (!fileExtension || !validTypes.includes(fileExtension)) {
      this.showAlert('Please select a valid Excel file (.xlsx or .xls)', 'error');
      return;
    }
    
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      this.showAlert('File size must be less than 10MB', 'error');
      return;
    }
    
    this.showAlert(`File "${file.name}" selected successfully!`, 'success');
  }

  processBulkUpload(): void {
    if (!this.selectedFile) {
      this.showAlert('Please select a file first', 'warning');
      return;
    }
    
    this.showUploadProgress = true;
    
    // Simulate upload
    const interval = setInterval(() => {
      this.uploadProgress += Math.random() * 10;
      if (this.uploadProgress >= 100) {
        this.uploadProgress = 100;
        clearInterval(interval);
        this.completeBulkUpload();
      }
    }, 200);
  }

  completeBulkUpload(): void {
    this.showAlert('Bulk upload completed successfully! Processing schedules...', 'success');
    
    setTimeout(() => {
      const newSchedules: Schedule[] = [
        {
          id: 'math201-' + Date.now(),
          course: 'MATH201 - Advanced Calculus',
          teacher: 'Prof. Davis',
          schedule: 'Mon/Wed 11:00 AM-1:00 PM',
          room: 'Room 303',
          status: 'Active',
          day: 'Monday',
          startTime: '11:00 AM',
          endTime: '1:00 PM',
          duration: 2,
          color: 'schedule-purple'
        },
        {
          id: 'phy102-' + Date.now(),
          course: 'PHY102 - Advanced Physics',
          teacher: 'Prof. Wilson',
          schedule: 'Tue/Thu 2:00 PM-4:00 PM',
          room: 'Room 304',
          status: 'Active',
          day: 'Tuesday',
          startTime: '2:00 PM',
          endTime: '4:00 PM',
          duration: 2,
          color: 'schedule-cs'
        }
      ];
      
      this.scheduleData = [...this.scheduleData, ...newSchedules];
      this.showAlert(`${newSchedules.length} new schedules added from bulk upload!`, 'success');
      this.closeBulkUploadModal();
    }, 1500);
  }

  // Drag and drop
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.selectedFile = event.dataTransfer.files[0];
      this.validateFile(this.selectedFile);
    }
  }

  // Alert system
  showAlert(message: string, type: 'success' | 'error' | 'warning' | 'info'): void {
    this.alerts.push({ message, type });
    setTimeout(() => {
      this.alerts.shift();
    }, 5000);
  }

  removeAlert(index: number): void {
    this.alerts.splice(index, 1);
  }

  // Helper functions
  private formatTime(timeString: string): string {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  }

  private formatTimeForCalendar(timeString: string): string {
    const [hours] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:00 ${ampm}`;
  }

  private getCourseColor(code: string): string {
    if (code.startsWith('CS') || code.startsWith('COSC') || code.startsWith('CITE') || 
        code.startsWith('INTE') || code.startsWith('INSY')) {
      return 'schedule-cs';
    } else if (code.startsWith('IT')) {
      return 'schedule-it';
    } else if (code.startsWith('BA') || code.startsWith('BUSS') || code.startsWith('CBMC')) {
      return 'schedule-ba';
    } else if (code.startsWith('MA') || code.startsWith('GEDC') || code.startsWith('CORE')) {
      return 'schedule-purple';
    } else if (code.startsWith('EN') || code.startsWith('STIC')) {
      return 'schedule-brown';
    } else if (code.startsWith('PHY') || code.startsWith('CHEM') || 
               code.startsWith('NSTP') || code.startsWith('PHED')) {
      return 'schedule-orange';
    } else if (code.startsWith('PSYC')) {
      return 'schedule-cs';
    } else if (code.startsWith('CTHC') || code.startsWith('TOUR')) {
      return 'schedule-ba';
    }
    
    return 'schedule-cs';
  }

  // Get details for modal
  getCurrentSchedule(): Schedule | undefined {
    return this.scheduleData.find(s => s.id === this.currentScheduleId);
  }

  // Event listeners
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const courseInput = this.elementRef.nativeElement.querySelector('#courseCode');
    const dropdown = this.elementRef.nativeElement.querySelector('.dropdown-list');
    
    if (courseInput && !courseInput.contains(target) && dropdown && !dropdown.contains(target)) {
      this.showCourseDropdown = false;
    }
  }

@HostListener('document:keydown.escape', ['$event'])
onEscapePress(event: Event): void {
  this.closeAddModal();
  this.closeDetailsModal();
  this.closeBulkUploadModal();
  this.showCourseDropdown = false;
}
  @HostListener('document:keydown', ['$event'])
onKeydown(event: KeyboardEvent): void {
  if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
    event.preventDefault();
    this.openAddModal();
  }
}

}