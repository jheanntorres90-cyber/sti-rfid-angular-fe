import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-announcements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './announcements.html',
  styleUrls: ['./announcements.scss']
})
export class AdminAnnouncementsComponent implements OnInit {
  announcements: any[] = [];
  alerts: any[] = [];
  
  // Form models
  newAnnouncement = {
    audience: '',
    course: '',
    subject: '',
    message: '',
    imageFile: null as File | null
  };
  
  editingAnnouncement: any = null;
  
  // Filter models
  filter = {
    audience: '',
    course: '',
    subject: '',
    date: ''
  };
  
  // Image previews
  imagePreview: string | null = null;
  editImagePreview: string | null = null;
  
  // Modal state
  isModalOpen = false;
  
  constructor() {}
  
  ngOnInit(): void {
    this.loadSampleData();
  }
  
  loadSampleData(): void {
    this.announcements = [
      {
        id: 0,
        audience: 'General',
        course: '',
        subject: 'System Maintenance',
        message: 'System maintenance scheduled for September 15 from 10 PM to 2 AM.',
        imageName: '',
        date: 'Sept 7, 2025'
      },
      {
        id: 1,
        audience: 'Students',
        course: 'BSIT',
        subject: 'Midterm Examinations',
        message: 'Midterm examinations will begin on October 15. Please check your schedule.',
        imageName: '',
        date: 'Sept 5, 2025'
      },
      {
        id: 2,
        audience: 'Teachers',
        course: '',
        subject: 'Faculty Meeting',
        message: 'There will be a faculty meeting this Friday at 3 PM in the conference room.',
        imageName: '',
        date: 'Sept 3, 2025'
      },
      {
        id: 3,
        audience: 'Parents',
        course: '',
        subject: 'Parent-Teacher Conference',
        message: 'The parent-teacher conference is scheduled for September 20. Please confirm your attendance.',
        imageName: '',
        date: 'Sept 1, 2025'
      }
    ];
  }
  
  createAnnouncement(): void {
    if (!this.newAnnouncement.audience || !this.newAnnouncement.message) {
      this.showAlert('Please fill in all required fields', 'error');
      return;
    }
    
    const newAnnouncement = {
      id: this.announcements.length,
      audience: this.newAnnouncement.audience,
      course: this.newAnnouncement.course || '',
      subject: this.newAnnouncement.subject,
      message: this.newAnnouncement.message,
      imageName: this.newAnnouncement.imageFile ? this.newAnnouncement.imageFile.name : '',
      date: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    };
    
    this.announcements.unshift(newAnnouncement);
    this.resetForm();
    this.showAlert('Announcement posted successfully!', 'success');
  }
  
  resetForm(): void {
    this.newAnnouncement = {
      audience: '',
      course: '',
      subject: '',
      message: '',
      imageFile: null
    };
    this.imagePreview = null;
  }
  
  editAnnouncement(announcement: any): void {
    this.editingAnnouncement = { ...announcement };
    this.isModalOpen = true;
  }
  
  updateAnnouncement(): void {
    if (!this.editingAnnouncement) return;
    
    const index = this.announcements.findIndex((a: any) => a.id === this.editingAnnouncement!.id);
    if (index !== -1) {
      this.announcements[index] = { ...this.editingAnnouncement };
    }
    
    this.closeModal();
    this.showAlert('Announcement updated successfully!', 'success');
  }
  
  removeImage(announcement: any): void {
    const index = this.announcements.findIndex((a: any) => a.id === announcement.id);
    if (index !== -1) {
      this.announcements[index].imageName = '';
      if (this.editingAnnouncement?.id === announcement.id) {
        this.editingAnnouncement.imageName = '';
      }
      this.showAlert('Image removed successfully!', 'success');
    }
  }
  
  deleteAnnouncement(id: number): void {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return;
    }
    
    this.announcements = this.announcements.filter((a: any) => a.id !== id);
    this.showAlert('Announcement deleted successfully!', 'success');
  }
  
  get filteredAnnouncements(): any[] {
    return this.announcements.filter((announcement: any) => {
      const audienceMatch = !this.filter.audience || 
        announcement.audience.toLowerCase().includes(this.filter.audience.toLowerCase());
      const courseMatch = !this.filter.course || 
        (announcement.course && announcement.course.toLowerCase().includes(this.filter.course.toLowerCase()));
      const subjectMatch = !this.filter.subject || 
        announcement.subject.toLowerCase().includes(this.filter.subject.toLowerCase());
      const dateMatch = !this.filter.date || 
        announcement.date.includes(this.filter.date);
      
      return audienceMatch && courseMatch && subjectMatch && dateMatch;
    });
  }
  applyFilters(): void {
  this.filter = { ...this.filter };
}

  
  clearFilters(): void {
    this.filter = {
      audience: '',
      course: '',
      subject: '',
      date: ''
    };
  }
  
  onFileSelected(event: Event, type: 'create' | 'edit'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      if (type === 'create') {
        this.newAnnouncement.imageFile = file;
        this.previewImage(file, 'create');
      } else {
        if (this.editingAnnouncement) {
          this.editingAnnouncement.imageName = file.name;
          this.previewImage(file, 'edit');
        }
      }
    }
  }
  
  previewImage(file: File, type: 'create' | 'edit'): void {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      if (type === 'create') {
        this.imagePreview = e.target.result;
      } else {
        this.editImagePreview = e.target.result;
      }
    };
    reader.readAsDataURL(file);
  }
  
  closeModal(): void {
    this.isModalOpen = false;
    this.editingAnnouncement = null;
    this.editImagePreview = null;
  }
  
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.closeModal();
  }
  
  exportToCSV(): void {
    const headers = ['Audience', 'Course', 'Subject', 'Message', 'Image', 'Date'];
    const csvData = this.announcements.map(announcement => [
      announcement.audience,
      announcement.course || '-',
      announcement.subject,
      announcement.message,
      announcement.imageName || 'No Image',
      announcement.date
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map((cell: any) => `"${cell}"`).join(','))
    ].join('\n');
    
    this.downloadFile(csvContent, 'announcements.csv', 'text/csv');
    this.showAlert('CSV exported successfully!', 'success');
  }
  
  exportToExcel(): void {
    const table = document.querySelector('#announcementTable')?.outerHTML;
    if (!table) return;
    
    const html = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
        <head>
          <meta charset="UTF-8">
          <!--[if gte mso 9]>
          <xml>
            <x:ExcelWorkbook>
              <x:ExcelWorksheets>
                <x:ExcelWorksheet>
                  <x:Name>Announcements</x:Name>
                  <x:WorksheetOptions>
                    <x:DisplayGridlines/>
                  </x:WorksheetOptions>
                </x:ExcelWorksheet>
              </x:ExcelWorksheets>
            </x:ExcelWorkbook>
          </xml>
          <![endif]-->
        </head>
        <body>
          ${table}
        </body>
      </html>
    `;
    
    this.downloadFile(html, 'announcements.xls', 'application/vnd.ms-excel');
    this.showAlert('Excel file exported successfully!', 'success');
  }
  
  private downloadFile(content: string, filename: string, type: string): void {
    const blob = new Blob([content], { type });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }
  
  showAlert(message: string, type: string = 'info', duration: number = 5000): void {
    const alertConfig: any = {
      success: { icon: 'fas fa-check-circle', title: 'Success' },
      info: { icon: 'fas fa-info-circle', title: 'Information' },
      warning: { icon: 'fas fa-exclamation-triangle', title: 'Warning' },
      error: { icon: 'fas fa-times-circle', title: 'Error' }
    };
    
    const config = alertConfig[type];
    const id = 'alert-' + Date.now();
    
    const alert = {
      id,
      type,
      title: config.title,
      message,
      icon: config.icon,
      duration
    };
    
    this.alerts.push(alert);
    
    if (duration > 0) {
      setTimeout(() => {
        this.removeAlert(id);
      }, duration);
    }
  }
  
  removeAlert(id: string): void {
    const alertElement = document.getElementById(id);
    if (alertElement) {
      alertElement.classList.remove('show');
      alertElement.classList.add('hide');
      
      setTimeout(() => {
        this.alerts = this.alerts.filter((alert: any) => alert.id !== id);
      }, 400);
    }
  }
  
  getAudienceBadgeClass(audience: string): string {
    return `audience-badge audience-${audience.toLowerCase()}`;
  }
  
  showNotifications(): void {
    this.showAlert('You have 3 new notifications', 'info');
  }
}