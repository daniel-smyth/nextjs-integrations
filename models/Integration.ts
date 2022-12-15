export interface Integration {
  name: string;
  options: {
    [key: string]: {
      value: string;
      validators: string[];
    };
  };
  field_mappings?: {
    [key: string]: string;
  };
  schema?: {
    [key: string]: string;
  };
  connected: boolean;
}
