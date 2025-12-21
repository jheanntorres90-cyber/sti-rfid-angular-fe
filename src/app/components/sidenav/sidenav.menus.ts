import { MenuItem } from './sidenav.interface';

export const ADMIN_MENUS: Record<string, MenuItem[]> = {
  Admin: [
    { label: 'Manage Admin', path: '/admin/manage-admin' },
  ],
};


export const ATS_MENUS: Record<string, MenuItem[]> = {
  Admin: [
    { label: 'Dashboard', path: '/admin/ats-dashboard' },
  ],
  Student: [
    { label: 'Dashboard', path: '/student/ats-dashboard' },
  ],
  Professor: [
    { label: 'Dashboard', path: '/professor/ats-dashboard' },
  ],
  Parent: [
    { label: 'Dashboard', path: '/parent/ats-dashboard' },
  ],
};

export const GPS_MENUS: Record<string, MenuItem[]> = {
  Admin: [
    { label: 'Dashboard', path: '/admin/gps-dashboard' },
  ],
  Student: [
    { label: 'Dashboard', path: '/student/gps-dashboard' },
  ],
  Professor: [
    { label: 'Dashboard', path: '/professor/gps-dashboard' },
  ],
  Parent: [
    { label: 'Dashboard', path: '/parent/gps-dashboard' },
  ],
};


