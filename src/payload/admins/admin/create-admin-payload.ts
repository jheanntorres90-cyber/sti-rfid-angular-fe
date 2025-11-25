export interface CreateAdminPayload {
  id: number;
  full_name: string;
  email: string;
  mobile_number: string;   
  username: string;  
  password: string;      
  imagePath: File | null;
}