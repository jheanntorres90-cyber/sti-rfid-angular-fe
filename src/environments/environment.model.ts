export interface Environment {
  production: boolean;
  apiUrl: string;
  imageURL: string;
  appName: string;
  version: string;
  apiTimeout: number;
  staticFilesUrl: string;
  appUrls: {
    id: string;
  };
}