export interface Integration {
  name: string;
  options: {
    [key: string]: string;
  };
  connected: boolean;
}
