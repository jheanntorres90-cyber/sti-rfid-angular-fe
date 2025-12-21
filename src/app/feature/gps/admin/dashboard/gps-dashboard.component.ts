// dashboard.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, interval, animationFrameScheduler } from 'rxjs';
import { takeUntil, observeOn } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './gps-dashboard.component.html',
  styleUrls: ['./gps-dashboard.component.scss']
})
export class AdminGpsDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  // Initial stats values
  initialStats = {
    totalStudents: 1254,
    activeStudents: 1198,
    gradesEntered: 2847,
    pendingApproval: 12
  };
  
  // Animated stats (will be animated from 0)
  animatedStats = {
    totalStudents: 0,
    activeStudents: 0,
    gradesEntered: 0,
    pendingApproval: 0
  };
  
  // Activity feed for real-time updates
  private activityFeed = [
    'New student application submitted',
    'Payment processed successfully',
    'Grade submission completed',
    'System backup completed',
    'New teacher account created',
    'Course registration period opened',
    'Financial aid application approved',
    'Scholarship awarded',
    'Library book returned',
    'Lab equipment maintenance completed'
  ];
  
  private activityIcons = [
    'fas fa-user-plus',
    'fas fa-money-bill-wave',
    'fas fa-edit',
    'fas fa-database',
    'fas fa-chalkboard-teacher',
    'fas fa-clipboard-list',
    'fas fa-graduation-cap',
    'fas fa-award',
    'fas fa-book',
    'fas fa-tools'
  ];

  ngOnInit(): void {
    this.initDashboard();
    
    // Show welcome notification
    setTimeout(() => {
      this.showNotification('Welcome to Admin Dashboard! System is running smoothly.', 'success');
    }, 1000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initDashboard(): void {
    this.bindEvents();
    this.loadDashboardData();
    console.log('Dashboard initialized!');
  }

  private bindEvents(): void {
    // Events are handled through template (click) bindings
  }

  private loadDashboardData(): void {
    // Simulate loading data
    setTimeout(() => {
      this.animateStats();
    }, 500);
  }

  private animateStats(): void {
    // Animate each stat value from 0 to its final value
    Object.keys(this.initialStats).forEach((key, index) => {
      const statKey = key as keyof typeof this.initialStats;
      const finalValue = this.initialStats[statKey];
      this.animateValue(statKey, 0, finalValue, 1000 + (index * 200));
    });
  }

  private animateValue(statKey: keyof typeof this.animatedStats, start: number, end: number, duration: number): void {
    const startTime = Date.now();
    const updateInterval = 16; // ~60fps

    const animate = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
      const easedProgress = easeOut(progress);

      const currentValue = Math.floor(easedProgress * (end - start) + start);
      this.animatedStats = { ...this.animatedStats, [statKey]: currentValue };

      if (progress < 1) {
        setTimeout(animate, updateInterval);
      }
    };

    animate();
  }

  // Simulate real-time updates
  private simulateRealTimeUpdates(): void {
    // Start real-time updates after initial load
    setTimeout(() => {
      interval(30000)
        .pipe(
          takeUntil(this.destroy$),
          observeOn(animationFrameScheduler)
        )
        .subscribe(() => {
          this.addRandomActivity();
        });
    }, 5000);
  }

  private addRandomActivity(): void {
    const randomIndex = Math.floor(Math.random() * this.activityFeed.length);
    const randomActivity = this.activityFeed[randomIndex];
    
    // In a real app, you would update the recentActivities array
    console.log('New activity:', randomActivity);
    
    // You can update the DOM here if needed
    this.showNotification(`New activity: ${randomActivity}`, 'info');
  }

  // Template event handlers
  handleNotificationClick(): void {
    this.showNotification('You have 3 new notifications', 'info', 3000);
    
    // Simulate marking notifications as read
    setTimeout(() => {
      console.log('Notifications marked as read');
    }, 2000);
  }

  handleStatCardClick(event: Event): void {
    const card = event.currentTarget as HTMLElement;
    const statLabel = card.querySelector('.stat-label')?.textContent || '';
    const statValue = card.querySelector('.stat-value')?.textContent || '';
    
    this.showNotification(`Viewing details for: ${statLabel} (${statValue})`, 'info');
  }

  handleAnnouncementClick(event: Event): void {
    const card = event.currentTarget as HTMLElement;
    const title = card.querySelector('.announcement-title')?.textContent || '';
    
    this.showNotification(`Opening announcement: ${title}`, 'info');
  }

  onViewAllActivities(event: Event): void {
    event.preventDefault();
    this.showNotification('Loading all activities...', 'info');
  }

  // Notification utility (same functionality as JS version)
  private showNotification(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info', duration: number = 3000): void {
    console.log(`[${type.toUpperCase()}] ${message}`);
    
    // You can add a proper notification service here
    // For now, using console.log similar to original JS
    const styles = {
      success: 'background: #10b981; color: white; padding: 4px 8px; border-radius: 4px;',
      error: 'background: #ef4444; color: white; padding: 4px 8px; border-radius: 4px;',
      info: 'background: #3b82f6; color: white; padding: 4px 8px; border-radius: 4px;',
      warning: 'background: #f59e0b; color: white; padding: 4px 8px; border-radius: 4px;'
    };
    
    console.log(`%c${message}`, styles[type]);
  }
}