export interface NavConfig {
  id: string;
  title: string;
  path: string;
  icon?: React.ReactNode;
  children?: NavConfig[];
} 