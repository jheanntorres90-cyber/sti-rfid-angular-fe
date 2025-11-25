import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  apiUrl: 'http://dit-rfid.edu-nexus.org/api/v1',
  imageURL: 'http://dit-rfid.edu-nexus.org',
  appName: 'STI RFID',
  version: '1.0.0',
  apiTimeout: 30000,
  staticFilesUrl: 'http://dit-rfid.edu-nexus.org/api',
  appUrls: {
    id: '/auth',
  },
};