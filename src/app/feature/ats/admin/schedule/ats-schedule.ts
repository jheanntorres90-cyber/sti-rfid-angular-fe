import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ScheduleEvent {
  id: number;
  academicYear: string;
  type: string;
  title: string;
  startDate: string;
  endDate: string;
  description: string;
  day: string;
  time: string;
}

interface Alert {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  duration: number;
  show: boolean;
  hide: boolean;
}

@Component({
  selector: 'app-admin-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ats-schedule.html',
  styleUrls: ['./ats-schedule.scss']
})
export class AdminScheduleComponent implements OnInit, OnDestroy {
  events: ScheduleEvent[] = [];
  alerts: Alert[] = [];
  isModalOpen = false;
  editEventId: number | null = null;
  
  // Form fields
  academicYear = '';
  eventType = '';
  eventTitle = '';
  dateStart = '';
  dateEnd = '';
  description = '';
  
  // Edit form fields
  editYear = '';
  editType = '';
  editTitle = '';
  editStart = '';
  editEnd = '';
  editDesc = '';
  
  // Filter fields
  filterType = '';
  filterYear = '';
  filterTitle = '';
  filterDate = '';
  
  // Calendar
  currentDate = new Date();
  currentMonth = this.currentDate.getMonth();
  currentYear = this.currentDate.getFullYear();
  calendarDays: any[] = [];

  isEditModalOpen = false;
  
  private alertCleanupInterval: any;
  
  ngOnInit(): void {
    this.loadSampleData();
    this.generateCalendar();
    this.setupAlertCleanup();
  }
  
  ngOnDestroy(): void {
    if (this.alertCleanupInterval) {
      clearInterval(this.alertCleanupInterval);
    }
  }
  
  private setupAlertCleanup(): void {
    this.alertCleanupInterval = setInterval(() => {
      this.alerts = this.alerts.filter(alert => !alert.hide);
    }, 500);
  }
  
  loadSampleData(): void {
    this.events = [
      {
        id: 0,
        academicYear: "2025-2026",
        type: "Regular Class",
        title: "First Semester Classes Begin",
        startDate: "2025-09-01",
        endDate: "2025-12-15",
        description: "Start of academic year 2025-2026",
        day: "Monday",
        time: "08:00 - 10:00"
      },
      {
        id: 1,
        academicYear: "2025-2026",
        type: "Examination",
        title: "Midterm Examinations",
        startDate: "2025-10-15",
        endDate: "2025-10-20",
        description: "Midterm exams for all courses",
        day: "Tuesday",
        time: "10:00 - 12:00"
      },
      {
        id: 2,
        academicYear: "2025-2026",
        type: "University Event",
        title: "University Foundation Day",
        startDate: "2025-11-20",
        endDate: "2025-11-20",
        description: "Annual celebration of university founding",
        day: "Wednesday",
        time: "01:00 - 03:00"
      },
      {
        id: 3,
        academicYear: "2025-2026",
        type: "Holiday",
        title: "National Heroes Day",
        startDate: "2025-08-26",
        endDate: "2025-08-26",
        description: "National holiday - no classes",
        day: "Thursday",
        time: "09:00 - 11:00"
      },
      {
        id: 4,
        academicYear: "2025-2026",
        type: "Class Suspension",
        title: "Faculty Development Day",
        startDate: "2025-07-15",
        endDate: "2025-07-15",
        description: "Classes suspended for faculty training",
        day: "Friday",
        time: "02:00 - 04:00"
      },
      {
        id: 5,
        academicYear: "2025-2026",
        type: "Regular Class",
        title: "Second Semester Classes Begin",
        startDate: "2026-01-06",
        endDate: "2026-04-15",
        description: "Start of second semester",
        day: "Monday",
        time: "08:00 - 10:00"
      },
      {
        id: 6,
        academicYear: "2025-2026",
        type: "Examination",
        title: "Final Examinations",
        startDate: "2026-04-20",
        endDate: "2026-04-25",
        description: "Final exams for all courses",
        day: "Tuesday",
        time: "10:00 - 12:00"
      },
      {
        id: 7,
        academicYear: "2025-2026",
        type: "Holiday",
        title: "Semester Break",
        startDate: "2025-12-16",
        endDate: "2026-01-05",
        description: "Semester break for students and faculty",
        day: "Various",
        time: "All Day"
      }
    ];
  }
  
  generateCalendar(): void {
    this.calendarDays = [];
    
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      this.calendarDays.push({ day: null, hasEvent: false });
    }
    
    // Add cells for each day of the month
    for (let i = 1; i <= lastDay; i++) {
      const hasEvent = this.hasEventOnDate(i, this.currentMonth, this.currentYear);
      const eventType = this.getEventTypeForDate(i, this.currentMonth, this.currentYear);
      const isToday = i === this.currentDate.getDate() && 
                      this.currentMonth === this.currentDate.getMonth() && 
                      this.currentYear === this.currentDate.getFullYear();
      
      this.calendarDays.push({
        day: i,
        hasEvent,
        eventTypeClass: eventType,
        isToday,
        selected: false
      });
    }
  }
  
  selectDate(day: any): void {
    if (!day.day) return;
    
    // Deselect all days
    this.calendarDays.forEach(d => d.selected = false);
    
    // Select clicked day
    day.selected = true;
    
    const selectedDate = new Date(this.currentYear, this.currentMonth, day.day);
    this.showAlert(`Selected date: ${selectedDate.toDateString()}`, 'info');
    
    // Filter schedule table to show events for this date
    this.filterDate = selectedDate.toISOString().split('T')[0];
    this.filterSchedule();
  }
  
  hasEventOnDate(day: number, month: number, year: number): boolean {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return this.events.some(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const checkDate = new Date(dateStr);
      
      return checkDate >= eventStart && checkDate <= eventEnd;
    });
  }
  
  getEventTypeForDate(day: number, month: number, year: number): string {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const event = this.events.find(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      const checkDate = new Date(dateStr);
      
      return checkDate >= eventStart && checkDate <= eventEnd;
    });
    
    if (event) {
      return this.getEventTypeClass(event.type);
    }
    return '';
  }
  
  getEventTypeClass(type: string): string {
    const typeMap: { [key: string]: string } = {
      'Regular Class': 'regular',
      'Examination': 'exam',
      'University Event': 'event',
      'Holiday': 'holiday',
      'Class Suspension': 'suspension'
    };
    return typeMap[type] || 'regular';
  }
  
  addNewEvent(): void {
    // Basic validation
    if (!this.academicYear || !this.eventType || !this.eventTitle || !this.dateStart) {
      this.showAlert('Please fill in all required fields!', 'error');
      return;
    }
    
    const newEvent: ScheduleEvent = {
      id: this.events.length,
      academicYear: this.academicYear,
      type: this.eventType,
      title: this.eventTitle,
      startDate: this.dateStart,
      endDate: this.dateEnd || this.dateStart,
      description: this.description,
      day: this.getDayOfWeek(this.dateStart),
      time: '08:00 - 17:00'
    };
    
    this.events.push(newEvent);
    this.showAlert('Schedule added successfully!', 'success');
    
    // Reset form
    this.academicYear = '';
    this.eventType = '';
    this.eventTitle = '';
    this.dateStart = '';
    this.dateEnd = '';
    this.description = '';
    
    this.generateCalendar();
  }
  
  editEvent(eventId: number): void {
    const event = this.events.find(e => e.id === eventId);
    if (!event) return;
    
    this.editEventId = eventId;
    this.editYear = event.academicYear;
    this.editType = event.type;
    this.editTitle = event.title;
    this.editStart = event.startDate;
    this.editEnd = event.endDate;
    this.editDesc = event.description;
    
    this.openModal();
  }
  
  updateEvent(): void {
    if (this.editEventId === null) return;
    
    const eventIndex = this.events.findIndex(e => e.id === this.editEventId!);
    if (eventIndex === -1) return;
    
    this.events[eventIndex] = {
      ...this.events[eventIndex],
      academicYear: this.editYear,
      type: this.editType,
      title: this.editTitle,
      startDate: this.editStart,
      endDate: this.editEnd || this.editStart,
      description: this.editDesc,
      day: this.getDayOfWeek(this.editStart)
    };
    
    this.showAlert('Schedule updated successfully!', 'success');
    this.closeModal();
    this.generateCalendar();
  }
  
  deleteEvent(eventId: number): void {
    if (confirm('Are you sure you want to delete this event?')) {
      this.events = this.events.filter(e => e.id !== eventId);
      this.showAlert('Event deleted successfully!', 'success');
      this.generateCalendar();
    }
  }
  
  openModal(): void {
    this.isModalOpen = true;
  }
  
  closeModal(): void {
    this.isModalOpen = false;
    this.editEventId = null;
    this.editYear = '';
    this.editType = '';
    this.editTitle = '';
    this.editStart = '';
    this.editEnd = '';
    this.editDesc = '';
  }
  
  getDayOfWeek(dateString: string): string {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(dateString);
    return days[date.getDay()];
  }
  
  formatDateDisplay(dateString: string): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }
  
  filterSchedule(): void {
    // The filtering logic will be applied in the template using pipes or computed properties
    // For now, we'll just trigger a change detection
  }
  
  getFilteredEvents(): ScheduleEvent[] {
    return this.events.filter(event => {
      const typeMatch = !this.filterType || event.type === this.filterType;
      const yearMatch = !this.filterYear || event.academicYear.toLowerCase().includes(this.filterYear.toLowerCase());
      const titleMatch = !this.filterTitle || event.title.toLowerCase().includes(this.filterTitle.toLowerCase());
      const dateMatch = !this.filterDate || event.startDate === this.filterDate;
      
      return typeMatch && yearMatch && titleMatch && dateMatch;
    });
  }
  
  getWeeklyEvents(): ScheduleEvent[] {
    // Get events for the current week (first 5 for demonstration)
    return this.events.slice(0, 5);
  }
  
  showNotifications(): void {
    this.showAlert('You have 3 new notifications', 'info');
  }
  
  showAlert(message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info', duration = 5000): void {
    const alertConfig = {
      success: { icon: 'fas fa-check-circle', title: 'Success' },
      info: { icon: 'fas fa-info-circle', title: 'Information' },
      warning: { icon: 'fas fa-exclamation-triangle', title: 'Warning' },
      error: { icon: 'fas fa-times-circle', title: 'Error' }
    };
    
    const config = alertConfig[type] || alertConfig.info;
    const alertId = 'alert-' + Date.now();
    
    const newAlert: Alert = {
      id: alertId,
      type,
      title: config.title,
      message,
      duration,
      show: false,
      hide: false
    };
    
    this.alerts.push(newAlert);
    
    // Animate in
    setTimeout(() => {
      const alert = this.alerts.find(a => a.id === alertId);
      if (alert) {
        alert.show = true;
      }
    }, 10);
    
    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.removeAlert(alertId);
      }, duration);
    }
  }
  
  removeAlert(alertId: string): void {
    const alertIndex = this.alerts.findIndex(a => a.id === alertId);
    if (alertIndex !== -1) {
      this.alerts[alertIndex].show = false;
      this.alerts[alertIndex].hide = true;
    }
  }
  
  removeAlertDirect(alertId: string): void {
    const alertIndex = this.alerts.findIndex(a => a.id === alertId);
    if (alertIndex !== -1) {
      this.alerts.splice(alertIndex, 1);
    }
  }
}