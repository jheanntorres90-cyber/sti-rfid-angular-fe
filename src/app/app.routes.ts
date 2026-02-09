import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout';
import { MainLayoutComponent } from './layouts/main/main-layout.component';
import { LandingComponent } from './feature/landing/landing';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full',
  },

  {
    path: 'landing',
    component: AuthLayoutComponent,
    children: [{ path: '', component: LandingComponent }],
  },

  // ========== ADMIN ==========
  {
    path: 'admin',
    component: MainLayoutComponent,
    children: [
      { path: 'ats-dashboard',
        loadComponent: () => import('./feature/ats/admin/dashboard/ats-dashboard.component').then(m => m.AdminAtsDashboardComponent) 
      },
      { path: 'gps-dashboard',
         loadComponent: () => import('./feature/gps/admin/dashboard/gps-dashboard.component').then(m => m.AdminGpsDashboardComponent) 
      },
      { path: 'manage-admin',
         loadComponent: () => import('./feature/admin/manage-admin/manage-admin.component').then(m => m.ManageAdminComponent) 
      },
      {path: 'grade-records',
         loadComponent: () => import('./feature/gps/admin/records-management/gps-records.component').then(m => m.AdminGpsDashboardComponent)
      
      },
      {path: 'grades-management',
         loadComponent: () => import('./feature/gps/admin/grades-management/gps-grades.components').then(m => m.AdminGpsGradesComponent)
      },
      {path: 'schedule-management',
        loadComponent: () => import('./feature/gps/admin/schedule-managment/gps-schedule').then(m => m.AdminGpsScheduleComponent)
      },
      {path: 'announcements-management',
        loadComponent: () => import('./feature/gps/admin/gps-announcements/gps-announcements').then(m => m.AdminGpsAnnouncementsComponent)
      },
      {path: 'data-management',
        loadComponent: () => import('./feature/gps/admin/data-management/data-management').then(m => m.AdminGpsDataManagementComponent)
      },
      {path: 'ats-attendance',
        loadComponent: () => import('./feature/ats/admin/attendance/ats-attendance.components').then(m => m.AdminAtsAttendanceComponent)
      },
      {path: 'ats-manage-students', 
        loadComponent: () => import('./feature/ats/admin/manage-students/ats-manage-students').then(m => m.ManageStudentsComponent)
      },
      {path: 'ats-schedule',
        loadComponent: () => import('./feature/ats/admin/schedule/ats-schedule').then(m => m.AdminScheduleComponent)
      },
      {path: 'ats-announcements',
        loadComponent: () => import('./feature/ats/admin/announcements/announcements').then(m => m.AdminAnnouncementsComponent)
      },
      {path: 'ats-settings',
        loadComponent: () => import('./feature/ats/admin/settings/settings').then(m => m.AdminSettingsComponent)
      },
      {path: 'ats-add-new-admin',
        loadComponent: () => import('./feature/ats/admin/add-new-admin/add-admin').then(m => m.AdminAddAdminComponent)
      },
    ]
  },

  // ========== STUDENT ==========
  {
    path: 'student',
    component: MainLayoutComponent,
    children: [
      { path: 'ats-dashboard', loadComponent: () => import('./feature/ats/student/dashboard/ats-dashboard.component').then(m => m.StudentAtsDashboardComponent) },
      { path: 'gps-dashboard', loadComponent: () => import('./feature/gps/student/dashboard/gps-dashboard.component').then(m => m.StudentGpsDashboardComponent) },
    ]
  },

  // ========== PROFESSOR ==========
  {
    path: 'professor',
    component: MainLayoutComponent,
    children: [
      { path: 'ats-dashboard', loadComponent: () => import('./feature/ats/professor/dashboard/ats-dashboard.component').then(m => m.ProfessorAtsDashboardComponent) },
      { path: 'gps-dashboard', loadComponent: () => import('./feature/gps/professor/dashboard/gps-dashboard.component').then(m => m.ProfessorGpsDashboardComponent) },
    ]
  },

  // ========== PARENT ==========
  {
    path: 'parent',
    component: MainLayoutComponent,
    children: [
      { path: 'ats-dashboard', loadComponent: () => import('./feature/ats/parent/dashboard/ats-dashboard.component').then(m => m.ParentAtsDashboardComponent) },
      { path: 'gps-dashboard', loadComponent: () => import('./feature/gps/parent/dashboard/gps-dashboard.component').then(m => m.ParentGpsDashboardComponent) },
    ]
  },

  // Fallback
  { path: '**', redirectTo: 'landing' },
];

