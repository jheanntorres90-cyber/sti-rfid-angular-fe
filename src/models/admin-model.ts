import { ApiResponse } from "./api-response.mode";

export type AdminModel = ApiResponse<AdminData[]>

export interface AdminData {
  id: number;
  full_name: string;
  email: string;
  mobile_number: string;
  username: string;
  image_path: string | null;
  created_at: string;
  updated_at: string;
}
