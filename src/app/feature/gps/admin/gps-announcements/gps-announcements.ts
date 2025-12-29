import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Announcement {
  id: number;
  title: string;
  content: string;
  priority: 'urgent' | 'high' | 'normal' | 'low';
  audience: string[];
  author: string;
  date: string;
  status: 'active' | 'inactive';
  pinned: boolean;
  views: number;
  attachments: any[];
  schedule?: string;    
  expiryDate?: string;
}

@Component({
  selector: 'app-announcements',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gps-announcements.html',
  styleUrls: ['./gps-announcements.scss']
})
export class AdminGpsAnnouncementsComponent implements OnInit {
  announcements: Announcement[] = [];
  filteredAnnouncements: Announcement[] = [];
  selectedAnnouncement: Announcement | null = null;
  currentAnnouncement: Announcement = this.getEmptyAnnouncement();
  
  searchTerm: string = '';
  filterPriority: string = 'all';
  filterAudience: string = 'all';
  filterStatus: string = 'all';
  
  showModal: boolean = false;
  showViewModal: boolean = false;
  modalMode: 'create' | 'edit' = 'create';
  
  stats = {
    total: 0,
    active: 0,
    pinned: 0,
    totalViews: 0
  };

  ngOnInit(): void {
    this.loadAnnouncements();
    this.updateStats();
    this.filterAnnouncements();
  }

  loadAnnouncements(): void {
    this.announcements = [
      {
        id: 1,
        title: "Enrollment for Second Semester Opens",
        content: "Enrollment for the Second Semester 2024-2025 will begin on October 15, 2024. Please prepare your documents and visit the Registrar's Office during office hours. Early enrollment is encouraged to secure your preferred schedule.",
        priority: "urgent",
        audience: ["students"],
        author: "Admin User",
        date: "2024-10-01",
        status: "active",
        pinned: true,
        views: 1247,
        attachments: [
          {
            name: "enrollment-schedule.jpg",
            type: "image/jpeg",
            url: "https://via.placeholder.com/400x300/1a4b8c/ffffff?text=Enrollment+Schedule"
          }
        ]
      },
       {
        id: 2,
        title: "Faculty Meeting - October 10",
        content:
        "All faculty members are required to attend the monthly faculty meeting on October 10, 2024, at 2:00 PM in the Conference Room. Agenda includes curriculum updates and semester planning.",
        priority: "high",
        audience: ["teachers"],
        author: "Admin User",
        date: "2024-09-28",
        status: "active",
        pinned: false,
        views: 89,
        attachments: []
      },
      {
        id: 2,
        title: "System Maintenance Notice",
        content: "All faculty members are required to attend the monthly faculty meeting on October 10, 2024, at 2:00 PM in the Conference Room. Agenda includes curriculum updates and semester planning.",
        priority: "high",
        audience: ["teachers"],
        author: "Admin User",
        date: "2024-09-28",
        status: "active",
        pinned: false,
        views: 89,
        attachments: []
      },
          {
      id: 3,
      title: "Library Extended Hours During Finals",
      content:
        "The library will extend its operating hours during the final examination period. Hours will be 7:00 AM to 10:00 PM from October 25 to November 5. Study rooms are available for reservation.",
      priority: "normal",
      audience: ["students"],
      author: "Admin User",
      date: "2024-09-22",
      status: "active",
      pinned: false,
      views: 634,
      attachments: [
        {
          name: "library-hours.jpg",
          type: "image/jpeg",
          url: "assets/uploads/library-hours.jpg"
        }
      ]
    },
      {
        id: 3,
        title: "Student Organization Fair - October 20",
        content: "Join us for the Student Organization Fair on October 20! All registered student organizations can set up booths to showcase activities and recruit new members. Registration deadline: October 15.",
        priority: "normal",
        audience: ["students", "organizations"],
        author: "Admin User",
        date: "2024-09-25",
        status: "active",
        pinned: true,
        views: 856,
        attachments: [
          {
            name: "organization-fair-poster.jpg",
            type: "image/jpeg",
            url: "https://via.placeholder.com/400x600/2d68b8/ffffff?text=Organization+Fair"
          }
        ]
      },
      
    ];
  }
  onFilesSelected(event: any): void {
  const files: FileList = event.target.files;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
      continue;
    }

    this.currentAnnouncement.attachments.push({
      name: file.name,
      type: file.type,
      url: URL.createObjectURL(file), // preview
      file: file
    });
  }

  event.target.value = '';
}

removeAttachment(index: number): void {
  this.currentAnnouncement.attachments.splice(index, 1);
}
  updateStats(): void {
    this.stats.total = this.announcements.length;
    this.stats.active = this.announcements.filter(a => a.status === 'active').length;
    this.stats.pinned = this.announcements.filter(a => a.pinned).length;
    this.stats.totalViews = this.announcements.reduce((sum, a) => sum + a.views, 0);
  }

  filterAnnouncements(): void {
    let filtered = [...this.announcements];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(term) ||
        a.content.toLowerCase().includes(term) ||
        a.author.toLowerCase().includes(term)
      );
    }

    if (this.filterPriority !== 'all') {
      filtered = filtered.filter(a => a.priority === this.filterPriority);
    }

    if (this.filterAudience !== 'all') {
      filtered = filtered.filter(a => a.audience.includes(this.filterAudience));
    }

    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(a => a.status === this.filterStatus);
    }

    this.filteredAnnouncements = filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.filterPriority = 'all';
    this.filterAudience = 'all';
    this.filterStatus = 'all';
    this.filterAnnouncements();
  }

  openCreateModal(): void {
    this.modalMode = 'create';
    this.currentAnnouncement = this.getEmptyAnnouncement();
    this.showModal = true;
  }

  editAnnouncement(announcement: Announcement): void {
    this.modalMode = 'edit';
    this.currentAnnouncement = { ...announcement };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.currentAnnouncement = this.getEmptyAnnouncement();
  }

  submitAnnouncement(): void {
    if (!this.currentAnnouncement.title.trim() || !this.currentAnnouncement.content.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    if (this.currentAnnouncement.audience.length === 0) {
      alert('Please select at least one target audience');
      return;
    }

    if (this.modalMode === 'create') {
      const newId = this.announcements.length > 0 
        ? Math.max(...this.announcements.map(a => a.id)) + 1 
        : 1;
      
      const newAnnouncement: Announcement = {
        ...this.currentAnnouncement,
        id: newId,
        date: new Date().toISOString().split('T')[0],
        views: 0
      };
      
      this.announcements.unshift(newAnnouncement);
    } else {
      const index = this.announcements.findIndex(a => a.id === this.currentAnnouncement.id);
      if (index !== -1) {
        this.announcements[index] = this.currentAnnouncement;
      }
    }

    this.updateStats();
    this.filterAnnouncements();
    this.closeModal();
  }

  viewAnnouncement(announcement: Announcement): void {
    this.selectedAnnouncement = announcement;
    announcement.views++;
    this.updateStats();
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
    this.selectedAnnouncement = null;
  }

  editFromView(): void {
    if (this.selectedAnnouncement) {
      this.closeViewModal();
      this.editAnnouncement(this.selectedAnnouncement);
    }
  }

  togglePin(id: number): void {
    const announcement = this.announcements.find(a => a.id === id);
    if (announcement) {
      announcement.pinned = !announcement.pinned;
      this.filterAnnouncements();
      this.updateStats();
    }
  }

  toggleStatus(id: number): void {
    const announcement = this.announcements.find(a => a.id === id);
    if (announcement) {
      announcement.status = announcement.status === 'active' ? 'inactive' : 'active';
      this.filterAnnouncements();
      this.updateStats();
    }
  }

  deleteAnnouncement(id: number): void {
    if (confirm('Are you sure you want to delete this announcement?')) {
      this.announcements = this.announcements.filter(a => a.id !== id);
      this.filterAnnouncements();
      this.updateStats();
    }
  }

  updateAudience(event: any, audience: string): void {
    if (event.target.checked) {
      if (!this.currentAnnouncement.audience.includes(audience)) {
        this.currentAnnouncement.audience.push(audience);
      }
    } else {
      this.currentAnnouncement.audience = this.currentAnnouncement.audience.filter(a => a !== audience);
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  private getEmptyAnnouncement(): Announcement {
    return {
      id: 0,
      title: '',
      content: '',
      priority: 'normal',
      audience: ['students'],
      author: 'Admin User',
      date: new Date().toISOString().split('T')[0],
      status: 'active',
      pinned: false,
      views: 0,
      attachments: [],
      schedule: '',
      expiryDate: ''
    };
  }
}