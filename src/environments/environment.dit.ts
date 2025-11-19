import { Environment } from './environment.model';

export const environment: Environment = {
  production: false,
  apiUrl: 'http://dit-rfid.arvin-stg.org/api',
  imageURL: 'http://dit-rfid.arvin-stg.org',
  appName: 'STI RFID',
  version: '1.0.0',
  apiTimeout: 30000,
  staticFilesUrl: 'http://dit-rfid.arvin-stg.org/api',
  appUrls: {
    id: '/auth',
  },
};