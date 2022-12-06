export interface Integration {
  name: string;
  options: {
    [key: string]: string;
  };
  field_mappings?: {
    [key: string]: string;
  };
  connected: boolean;
}
