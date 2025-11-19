export interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
  isImage?: boolean; 
  isAction?: boolean;
  type?: 'text' | 'image' | 'actions';
  width?: string;
  actions?: { label: string; icon?: string; action: string }[];
}